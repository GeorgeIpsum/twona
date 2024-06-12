import react from "@tilli-pro/eslint-config/react-internal.mjs";

const project = "./tsconfig.lint.json";

export default [
  ...react,
  {
    ignores: ["public", "build", "dist", "node_modules"],
    languageOptions: {
      parserOptions: { project },
    },
  },
];
