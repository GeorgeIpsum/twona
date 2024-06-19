import { tipc } from "@egoist/tipc/main";

import { db } from "./store";

const t = tipc.create();
const procedure = t.procedure;

export const router = {
  getIntegrations: procedure.action(async () => {
    return db.integration.findMany();
  }),
};

export type Router = typeof router;
