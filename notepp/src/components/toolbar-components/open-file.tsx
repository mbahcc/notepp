import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import IconButton from "@mui/material/IconButton";

interface OpenButtonProps {
  onOpen: () => void;
}

function OpenFile({ onOpen }: OpenButtonProps) {
  return (
    <IconButton>
      <FolderOpenIcon onClick={onOpen} />
    </IconButton>
  );
}

export default OpenFile;
