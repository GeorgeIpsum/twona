import { type Express } from "express";

import auth from "./auth/route";
import health from "./health/route";
import trpc from "./trpc/route";

export const routes = [auth, trpc, health];

export const setup = (app: Express) => {
  routes.forEach(({ setup, router }) => {
    setup?.(app);
    app.use(router);
  });
};
