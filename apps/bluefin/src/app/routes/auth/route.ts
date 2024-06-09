import { ExpressAuth } from "@auth/express";
import type { Express } from "express";

import { authConfig } from "~/app/services/auth";

const setup = (app: Express) => {
  app.set("trust proxy", true);
};

export const routes = {
  "/auth/*": ExpressAuth(authConfig),
};

export default {
  setup,
  routes,
} satisfies Bluefin.Sakai;
