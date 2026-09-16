import React from "react";
import { Editor } from "@tinymce/tinymce-react";

import tinymceConfig from "../config/tinymceConfig";

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder ="Write your content here...",
}) => {
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      value={value}
      onEditorChange={onChange}
      init={{
        ...tinymceConfig,
        placeholder,
      }}
    />
  );
};

export default RichTextEditor;
