import type { NextFunction, Request, Response } from "express";

const setup = async (req: Request, res: Response, next: NextFunction) => {
  res.locals.session = "";
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
