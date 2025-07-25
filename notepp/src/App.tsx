import "./App.css";
import Toolbar from "./components/toolbar";
import { useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import type { BaseEditor } from "slate";
import type { Descendant } from "slate";
import { ReactEditor } from "slate-react";

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

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
  const [editor] = useState(() => withReact(createEditor()));
  return (
    <main className="App">
      <Toolbar />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingTop: "180px",
        }}
      >
        <Slate editor={editor} initialValue={initialValue}>
          <div className="app-page">
            <Editable
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

export default App;
