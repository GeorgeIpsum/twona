/// <reference types="express" />

declare module "express" {
  interface Request {}

  interface Response {
    locals: Record<string, unknown> &
      Express.Locals & {
        session?: unknown;
      };
  }
}
