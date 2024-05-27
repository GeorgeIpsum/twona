import react from "@tilli-pro/eslint-config/react-internal.mjs";
import path from "node:path";

const project = path.resolve(process.cwd(), "tsconfig.lint.json");
console.log(project);

export default [
  ...react,
  {
    ignores: ["public", "build", "dist", "node_modules"],
    languageOptions: {
      parserOptions: { project },
    },
  },
];
