import FormatBoldIcon from "@mui/icons-material/FormatBold";
import React, { useState } from "react";

function FormatBold() {
  const [isBold, setIsBold] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      onClick={() => setIsBold(!isBold)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FormatBoldIcon />
    </div>
  );
}

export default FormatBold;
