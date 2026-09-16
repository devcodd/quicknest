const tinymceConfig = {
  height: 450,

  menubar: true,

  branding: false,

  plugins: [
    "advlist",
    "autolink",
    "lists",
    "link",
    "image",
    "charmap",
    "preview",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "wordcount",
  ],

  toolbar:
    "undo redo | " +
    "blocks | " +
    "bold italic underline strikethrough | " +
    "forecolor backcolor | " +
    "alignleft aligncenter alignright alignjustify | " +
    "bullist numlist outdent indent | " +
    "link image media | " +
    "table | " +
    "removeformat | " +
    "code fullscreen",

  content_style: `
    body {
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Helvetica,
        Arial,
        sans-serif;

      font-size: 14px;
      line-height: 1.7;
      color: #344054;
      padding: 10px;
    }

    p {
      margin: 0 0 12px;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: #172033;
    }

    a {
      color: #2563eb;
    }
  `,
};

export default tinymceConfig;
