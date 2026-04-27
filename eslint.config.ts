import { defineConfig, globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const ignores = [
  "**/dist/**",
  "**/node_modules/**",
  ".*",
  "docs/**",
  "**/*.d.ts",
  "**/*.config.ts",
];

export default defineConfig([
  eslint.configs.recommended,
  // eslintPluginUnicorn.configs.recommended,
  // tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  eslintConfigPrettier,
  {
    plugins: {
      unicorn: eslintPluginUnicorn,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "unicorn/no-array-for-each": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  globalIgnores(ignores),
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // 自定义
      "no-var": "off", //禁止使用var
      // 临时关闭未使用变量报错
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      // 临时关闭未使用私有变量报错的问题
      "no-unused-private-class-members": "off",
    },
  },
]);
