import { createTRPCProxyClient, httpLink } from "@trpc/client";
import type { BluefinTRPC } from "trpc";

import { env } from "../../env";

const api = createTRPCProxyClient<BluefinTRPC>({
  links: [
    httpLink({
      url: `${env.bluefinProtocol}://${env.bluefinHost}:${env.bluefinPort}${env.trpcEndpoint}`,
    }),
  ],
});

export default api;
