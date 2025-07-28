import FormatBoldIcon from "@mui/icons-material/FormatBold";
import { useState } from "react";
import { useSlate } from "slate-react";
import { Editor } from "slate";

function FormatBold() {
  const editor = useSlate();
  const [isHovered, setIsHovered] = useState(false);

  const marks = Editor.marks(editor);
  const isBold = marks?.bold === true;

  const toggleBold = () => {
    if (isBold) {
      Editor.removeMark(editor, "bold");
      console.log("Bold removed");
    } else {
      Editor.addMark(editor, "bold", true);
      console.log("Bold added");
    }
  };

  const handleBackgroundColor = () => {
    if (isHovered) return "#e0e0e0";
    if (isBold) return "#d0d0d0";
    if (isBold && isHovered) return "#d0d0d0";
    return "transparent";
  };

  return (
    <div
      className="tool-bar-inner-container-icon"
      style={{ backgroundColor: handleBackgroundColor() }}
      onClick={toggleBold}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FormatBoldIcon />
    </div>
  );
}

export default FormatBold;
