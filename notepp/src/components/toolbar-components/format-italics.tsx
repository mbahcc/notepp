import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import { useSlate } from "slate-react";
import { useState } from "react";
import { Editor } from "slate";

function FormatItalic() {
  const editor = useSlate();
  const [isHovered, setIsHovered] = useState(false);

  const marks = Editor.marks(editor);
  const isItalic = marks?.italic === true;

  const toggleItalic = () => {
    if (isItalic) {
      Editor.removeMark(editor, "italic");
      console.log("Italic removed");
    } else {
      Editor.addMark(editor, "italic", true);
      console.log("Italic added");
    }
  };

  const handleBackgroundColor = () => {
    if (isHovered) return "#e0e0e0";
    if (isItalic) return "#d0d0d0";
    if (isItalic && isHovered) return "#d0d0d0";
    return "transparent";
  };

  return (
    <div
      className="tool-bar-inner-container-icon"
      style={{ backgroundColor: handleBackgroundColor() }}
      onClick={toggleItalic}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FormatItalicIcon />
    </div>
  );
}

export default FormatItalic;
