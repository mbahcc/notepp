import { Node } from "slate";
import type { Descendant } from "slate";

// Convert Slate content to plain text
export const slateToText = (nodes: Descendant[]): string => {
  return nodes.map((n) => Node.string(n)).join("\n");
};

// Convert Monaco content to plain text
export const monacoToText = (text: string): Descendant[] => {
  return text.split("\n").map((line) => ({
    type: "paragraph",
    children: [{ text: line }],
  }));
};
