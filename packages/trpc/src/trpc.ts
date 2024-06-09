import { initTRPC } from "@trpc/server";
import { OpenApiMeta } from "trpc-openapi";
import { ZodError } from "zod";

export const createContext = async () => {
  return {};
};

const t = initTRPC
  .context<typeof createContext>()
  .meta<OpenApiMeta>()
  .create({
    errorFormatter: ({ shape, error }) => {
      return {
        ...shape,
        data: {
          ...shape.data,
          validationError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

export const router = t.router;
export const procedure = t.procedure;
export const guarded = t.procedure.use(async ({ ctx, next }) => {
  return next({
    ctx: {
      ...ctx,
    },
  });
});
