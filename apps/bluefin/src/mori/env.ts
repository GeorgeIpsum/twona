import "dotenv/config";

export default {
  protocol: process.env.BLUEFIN_PROTOCOL ?? "http",
  host: process.env.BLUEFIN_HOST ?? "localhost",
  port: process.env.BLUEFIN_PORT || 3000,
  debug: process.env.DEBUG === "true",
  env: process.env.NODE_ENV ?? "development",
  dev: process.env.NODE_ENV === "development" || !process.env.NODE_ENV,
  prod: process.env.NODE_ENV === "production",
  logLevel: process.env.LOG_LEVEL || "info",
  version: process.env.npm_package_version ?? "0.1.0",
};
