import bluefin from "./app";
import { timer } from "./mori";

(async () => {
  const { time } = timer();
  const server = await bluefin();
  if (server) {
    server.on("listening", () => time("Server started", "Startup Time"));
  }
})().catch(console.error);
