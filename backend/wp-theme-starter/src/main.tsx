import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { setupQAHelper } from "./lib/qaTest";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Setup QA test helper - run from devtools: window.__wpi_run_qa__()
setupQAHelper();
