import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { useAlignment } from "./format-alignment";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";

function FormatAlignRight() {
  const { toggleRightAlign } = useAlignment();
  const [isHovered, setIsHovered] = useState(false);

  const handleBackgroundColor = () => {
    if (isHovered) return "#e0e0e0";
  };

  return (
    <div
      className="tool-bar-inner-container-icon"
      onClick={toggleRightAlign}
      style={{ backgroundColor: handleBackgroundColor() }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconButton>
        <FormatAlignRightIcon />
      </IconButton>
    </div>
  );
}

export default FormatAlignRight;
