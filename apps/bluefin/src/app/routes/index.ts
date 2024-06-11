import { type Express } from "express";

import auth from "./auth/route";
import trpc from "./trpc/route";

export const routes = [auth.router, trpc.router];

export const setup = (app: Express) => {
  routes.forEach((router) => {
    app.use(router);
  });
};
