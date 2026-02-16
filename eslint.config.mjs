// eslint.config.mjs
// ESLint 9+ Flat Config with eslint-plugin-a11yinspect
// All 92 accessibility rules enabled via recommended config

import a11yinspect from "eslint-plugin-a11yinspect";

export default [
  {
    // Apply to JavaScript and JSX files
    files: ["**/*.{js,jsx,mjs,cjs}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        // Node globals (if needed)
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly"
      }
    },

    plugins: {
      a11yinspect
    },

    rules: {
      ...a11yinspect.configs.recommended.rules
    }
  },

  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      ".next/**",
      "out/**",
      "public/**",
      "*.min.js",
      "*.config.js",
      "*.config.mjs"
    ]
  }
];
