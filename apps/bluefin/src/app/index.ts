import cors from "cors";
import express from "express";
import { type Server, createServer } from "node:http";
import supertokens from "supertokens-node";

import { env, log, stdWarn } from "~/mori";
import { attachLogger } from "~/mori/log";
import { fmtRoutes, getExpressRoutes } from "~/mori/routes";

import { postSetup, preSetup, setup as setupWares } from "./middlewares";
import { setup as setupRoutes } from "./routes";

let server: Server;

async function main(listen?: () => void) {
  try {
    const app = express();

    app.disable("x-powered-by");
    app.use(
      cors({
        origin: "http://localhost:5173",
        allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
        credentials: true,
      }),
    );

    preSetup(app);

    app.use(express.json());
    app.use(attachLogger);

    setupWares(app);
    setupRoutes(app);

    postSetup(app);

    server = createServer(app);

    stdWarn({
      header: `🐟 Bluefin v${env.version}${env.prod ? "" : ` (${env.env})`}`,
      text: [
        `${env.protocol}://${env.host}:${env.port}`,
        ...fmtRoutes(getExpressRoutes(app, { spacer: 4 })),
      ],
    });

    return { server: server.listen(env.port, listen), app };
  } catch (e) {
    errorHandler(e as Error);
    return { server: null, app: null };
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
