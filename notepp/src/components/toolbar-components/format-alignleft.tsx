import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft"; // Importing the MUI icon for left alignment
import { useAlignment } from "./format-alignment";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";

function FormatAlignLeft() {
  const { toggleLeftAlign } = useAlignment();
  const [isHovered, setIsHovered] = useState(false);

  const handleBackgroundColor = () => {
    if (isHovered) return "#e0e0e0";
  };

  return (
    <div
      className="tool-bar-inner-container-icon"
      style={{ backgroundColor: handleBackgroundColor() }}
      onClick={toggleLeftAlign}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconButton>
        <FormatAlignLeftIcon />
      </IconButton>
    </div>
  );
}

export default FormatAlignLeft;
