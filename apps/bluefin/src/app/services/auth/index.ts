import type { ExpressAuth } from "@auth/express";
import battlenet from "@auth/express/providers/battlenet";
import discord from "@auth/express/providers/discord";
import faceit from "@auth/express/providers/faceit";
import instagram from "@auth/express/providers/instagram";
import spotify from "@auth/express/providers/spotify";
import twitch from "@auth/express/providers/twitch";
import twitter from "@auth/express/providers/twitter";
import { PrismaAdapter } from "@auth/prisma-adapter";

import db from "../db";

type AuthConfig = Parameters<typeof ExpressAuth>[0];

export const authConfig: AuthConfig = {
  providers: [
    /*battlenet,*/ discord,
    faceit,
    instagram,
    spotify({ clientId: "", clientSecret: "" }),
    twitch({ clientId: "", clientSecret: "" }),
    twitter,
  ],
  adapter: PrismaAdapter(db as Parameters<typeof PrismaAdapter>[0]),
};
