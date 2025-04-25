import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["src/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: [js.configs.recommended],
  },
  {
    files: ["src/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser }
  },
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
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