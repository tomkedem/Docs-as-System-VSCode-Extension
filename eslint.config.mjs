// eslint.config.mjs

import tseslint from "typescript-eslint";

export default tseslint.config(
  // Recommended default set for TypeScript
  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      // Here you can add or modify custom rules
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off"
    }
  }
);
