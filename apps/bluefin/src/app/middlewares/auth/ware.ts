import { type Express } from "express";
import type { NextFunction, Request, Response } from "express";
import {
  middleware as superTokens,
  errorHandler as superTokensError,
} from "supertokens-node/framework/express";
import Session from "supertokens-node/recipe/session";

const preSetup = (app: Express) => {
  const superTokensMiddleware = superTokens();
  Object.defineProperty(superTokensMiddleware, "name", {
    value: "superTokensMiddleware",
  });
  app.use(superTokensMiddleware);
};

const setup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await Session.getSession(req, res);
    const sessionUserId = session.getUserId();
    res.locals.session = session;
    res.locals.sessionUserId = sessionUserId;
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("Session does not exist")) {
      return next();
    }
    req.log.error(e);
  }
  next();
};

const postSetup = (app: Express) => {
  const superTokensErrorHandler = superTokensError();
  Object.defineProperty(superTokensErrorHandler, "name", {
    value: "superTokensErrorHandler",
  });
  app.use(superTokensErrorHandler);
};

const check = async (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.session) {
    return next(new Error("Unauthorized"));
  }

  return next();
};

export default {
  preSetup,
  postSetup,
  setup,
  check,
} satisfies Bluefin.Deba;
