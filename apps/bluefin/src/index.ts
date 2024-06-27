import bluefin from "./app";
import { initAuth } from "./app/services/auth";
import { timer } from "./mori";

(async () => {
  const { time } = timer();
  initAuth();
  const { server } = await bluefin();
  if (server) {
    server.on("listening", () => time("Server started", "Startup Time"));
  }
})().catch(console.error);
