import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { useList } from "./format-list";
import { useState } from "react";

function FormatNumberedList() {
  const { toggleNumberedList } = useList();
  const { isListActive } = useList();
  const [isHovered, setIsHovered] = useState(false);
  const isActive = isListActive("numbered-list");

  const toggleList = () => {
    if (isActive) {
      console.log("Removing numbered list");
    } else {
      console.log("Adding numbered list");
    }
    toggleNumberedList();
  };

  const handleBackgroundColor = () => {
    if (isHovered) return "#e0e0e0";
    if (isActive) return "#d0d0d0";
    return "transparent";
  };
  return (
    <div
      className="tool-bar-inner-container-icon"
      style={{ backgroundColor: handleBackgroundColor() }}
      onClick={toggleList}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FormatListNumberedIcon />
    </div>
  );
}
export default FormatNumberedList;
