import { useState } from "react";

import "./App.css";
import Router from "./pages/router";
import { RootProvider, server } from "./stores/root";

function App() {
  const [root] = useState(() => server.getRoot());

  return (
    <RootProvider value={root}>
      <Router />
    </RootProvider>
  );
}

export default App;
