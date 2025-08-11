import { Editor, Transforms, Element as SlateElement, Range, Point } from "slate";
import React from "react";

import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

const toggleMark = (editor: Editor, format: 'bold' | 'italic' | 'underline') => {
    const isActive = Editor.marks(editor)?.[format] === true;
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

export const handleSlateKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, editor: Editor & ReactEditor & HistoryEditor) => {
    // Handle indentation with Tab
    if (event.key === "Tab") {
        event.preventDefault();
        Editor.insertText(editor, "    "); // 4 spaces for indentation
        return;
    }

    // Handle exiting list items with Backspace
    if (event.key === "Backspace") {
        const { selection } = editor;
        if (selection && Range.isCollapsed(selection)) {
            const [match] = Editor.nodes(editor, {
                match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'list-item',
            });

            if (match) {
                const [, path] = match;
                const start = Editor.start(editor, path);

                if (Point.equals(selection.anchor, start)) {
                    event.preventDefault();
                    Transforms.unwrapNodes(editor, {
                        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && (n.type === 'bulleted-list' || n.type === 'numbered-list'),
                        split: true,
                    });
                    Transforms.setNodes(editor, { type: 'paragraph' });
                }
            }
        }
    }

    if (!event.ctrlKey) {
        return;
    }

    // Handle formatting shortcuts
    switch (event.key) {
        case "b":
            event.preventDefault();
            toggleMark(editor, 'bold');
            break;
        case "i":
            event.preventDefault();
            toggleMark(editor, 'italic');
            break;
        case "u":
            event.preventDefault();
            toggleMark(editor, 'underline');
            break;
        case "z":
            event.preventDefault();
            if (event.shiftKey) {
                editor.redo();
            } else {
                editor.undo();
            }
            break;
    }
};