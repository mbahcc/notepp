import type { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

// Define custom element types for the Slate editor
export type CustomElement = {
  type: "paragraph" | "bulleted-list" | "numbered-list" | "list-item";
  children: CustomText[];
  align?: "left" | "center" | "right";
};

// Define custom text formatting properties
export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

// Extend Slate's TypeScript definitions with our custom types
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
