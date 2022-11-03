import * as dotenv from "dotenv";
dotenv.config();

export default {
  port: parseInt(process.env.PORT ?? "2345", 10),
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID ?? "",
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? ""
};
