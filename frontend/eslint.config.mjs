import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  {
    ignores: [
        "**/node_modules/",
        ".next/",
        "src/app/editor/",
        "src/app/admin/",
        "src/app/components/",
        "src/app/dashboard/",
        "src/app/login/",
        "src/store/authStore.ts",
        "src/store/editorStore.ts",
    ]
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    plugins: {
      react: pluginReact,
      "@next/next": nextPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
        ...nextPlugin.configs.recommended.rules,
        ...nextPlugin.configs["core-web-vitals"].rules,
        // Note: you must disable the base rule as it can report incorrect errors
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  ...tseslint.configs.recommended,
];