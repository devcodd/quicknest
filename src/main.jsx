import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/richTextEditor.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// IMPORTANT: after Bootstrap
import "./assets/css/style.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
