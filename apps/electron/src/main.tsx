import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import ThemeProvider from "./features/theme/ThemeProvider.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(_event.sender, message);
});
