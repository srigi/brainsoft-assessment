/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended", // display Prettier errors as ESLint errors
  ],
  parser: "@typescript-eslint/parser",
  rules: {
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "prettier/prettier": ["warn", { endOfLine: "auto" }],
  },
};
