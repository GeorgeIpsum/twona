import {
  type CreateExpressContextOptions,
  createExpressMiddleware,
} from "@trpc/server/adapters/express";
import { Router } from "express";
import { appRouter } from "trpc";

const createContext = ({ req, res }: CreateExpressContextOptions) => {
  return {
    req,
    res,
    session: res.locals.session,
  };
};

const router = Router({ mergeParams: true });

const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
});

router.all("/", trpcMiddleware);

export default {
  routes: "/trpc",
  setup: undefined,
  router,
} satisfies Bluefin.Sakai;
