import { useState } from "react";
import FormatBold from "./toolbar-components/format-bold";
import FormatItalic from "./toolbar-components/format-italics";
import FormatUnderline from "./toolbar-components/format-underline";
import FormatAlignLeft from "./toolbar-components/format-alignleft";
import FormatAlignCenter from "./toolbar-components/format-aligncenter";
import FormatAlignRight from "./toolbar-components/format-alignright";
import FormatBulletedList from "./toolbar-components/format-bulletedlist";
import FormatNumberedList from "./toolbar-components/format-numberedlist";
import SaveButton from "./save-button";

function Toolbar() {
  const [title, setTitle] = useState("Untitled Npp Document");
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
        <input
          type="text"
          id="document-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            backgroundColor: "#f5f5f5",
            borderRadius: "50px",
            height: "35px",
            textAlign: "center",
            fontSize: "20px",
            border: "1px solid #e0e0e0",
            boxShadow:
              "0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
          }}
        />
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
              <FormatBold />
              <FormatItalic />
              <FormatUnderline />
              {/* <FormatInsertLink /> */}
              <FormatAlignLeft />
              <FormatAlignCenter />
              <FormatAlignRight />
              <FormatBulletedList />
              <FormatNumberedList />
              <SaveButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Toolbar;
