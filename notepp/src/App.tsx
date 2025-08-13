import "./App.css";
import Toolbar from "./components/toolbar-components/toolbar";
import { useCallback, lazy, Suspense } from "react";
import { Slate, Editable } from "slate-react";
import { useEditor } from "./hooks/app-hooks";
import { handleSlateKeyDown } from "./events/slate-key-handlers";
import CustomElementComponent from "./components/slate-components/custom-element";
import Leaf from "./components/slate-components/leaf";
import type { ElementProps } from "./components/slate-components/custom-element";
import type { LeafProps } from "./components/slate-components/leaf";

// Load Monaco Editor dynamically
const MonacoEditor = lazy(() => import("@monaco-editor/react"));

// Extend Window interface for Electron IPC communication
declare global {
  interface Window {
    electronAPI: {
      saveFile: (filePath: string, content: string) => Promise<boolean>;
      readFile: (filePath: string) => Promise<string | null>;
      showSaveDialog: (content: string) => Promise<boolean>;
      showOpenDialog: () => Promise<{
        filePath: string;
        content: string;
      } | null>;
    };
  }
}

function App() {
  const {
    editor,
    isCodeMode,
    slateValue,
    setSlateValue,
    monacoValue,
    setMonacoValue,
    filePath,
    statusMessage,
    handleSave,
    handleOpen,
  } = useEditor();

  // Memoized render functions to prevent unnecessary re-renders
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
          {/* Conditional rendering: Monaco for code mode, Slate for rich text */}
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
              {/* Rich text editor with custom rendering */}
              <Editable
                renderLeaf={renderLeaf}
                renderElement={renderElement}
                onKeyDown={(event) => handleSlateKeyDown(event, editor)}
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

export default App;
