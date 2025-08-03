import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft"; // Importing the MUI icon for left alignment
import { useAlignment } from "./format-alignment";
import { useState } from "react";

function FormatAlignLeft() {
  const { toggleLeftAlign } = useAlignment();
  const { isAlignmentActive } = useAlignment();
  const [isHovered, setIsHovered] = useState(false);

  const handleBackgroundColor = () => {
    if (isHovered) return "#e0e0e0";
    if (isAlignmentActive("left")) return "#d0d0d0";
    return "transparent";
  };

  return (
    <div
      className="tool-bar-inner-container-icon"
      style={{ backgroundColor: handleBackgroundColor() }}
      onClick={toggleLeftAlign}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FormatAlignLeftIcon />
    </div>
  );
}

export default FormatAlignLeft;
