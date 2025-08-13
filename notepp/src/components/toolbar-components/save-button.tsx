import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

interface SaveButtonProps {
  onSave: () => void;
}

const [isHovered, setIsHovered] = useState(false);

const handleBackgroundColor = () => {
  if (isHovered) return "#e0e0e0";
};

function SaveButton({ onSave }: SaveButtonProps) {
  return (
    <div
      className="tool-bar-inner-container-icon"
      style={{ backgroundColor: handleBackgroundColor() }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconButton aria-label="save" onClick={onSave}>
        <SaveIcon />
      </IconButton>
    </div>
  );
}

export default SaveButton;
