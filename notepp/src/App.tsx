import "./App.css";
import Toolbar from "./components/toolbar";
import { useState, useCallback, useEffect } from "react";
import {
  createEditor,
  Range,
  Point,
  Element as SlateElement,
  Node,
  Transforms,
} from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import type { BaseEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Editor } from "slate";
import { lazy, Suspense } from "react";

// Load Monaco Editor dynamically
const MonacoEditor = lazy(() => import("@monaco-editor/react"));

// Convert Slate content to plain text
const slateToText = (nodes: Descendant[]): string => {
  return nodes.map((n) => Node.string(n)).join("\n");
};

// Convert Monaco content to plain text
const monacoToText = (text: string): Descendant[] => {
  return text.split("\n").map((line) => ({
    type: "paragraph",
    children: [{ text: line }],
  }));
};

type CustomElement = {
  type: "paragraph" | "bulleted-list" | "numbered-list" | "list-item";
  children: CustomText[];
  align?: "left" | "center" | "right";
};
type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "Welcome to npp. Edit this to get started!" }],
  },
];

function App() {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [slateValue, setSlateValue] = useState<Descendant[]>(initialValue);
  const [monacoValue, setMonacoValue] = useState(slateToText(initialValue));

  // Toggle between Slate and Monaco editors using Ctrl + Shift + X
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "X") {
        e.preventDefault();
        if (isCodeMode) {
          // Switching to Slate from Monaco
          const newValue = monacoToText(monacoValue);
          setSlateValue(newValue);
          editor.children = newValue; // Update Slate editor state
          Transforms.select(editor, Editor.start(editor, [])); // Reset selection
        } else {
          // Switching to Monaco from Slate
          setMonacoValue(slateToText(slateValue));
        }
        setIsCodeMode(!isCodeMode);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCodeMode, monacoValue, slateValue, editor]);

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
        >
          <Toolbar />
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
