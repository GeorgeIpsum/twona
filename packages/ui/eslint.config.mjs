import react from "@tilli-pro/eslint-config/react-internal.mjs";
import path from "node:path";

const project = path.resolve(process.cwd(), "tsconfig.lint.json");

export default [
  ...react,
  {
    ignores: ["turbo/**"],
    languageOptions: {
      parserOptions: { project },
    },
  },
];
