import { Transforms, Editor, Element } from "slate";
import { useSlate } from "slate-react";

type AlignmentType = "left" | "center" | "right";

/**
 * Custom hook for handling text alignment in Slate.js editor
 * Provides functions to toggle and check alignment states
 */

export const useAlignment = () => {
  const editor = useSlate();

  /**
   * Toggle alignment for the current block element
   * @param alignment The alignment type to apply or remove
   */

  const toggleAlignment = (alignment: AlignmentType) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && (n as any).align === alignment,
    });

    const isActive = !!match;

    Transforms.setNodes(
      editor,
      { align: isActive ? undefined : alignment }, // Remove or set alignment
      {
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
        split: true,
      }
    );
  };

  /**
   * Check if a specific alignment is currently active
   * @param alignment The alignment type to check
   * @returns true if the alignment is active, false otherwise
   */

  const isAlignmentActive = (alignment: AlignmentType): boolean => {
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && (n as any).align === alignment,
    });
    return !!match;
  };

  const toggleLeftAlign = () => toggleAlignment("left");
  const toggleCenterAlign = () => toggleAlignment("center");
  const toggleRightAlign = () => toggleAlignment("right");

  return {
    toggleAlignment,
    toggleLeftAlign,
    toggleCenterAlign,
    toggleRightAlign,
    isAlignmentActive,
  };
};
