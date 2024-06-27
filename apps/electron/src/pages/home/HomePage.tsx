import { useEffect, useState } from "react";

import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

import Container from "~/components/layout/container";
import Debug from "~/components/singletons/Debug";
import { client } from "~/features/api/local";
import { IntegrationSignIn } from "~/features/integrations";

const HomePage: React.FC = () => {
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
      <h1 className="select-none">twona</h1>
      <h2>Link an account.</h2>
      {loading ? (
        "Loading..."
      ) : (
        <>
          <Link to="/auth/callback/google">Signin</Link>
          <Container>
            <div className="flex items-center justify-start gap-2">
              {integrations.map((integration) => (
                <IntegrationSignIn
                  key={integration.id}
                  integration={integration}
                />
              ))}
            </div>
          </Container>
          <h2>Create a widget.</h2>
          <Container>
            <div className="flex items-center justify-start gap-2">
              {integrations
                .filter((integration) => integration.widgetsEnabled)
                .map((integration) => (
                  <div
                    key={integration.id}
                    className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-2 rounded border-2 border-violet-950/20 bg-violet-950/10 p-2 shadow-none shadow-slate-400/40 transition-all duration-200 ease-in-out hover:border-slate-200/20 hover:bg-slate-950/80 hover:shadow-sm"
                  >
                    {integration.imageUrl && (
                      <img height="60" width="60" src={integration.imageUrl} />
                    )}
                    <span className="text-white">{integration.name}</span>
                  </div>
                ))}
            </div>
          </Container>
        </>
      )}

      <Debug />
    </>
  );
};

export default observer(HomePage);
