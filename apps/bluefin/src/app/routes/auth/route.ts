import { ExpressAuth } from "@auth/express";
import { type Express, Router } from "express";

import { authConfig } from "~/app/services/auth";

const setup = (app: Express) => {
  app.set("trust proxy", true);
};

const router = Router();

router.use("/auth/*", ExpressAuth(authConfig));

export default {
  setup,
  router,
} satisfies Bluefin.Sakai;
