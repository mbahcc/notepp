import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";

interface OpenButtonProps {
  onOpen: () => void;
}

const [isHovered, setIsHovered] = useState(false);

const handleBackgroundColor = () => {
  if (isHovered) return "#e0e0e0";
};

function OpenFile({ onOpen }: OpenButtonProps) {
  return (
    <div
      className="tool-bar-inner-container-icon"
      style={{ backgroundColor: handleBackgroundColor() }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconButton>
        <FolderOpenIcon onClick={onOpen} />
      </IconButton>
    </div>
  );
}

export default OpenFile;
