import { getSession } from "@auth/express";
import type { NextFunction, Request, Response } from "express";

import { authConfig } from "~/app/services/auth";

const setup = async (req: Request, res: Response, next: NextFunction) => {
  res.locals.session =
    res.locals.session ?? (await getSession(req, authConfig));
  next();
};

const check = async (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.session) {
    return next(new Error("Unauthorized"));
  }

  return next();
};

export default {
  setup,
  check,
} satisfies Bluefin.Deba;
