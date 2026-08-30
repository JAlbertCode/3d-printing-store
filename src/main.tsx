import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// the browser restores the previous scroll position after reload, which reads
// as the page auto-scrolling down; keep initial loads pinned to the top
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
