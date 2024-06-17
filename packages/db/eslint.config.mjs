import tsx from "@tilli-pro/eslint-config/tsx-base.mjs";

const project = "./tsconfig.json";

export default [
  ...tsx,
  {
    languageOptions: {
      parserOptions: { project },
    },
    ignoreFiles: ["dist"],
  },
];
