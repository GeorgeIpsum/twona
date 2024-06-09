import tsx from "@tilli-pro/eslint-config/tsx-base.mjs";
import path from "node:path";

const project = path.resolve(process.cwd(), "tsconfig.json");

export default [
  ...tsx,
  {
    languageOptions: {
      parserOptions: { project },
    },
  },
];
