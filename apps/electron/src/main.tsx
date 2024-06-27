import React from "react";

import ReactDOM from "react-dom/client";
import SuperTokens from "supertokens-web-js";
import EmailPassword from "supertokens-web-js/recipe/emailpassword";
import Session from "supertokens-web-js/recipe/session";
import ThirdParty from "supertokens-web-js/recipe/thirdparty";

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

SuperTokens.init({
  appInfo: {
    apiDomain: "http://localhost:3000",
    apiBasePath: "/auth",
    appName: "Twona",
  },
  // clientType: "web",
  recipeList: [Session.init(), EmailPassword.init(), ThirdParty.init()],
});
