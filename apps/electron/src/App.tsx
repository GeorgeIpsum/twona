import { useEffect, useState } from "react";

import "./App.css";
import Container from "./components/layout/container";
import Debug from "./components/singletons/Debug";
import { client } from "./local";

function App() {
  const [integrations, setIntegrations] = useState<
    Awaited<ReturnType<typeof client.getIntegrations>>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.getIntegrations().then((integrations) => {
      setIntegrations(integrations);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <h1>twona</h1>
      <h2>Create an integration.</h2>
      <Container>
        <div className="flex items-center justify-start gap-2">
          {loading
            ? "Loading..."
            : integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-2 rounded border-2 border-slate-950 bg-slate-950 p-2 transition-colors duration-200 ease-in-out hover:border-slate-200/20 hover:bg-slate-950/80"
                >
                  {integration.imageUrl && (
                    <img height="60" width="60" src={integration.imageUrl} />
                  )}
                  <span className="text-white">{integration.name}</span>
                </div>
              ))}
        </div>
      </Container>
      <Debug />
    </>
  );
}

export default App;
