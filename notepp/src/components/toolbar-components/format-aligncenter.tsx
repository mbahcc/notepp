import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import IconButton from "@mui/material/IconButton";
import { useAlignment } from "./format-alignment";
import { useState } from "react";

function FormatAlignCenter() {
  const { toggleCenterAlign } = useAlignment();
  const [isHovered, setIsHovered] = useState(false);

  const handleBackgroundColor = () => {
    if (isHovered) return "#e0e0e0";
  };

  return (
    <div
      className="tool-bar-inner-container-icon"
      style={{ backgroundColor: handleBackgroundColor() }}
      onClick={toggleCenterAlign}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconButton>
        <FormatAlignCenterIcon />
      </IconButton>
    </div>
  );
}
export default FormatAlignCenter;
