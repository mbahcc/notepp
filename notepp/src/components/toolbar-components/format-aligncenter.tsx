import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import { useAlignment } from "./format-alignment";
import { useState } from "react";

function FormatAlignCenter() {
  const { toggleCenterAlign } = useAlignment();
  const { isAlignmentActive } = useAlignment();
  const [isHovered, setIsHovered] = useState(false);

  const handleBackgroundColor = () => {
    if (isHovered) return "#e0e0e0";
    if (isAlignmentActive("center")) return "#d0d0d0";
    return "transparent";
  };
  return (
    <div
      className="tool-bar-inner-container-icon"
      style={{ backgroundColor: handleBackgroundColor() }}
      onClick={toggleCenterAlign}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FormatAlignCenterIcon />
    </div>
  );
}
export default FormatAlignCenter;
