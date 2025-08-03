import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { useAlignment } from "./format-alignment";
import { useState } from "react";

function FormatAlignRight() {
  const { toggleRightAlign } = useAlignment();
  const { isAlignmentActive } = useAlignment();
  const [isHovered, setIsHovered] = useState(false);

  const handleBackgroundColor = () => {
    if (isHovered) return "#e0e0e0";
    if (isAlignmentActive("right")) return "#d0d0d0";
    return "transparent";
  };

  return (
    <div
      className="tool-bar-inner-container-icon"
      style={{ backgroundColor: handleBackgroundColor() }}
      onClick={toggleRightAlign}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FormatAlignRightIcon />
    </div>
  );
}

export default FormatAlignRight;
