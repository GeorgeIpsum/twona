import config from "./config";
import server, { removeDeadClients } from "./server";

if(!config.spotifyClientId || !config.spotifyClientSecret) {
  throw new Error(`Missing spotify client values: [spotify client id: ${ !config.spotifyClientId }] [spotify client secret: ${ !config.spotifyClientSecret }]`)
}

const init = async () => {
  server.listen(config.port, () => {
    console.info("Server started");

    setInterval(() => {
      removeDeadClients();
    }, 1000);
  });
};
init();
