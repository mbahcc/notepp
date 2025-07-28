import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { useSlate } from "slate-react";
import { useState } from "react";
import { Editor } from "slate";

function FormatUnderline() {
  const editor = useSlate();
  const [isHovered, setIsHovered] = useState(false);

  const marks = Editor.marks(editor);
  const isUnderline = marks?.underline === true;

  const toggleUnderline = () => {
    if (isUnderline) {
      Editor.removeMark(editor, "underline");
      console.log("Underline removed");
    } else {
      Editor.addMark(editor, "underline", true);
      console.log("Underline added");
    }
  };

  const handleBackgroundColor = () => {
    if (isHovered) return "#e0e0e0";
    if (isUnderline) return "#d0d0d0";
    if (isUnderline && isHovered) return "#d0d0d0";
    return "transparent";
  };
  return (
    <div
      className="tool-bar-inner-container-icon"
      style={{ backgroundColor: handleBackgroundColor() }}
      onClick={toggleUnderline}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FormatUnderlinedIcon />
    </div>
  );
}

export default FormatUnderline;
