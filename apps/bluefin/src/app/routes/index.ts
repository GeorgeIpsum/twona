import { type Express } from "express";

import health from "./health/route";
import trpc from "./trpc/route";

export const routes = [trpc, health];
export const routePaths = routes.map(({ routes }) => routes).flat();

export const setup = (app: Express) => {
  routes.forEach(({ setup, router }) => {
    // setup?.(app);
    app.use(router);
  });
};
