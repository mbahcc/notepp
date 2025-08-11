import React from "react";
import type { CustomElement } from "../../types/slate";

export interface ElementProps {
  attributes: any;
  children: React.ReactNode;
  element: CustomElement;
}

const CustomElementComponent = (props: ElementProps) => {
  const { attributes, children, element } = props;
  const style: React.CSSProperties = {
    textAlign: element.align,
  };

  switch (element.type) {
    case "bulleted-list":
      style.listStylePosition = "inside";
      return (
        <ul {...attributes} style={style}>
          {children}
        </ul>
      );
    case "numbered-list":
      style.listStylePosition = "inside";
      return (
        <ol {...attributes} style={style}>
          {children}
        </ol>
      );
    case "list-item":
      return (
        <li {...attributes} style={style}>
          {children}
        </li>
      );
    case "paragraph":
    default:
      return (
        <p {...attributes} style={style}>
          {children}
        </p>
      );
  }
};

export default CustomElementComponent;
