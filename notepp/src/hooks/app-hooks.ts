import { useState, useEffect } from "react";
import {
  createEditor,
  Transforms,
  Element as SlateElement,
  Editor
} from "slate";
import type { Descendant } from "slate";
import { withReact, ReactEditor } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import { monacoToText, slateToText } from "../functions/slate-functions";
import { initialValue } from "../constants/app-constants";


export interface EditorHook {
  editor: Editor & ReactEditor & HistoryEditor;
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


export const useEditor = (): EditorHook => {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [slateValue, setSlateValue] = useState<Descendant[]>(initialValue);
const [monacoValue, setMonacoValue] = useState(slateToText(initialValue));
  const [filePath, setFilePath] = useState("Untitled Npp Document");
  const [statusMessage, setStatusMessage] = useState("Editor Ready");
    const [slateMetadata, setSlateMetadata] = useState<Partial<SlateElement>[]>([]);



  // To handle the keyboard shortcut for switching between mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "X") {
        e.preventDefault();
        setIsCodeMode(prevMode => !prevMode);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); 

useEffect(() => {
    if (isCodeMode) {
      const metadataToSave = slateValue.map((node) => {
        if (SlateElement.isElement(node)) {
          const { children, ...meta } = node;
          return meta; // Save all properties like type, align, etc.
        }
        return {};
      });
      setSlateMetadata(metadataToSave);
      setMonacoValue(slateToText(slateValue));
    } else {
       const baseNodes = monacoToText(monacoValue);
      const restoredNodes = baseNodes.map((node, index) => {
        const metadata = slateMetadata[index] || {};
        return { ...node, ...metadata }; // Combine plain text nodes with saved properties
      });
      setSlateValue(restoredNodes);
      editor.children = restoredNodes;
      Transforms.select(editor, Editor.start(editor, []));
    }
  }, [isCodeMode]);

  const handleSave = async () => {
    setStatusMessage(`Saving to ${filePath}...`);

    const contentToSave = isCodeMode 
        ? monacoValue 
        : JSON.stringify(slateValue);

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

        setFilePath(filePath);

        let newSlateValue: Descendant[];
        try {
          newSlateValue = JSON.parse(content || "[]");
        } catch (e) {
          console.error(
            "Failed to parse file content as JSON, treating as plain text.",
            e
          );
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
      setStatusMessage("Error opening file.");
    }
  };

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
 