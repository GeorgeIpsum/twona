import { createTRPCProxyClient, httpLink } from "@trpc/client";
import type { BluefinTRPC } from "trpc";

const api = createTRPCProxyClient<BluefinTRPC>({
  links: [
    httpLink({
      url: "http://localhost:3000/trpc",
    }),
  ],
});

export default api;
