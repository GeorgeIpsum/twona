import cors from "cors";
import express from "express";
import { type Server, createServer } from "node:http";

import { env, log, stdWarn } from "~/mori";

import { routes, setup } from "./routes";

let server: Server;

async function main(listen?: () => void) {
  try {
    stdWarn({
      header: `Bluefin v${env.version}${env.prod ? "" : ` (${env.env})`}`,
      text: [
        `${env.protocol}://${env.host}:${env.port}`,
        "REGISTERED ROUTES:",
        ...routes.map((r) => r.stack.map((s) => `🛜 ${s.regexp}`).join("\n")),
      ],
    });
    const app = express();
    app.use(cors());
    app.use(express.json());
    setup(app);

    server = createServer(app);
    return server.listen(env.port, listen);
  } catch (e) {
    errorHandler(e as Error);
    return null;
  }
}

const closeServer = () => {
  return new Promise<boolean>((res, rej) => {
    if (server)
      server.close((err) => {
        if (err) rej(err);
        else res(true);
      });
    else res(false);
  });
};

const exitHandler = () => {
  closeServer().then((closed) => {
    log.info("Server closed: ", closed);
    process.exit(1);
  });
};

const errorHandler = (error: Error) => {
  log.error(error);
  exitHandler();
};
process.on("uncaughtException", errorHandler);
process.on("unhandledRejection", errorHandler);

process.on("SIGTERM", () => {
  if (env.dev) log.info("SIGTERM received");
  exitHandler();
});

export default main;
