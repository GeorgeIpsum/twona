import { useEffect, useState } from "react";

import "./App.css";
import api from "./api";
import reactLogo from "./assets/react.svg";
import viteLogo from "/electron-vite.animate.svg";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    api.b.c.query().then((data) => {
      console.log("query success");
      console.log("data", data);
    });
  }, []);

  return (
    <>
      <div className="h-full w-full bg-red-500 text-blue-400">
        Tailwind is set up
      </div>
    </>
  );
}

export default App;
