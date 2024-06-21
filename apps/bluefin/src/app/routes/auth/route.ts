import { ExpressAuth } from "@auth/express";
import bodyParser from "body-parser";
import { type Express, Router } from "express";

import { authConfig } from "~/app/services/auth";

const setup = (app: Express) => {
  app.set("trust proxy", true);
};

const router = Router();

router.use(
  "/auth/*",
  bodyParser.urlencoded(),
  bodyParser.json(),
  (req, res, next) => {
    if (req.baseUrl.includes("signin"))
      console.log("BODY <<<<<<<<<<<", req.body);
    next();
  },
  ExpressAuth(authConfig),
);

export default {
  setup,
  router,
} satisfies Bluefin.Sakai;
