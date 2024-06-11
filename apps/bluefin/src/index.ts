import bluefin from "./app";
import { timer } from "./mori";

(async () => {
  const time = timer();
  const server = await bluefin();
  if (server) {
    server.once("listening", () => timer(time, "Server started"));
  }
})().catch(console.error);
