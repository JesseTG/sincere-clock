import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["src/**.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: ["node_modules/**", "dist/**"],
    plugins: { js },
    extends: [js.configs.recommended],
  },
  {
    files: ["src/**.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: ["node_modules/**", "dist/**"],
    languageOptions: { globals: globals.browser }
  },
  {
    extends: [tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn"
    },
  },
  {
    ...pluginReact.configs.flat['jsx-runtime'],
    plugins: {
      react: pluginReact,
    },
  },
  {
    ...pluginReactHooks.configs.recommended,
    plugins: {
      "react-hooks": pluginReactHooks,
    },
  },
]);