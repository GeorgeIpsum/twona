import { type Express } from "express";

import health from "./health/route";
import trpc from "./trpc/route";

export const routes: Bluefin.Sakai[] = [trpc, health];

export const setup = (app: Express) => {
  routes.forEach(({ setup, router, routes }) => {
    setup?.(app);
    Object.defineProperty(router, "name", { value: routes });
    app.use(routes, router);
  });
};
