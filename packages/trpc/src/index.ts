import * as trpc from "@trpc/server";

import { router } from "./trpc";

export const appRouter = router({});

export type BluefinTRPC = typeof appRouter;
export default trpc;
