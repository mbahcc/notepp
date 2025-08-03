import { Transforms, Editor, Element as SlateElement, Node } from "slate";
import { useSlate } from "slate-react";
import React from "react";

type ListType = "bulleted-list" | "numbered-list";
const LIST_TYPES: ListType[] = ["bulleted-list", "numbered-list"];

const isListType = (type: string): type is ListType => {
  return LIST_TYPES.includes(type as ListType);
};

const isCustomElement = (
  node: Node
): node is SlateElement & { type: string } => {
  return SlateElement.isElement(node) && "type" in node;
};

export const useList = () => {
  const editor = useSlate();

  const toggleList = (listType: ListType) => {
    const isActive = isListActive(listType);
    const isList = LIST_TYPES.some((type) => isListActive(type));

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && isCustomElement(n) && isListType(n.type),
      split: true,
    });

    let newProperties: any;
    if (isActive) {
      newProperties = { type: "paragraph" };
    } else if (isList) {
      newProperties = { type: "list-item" };
    } else {
      newProperties = { type: "list-item" };
    }

    Transforms.setNodes(editor, newProperties, {
      match: (n) =>
        !Editor.isEditor(n) && isCustomElement(n) && Editor.isBlock(editor, n),
    });

    if (!isActive) {
      const block = { type: listType, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  const isListActive = (listType: ListType): boolean => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) =>
          !Editor.isEditor(n) && isCustomElement(n) && n.type === listType,
      })
    );

    return !!match;
  };

  const isInList = (): boolean => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) && isCustomElement(n) && isListType(n.type),
      })
    );

    return !!match;
  };

  const isInListItem = (): boolean => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) && isCustomElement(n) && n.type === "list-item",
      })
    );

    return !!match;
  };

  const toggleBulletList = () => toggleList("bulleted-list");
  const toggleNumberedList = () => toggleList("numbered-list");

  const handleListEnter = (event: React.KeyboardEvent) => {
    if (!isInListItem()) return false;

    event.preventDefault();

    const { selection } = editor;
    if (!selection) return true;

    const [match] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && isCustomElement(n) && n.type === "list-item",
    });

    if (match) {
      const [, path] = match;
      const start = Editor.start(editor, path);
      const end = Editor.end(editor, path);
      const isEmptyListItem =
        Editor.string(editor, { anchor: start, focus: end }) === "";

      if (isEmptyListItem) {
        Transforms.unwrapNodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) && isCustomElement(n) && isListType(n.type),
          split: true,
        });
        Transforms.setNodes(editor, {
          type: "paragraph",
        } as Partial<SlateElement>);
      } else {
        Transforms.insertNodes(editor, {
          type: "list-item",
          children: [{ text: "" }],
        } as SlateElement);
      }
    }

    return true;
  };

  const exitList = () => {
    if (!isInListItem()) return;

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && isCustomElement(n) && isListType(n.type),
      split: true,
    });
    Transforms.setNodes(editor, { type: "paragraph" } as Partial<SlateElement>);
  };

  return {
    toggleBulletList,
    toggleNumberedList,
    isListActive,
    isInList,
    isInListItem,
    handleListEnter,
    exitList,
    toggleList,
  };
};
