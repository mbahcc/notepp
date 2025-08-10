import type { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

export type CustomElement = {
  type: "paragraph" | "bulleted-list" | "numbered-list" | "list-item";
  children: CustomText[];
  align?: "left" | "center" | "right";
};
export type CustomText = {
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
