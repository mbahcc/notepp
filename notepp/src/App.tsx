import "./App.css";
import Toolbar from "./components/toolbar";
import { useState, useCallback } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import type { BaseEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Editor } from "slate";

type CustomElement = { type: "paragraph"; children: CustomText[] };
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
  const renderLeaf = useCallback((props: LeafProps) => {
    return <Leaf {...props} />;
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
        <Slate editor={editor} initialValue={initialValue}>
          <Toolbar />
          <div className="app-page">
            <Editable
              renderLeaf={renderLeaf}
              onKeyDown={(event) => {
                // Handles indentation
                if (event.key === "Tab") {
                  event.preventDefault();
                  const { selection } = editor;
                  if (selection) {
                    Editor.insertText(editor, "    ");
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
        </Slate>
      </div>
    </main>
  );
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
