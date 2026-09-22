import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { initAppCheckIfConfigured } from "./auditAppCheck";
import "./styles.css";

initAppCheckIfConfigured();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
