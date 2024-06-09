import type { ExpressAuth } from "@auth/express";

type AuthConfig = Parameters<typeof ExpressAuth>[0];

export const authConfig: AuthConfig = {
  providers: [],
};
