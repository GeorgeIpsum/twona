import {
  type CreateExpressContextOptions,
  createExpressMiddleware,
} from "@trpc/server/adapters/express";
import { Router } from "express";
import { appRouter } from "trpc";

const createContext = (opts: CreateExpressContextOptions) => ({});

const router = Router({ mergeParams: true });

router.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

export default {
  routes: "/trpc",
  setup: undefined,
  router,
} satisfies Bluefin.Sakai;
