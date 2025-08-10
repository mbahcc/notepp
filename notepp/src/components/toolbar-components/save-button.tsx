import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";

interface SaveButtonProps {
  onSave: () => void;
}

function SaveButton({ onSave }: SaveButtonProps) {
  return (
    <IconButton aria-label="save" onClick={onSave}>
      <SaveIcon />
    </IconButton>
  );
}

export default SaveButton;
