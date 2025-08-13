import {
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  SaveButton,
  OpenFile,
} from "./index";

interface ToolbarProps {
  onSave: () => void;
  onOpen: () => void;
  filePath: string;
}

function Toolbar({ onSave, onOpen, filePath }: ToolbarProps) {
  const fileName = filePath.split(/[\\/]/).pop() || "Untitled";

  return (
    <div className="toolbar-container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingLeft: "40px",
          paddingTop: "20px",
        }}
      >
        <div
          id="document-title"
          style={{
            backgroundColor: "#f5f5f5",
            borderRadius: "50px",
            height: "35px",
            textAlign: "center",
            paddingTop: "5px",
            paddingBottom: "5px",
            paddingRight: "10px",
            paddingLeft: "10px",
            fontSize: "20px",
            border: "1px solid #e0e0e0",
            boxShadow:
              "0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
          }}
        >
          {fileName}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ paddingTop: "20px" }}>
          <div
            className="toolbar-inner-container"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingRight: "30px",
                paddingLeft: "30px",
                gap: "10px",
              }}
            >
              <FormatAlignLeft />
              <FormatAlignCenter />
              <FormatAlignRight />
              <SaveButton onSave={onSave} />
              <OpenFile onOpen={onOpen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Toolbar;
