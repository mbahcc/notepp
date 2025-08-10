import "./App.css";
import Toolbar from "./components/toolbar-components/toolbar";
import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import {
  createEditor,
  Transforms,
  Editor,
  Node,
  Element as SlateElement,
  Range,
  Point,
} from "slate";
import type { Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { monacoToText, slateToText } from "./functions/slate-functions";
import { initialValue } from "./constants/app-constants";
import "./types/slate";
import type { CustomElement } from "./types/slate";

// Load Monaco Editor dynamically
const MonacoEditor = lazy(() => import("@monaco-editor/react"));

function App() {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [slateValue, setSlateValue] = useState<Descendant[]>(initialValue);
  const [monacoValue, setMonacoValue] = useState(slateToText(initialValue));
  const [filePath, setFilePath] = useState("Untitled Npp Document");
  const [statusMessage, setStatusMessage] = useState("");
  type SlateMetaData = { align?: "left" | "center" | "right" };
  const [slateMetaData, setSlateMetaData] = useState<SlateMetaData[]>([]);
  // Toggle between Slate and Monaco editors using Ctrl + Shift + X

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "X") {
        e.preventDefault();
        if (isCodeMode) {
          // Switching to Slate from Monaco
          const baseNodes = monacoToText(monacoValue);
          const restoredNodes = baseNodes.map((node, index) => {
            const metaData = slateMetaData[index] || {};
            return { ...node, ...metaData };
          });
          setSlateValue(restoredNodes);
          editor.children = restoredNodes; // Update Slate editor state
          Transforms.select(editor, Editor.start(editor, [])); // Reset selection
        } else {
          // Switching to Monaco from Slate
          const metaDataToSave = slateValue.map((node) => {
            if (SlateElement.isElement(node) && node.align) {
              return { align: node.align };
            }
            return {};
          });
          setSlateMetaData(metaDataToSave);
          setMonacoValue(slateToText(slateValue));
        }
        setIsCodeMode(!isCodeMode);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCodeMode, monacoValue, slateValue, editor, slateMetaData]);

  const handleSave = async () => {
    setStatusMessage(`Saving to ${filePath}...`);

    let contentToSave: string;
    if (isCodeMode) {
      contentToSave = monacoValue;
    } else {
      contentToSave = JSON.stringify(slateValue);
    }

    try {
      const success = await window.electronAPI.showSaveDialog(contentToSave);
      if (success) {
        setStatusMessage(`File saved successfully to ${filePath}`);
      } else {
        setStatusMessage(`Failed to save file to ${filePath}`);
      }
    } catch (error) {
      console.error("Error saving file", error);
      setStatusMessage("Error saving file");
    }
  };

  const handleOpen = async () => {
    setStatusMessage("Opening file...");
    try {
      const result = await window.electronAPI.showOpenDialog();

      if (result && result.content !== null) {
        const { filePath, content } = result;

        // Update the file path state
        setFilePath(filePath);

        // The content from the file is a JSON string, so we must parse it
        let newSlateValue: Descendant[];
        try {
          newSlateValue = JSON.parse(content || "[]");
        } catch (e) {
          // If parsing fails, treat it as plain text
          console.error(
            "Failed to parse file content as JSON, treating as plain text.",
            e
          );
          newSlateValue = monacoToText(content || "");
        }

        editor.children = newSlateValue; // Directly update the editor's internal state
        Transforms.select(editor, Editor.start(editor, [])); // Reset the cursor to the beginning

        // Update both editors with the new content
        setSlateValue(newSlateValue);
        setMonacoValue(slateToText(newSlateValue));

        setStatusMessage(`Successfully opened ${filePath}`);
      } else {
        setStatusMessage("File open cancelled.");
      }
    } catch (error) {
      console.error("Error opening file:", error);
      setStatusMessage("Error opening file.");
    }
  };

  const renderLeaf = useCallback((props: LeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const renderElement = useCallback((props: ElementProps) => {
    return <CustomElementComponent {...props} />;
  }, []);

  return (
    <main className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingTop: "180px",
        }}
      >
        <Slate
          editor={editor}
          initialValue={slateValue}
          onChange={setSlateValue}
          key={filePath}
        >
          <Toolbar
            onSave={handleSave}
            onOpen={handleOpen}
            filePath={filePath}
          />

          {statusMessage && <p className="status-message">{statusMessage}</p>}
          {isCodeMode ? (
            <div className="app-page">
              <Suspense fallback={<div>Loading code editor...</div>}>
                <MonacoEditor
                  height="600px"
                  width="1300px"
                  language="cpp"
                  theme="vs-light"
                  value={monacoValue}
                  onChange={(value) => setMonacoValue(value || "")}
                  options={{
                    minimap: { enabled: false },
                    padding: { top: 20 },
                  }}
                />
              </Suspense>
            </div>
          ) : (
            <div className="app-page">
              <Editable
                renderLeaf={renderLeaf}
                renderElement={renderElement}
                onKeyDown={(event) => {
                  // Handles indentation
                  if (event.key === "Tab") {
                    event.preventDefault();
                    const { selection } = editor;
                    if (selection) {
                      Editor.insertText(editor, "    ");
                    }
                  }
                  // Handles exiting lists
                  if (event.key === "Backspace") {
                    const { selection } = editor;
                    if (selection && Range.isCollapsed(selection)) {
                      const [match] = Editor.nodes(editor, {
                        match: (n: Node) =>
                          !Editor.isEditor(n) &&
                          SlateElement.isElement(n) &&
                          n.type === "list-item",
                      });

                      if (match) {
                        const [, path] = match;
                        const start = Editor.start(editor, path);

                        if (Point.equals(selection.anchor, start)) {
                          event.preventDefault();
                          // Unwrap from the parent list ('bulleted-list' or 'numbered-list')
                          Transforms.unwrapNodes(editor, {
                            match: (n) =>
                              !Editor.isEditor(n) &&
                              SlateElement.isElement(n) &&
                              (n.type === "bulleted-list" ||
                                n.type === "numbered-list"),
                            split: true,
                          });
                          Transforms.setNodes(editor, { type: "paragraph" });
                        }
                      }
                    }
                  }
                  if (!event.ctrlKey) {
                    return;
                  }
                  switch (event.key) {
                    // Handles bold formatting
                    case "b": {
                      event.preventDefault();
                      const isActive = Editor.marks(editor)?.bold === true;
                      if (isActive) {
                        Editor.removeMark(editor, "bold");
                        console.log("Bold removed");
                      } else {
                        Editor.addMark(editor, "bold", true);
                        console.log("Bold added");
                      }
                      break;
                    }
                    // Handles undo/redo
                    case "z": {
                      if (event.shiftKey) {
                        event.preventDefault();
                        editor.redo();
                        console.log("Redo action triggered");
                      } else {
                        event.preventDefault();
                        editor.undo();
                        console.log("Undo action triggered");
                      }
                      break;
                    }
                    // Handles italic
                    case "i": {
                      event.preventDefault();
                      const isActive = Editor.marks(editor)?.italic === true;
                      if (isActive) {
                        Editor.removeMark(editor, "italic");
                        console.log("Italic removed");
                      } else {
                        Editor.addMark(editor, "italic", true);
                        console.log("Italic added");
                      }
                      break;
                    }
                    // Handles underline
                    case "u": {
                      event.preventDefault();
                      const isActive = Editor.marks(editor)?.underline === true;
                      if (isActive) {
                        Editor.removeMark(editor, "underline");
                        console.log("Underline removed");
                      } else {
                        Editor.addMark(editor, "underline", true);
                        console.log("Underline added");
                      }
                      break;
                    }
                  }
                }}
                style={{
                  width: "1300px",
                  height: "600px",
                  outline: "none",
                  padding: "20px",
                }}
              />
            </div>
          )}
        </Slate>
      </div>
    </main>
  );
}

interface ElementProps {
  attributes: any;
  children: React.ReactNode;
  element: CustomElement;
}

interface LeafProps {
  attributes: any;
  children: React.ReactNode;
  leaf: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

const CustomElementComponent = (props: ElementProps) => {
  const style = {
    textAlign: props.element.align || ("left" as "left" | "center" | "right"),
  };

  switch (props.element.type) {
    case "bulleted-list":
      return (
        <ul {...props.attributes} style={style}>
          {props.children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol {...props.attributes} style={style}>
          {props.children}
        </ol>
      );
    case "list-item":
      return (
        <li {...props.attributes} style={style}>
          {props.children}
        </li>
      );
    case "paragraph":
      return (
        <p {...props.attributes} style={style}>
          {props.children}
        </p>
      );
    default:
      return (
        <div {...props.attributes} style={style}>
          {props.children}
        </div>
      );
  }
};

const Leaf = (props: LeafProps) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal",
        fontStyle: props.leaf.italic ? "italic" : "normal",
        textDecoration: props.leaf.underline ? "underline" : "none",
      }}
    >
      {props.children}
    </span>
  );
};

export default App;
