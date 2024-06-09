import "dotenv/config";

export default {
  port: process.env.BLUEFIN_PORT || 3000,
  debug: process.env.DEBUG === "true",
  dev: process.env.NODE_ENV === "development",
  logLevel: process.env.LOG_LEVEL || "info",
};
