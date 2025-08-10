import { useState, useCallback, useEffect } from "react";
import {
  createEditor,
  Transforms,
  Editor,
  Node,
  Element as SlateElement,
} from "slate";
import type { Descendant } from "slate";
import { withReact } from "slate-react";
import { withHistory } from "slate-history";
import { monacoToText, slateToText } from "../functions/slate-functions";
import { initialValue } from "../constants/app-constants";

// Define the shape of the data our hook will return
export interface EditorHook {
  editor: Editor;
  isCodeMode: boolean;
  slateValue: Descendant[];
  setSlateValue: (value: Descendant[]) => void;
  monacoValue: string;
  setMonacoValue: (value: string) => void;
  filePath: string;
  statusMessage: string;
  handleSave: () => Promise<void>;
  handleOpen: () => Promise<void>;
}

// This is our custom hook!
export const useEditor = (): EditorHook => {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [slateValue, setSlateValue] = useState<Descendant[]>(initialValue);
  const [monacoValue, setMonacoValue] = useState(slateToText(initialValue));
  const [filePath, setFilePath] = useState("Untitled Npp Document");
  const [statusMessage, setStatusMessage] = useState("");
  type SlateMetaData = { align?: "left" | "center" | "right" };
  const [slateMetaData, setSlateMetaData] = useState<SlateMetaData[]>([]);

  // useEffect for toggling mode is pure logic, so it belongs here.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "X") {
        e.preventDefault();
        if (isCodeMode) {
          const baseNodes = monacoToText(monacoValue);
          const restoredNodes = baseNodes.map((node, index) => {
            const metaData = slateMetaData[index] || {};
            return { ...node, ...metaData };
          });
          setSlateValue(restoredNodes);
          editor.children = restoredNodes;
          Transforms.select(editor, Editor.start(editor, []));
        } else {
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

  // handleSave is pure logic, so it belongs here.
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
        setStatusMessage(`File saved successfully`);
      } else {
        setStatusMessage(`Save cancelled or failed.`);
      }
    } catch (error) {
      console.error("Error saving file", error);
      setStatusMessage("Error saving file");
    }
  };

  // handleOpen is pure logic, so it belongs here.
  const handleOpen = async () => {
    setStatusMessage("Opening file...");
    try {
      const result = await window.electronAPI.showOpenDialog();
      if (result && result.content !== null) {
        const { filePath, content } = result;
        setFilePath(filePath);
        let newSlateValue: Descendant[];
        try {
          newSlateValue = JSON.parse(content || "[]");
        } catch (e) {
          newSlateValue = monacoToText(content || "");
        }
        editor.children = newSlateValue;
        Transforms.select(editor, Editor.start(editor, []));
        setSlateValue(newSlateValue);
        setMonacoValue(slateToText(newSlateValue));
        setStatusMessage(`Successfully opened ${filePath}`);
      } else {
        setStatusMessage("File open cancelled.");
      }
    } catch (error) {
      console.error("Error opening file:", error);
      setStatusMessage("Error opening file");
    }
  };

  // The hook returns all the state and functions the UI will need.
  return {
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
  };
};