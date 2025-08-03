import { Transforms, Editor, Element } from "slate";
import { useSlate } from "slate-react";

type AlignmentType = "left" | "center" | "right";

export const useAlignment = () => {
  const editor = useSlate();
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

  const isAlignmentActive = (alignment: AlignmentType): boolean => {
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && (n as any).align === alignment,
    });
    return !!match;
  };

  // Then use it for specific alignments
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
