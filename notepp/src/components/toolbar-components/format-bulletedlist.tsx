import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useList } from "./format-list.tsx";
import { useState } from "react";

function FormatBulletedList() {
  const { toggleBulletList } = useList();
  const { isListActive } = useList();
  const [isHovered, setIsHovered] = useState(false);
  const isActive = isListActive("bulleted-list");

  const toggleList = () => {
    if (isActive) {
      console.log("Removing bulleted list");
    } else {
      console.log("Adding bulleted list");
    }
    toggleBulletList();
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
      <FormatListBulletedIcon />
    </div>
  );
}
export default FormatBulletedList;
