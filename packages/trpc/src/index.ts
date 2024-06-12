import { createContext, procedure, router } from "./trpc";

export const appRouter = router({
  b: router({
    c: procedure.query(async () => {
      return true;
    }),
  }),
});

export type BluefinTRPC = typeof appRouter;
export { createContext };
