// eslint.config.mjs
// ESLint 9+ Flat Config with eslint-plugin-a11yinspect
// Full example with all accessibility rules (split into error and warning)

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
      // ========================================
      // IMAGES & MEDIA
      // ========================================
      "a11yinspect/img-element-error": "error",
      "a11yinspect/img-element-warning": "warn",
      "a11yinspect/svg-element-error": "error",
      "a11yinspect/svg-element-warning": "warn",
      "a11yinspect/media-element-error": "error",
      "a11yinspect/media-element-warning": "warn",
      "a11yinspect/track-element-error": "error",
      "a11yinspect/canvas-element-error": "error",
      "a11yinspect/canvas-element-warning": "warn",

      // ========================================
      // LINKS & BUTTONS
      // ========================================
      "a11yinspect/a-element-error": "error",
      "a11yinspect/a-element-warning": "warn",
      "a11yinspect/button-element-error": "error",
      "a11yinspect/button-element-warning": "warn",

      // ========================================
      // FORMS
      // ========================================
      "a11yinspect/input-element-error": "error",
      "a11yinspect/input-element-warning": "warn",
      "a11yinspect/label-element-error": "error",
      "a11yinspect/label-element-warning": "warn",
      "a11yinspect/select-element-error": "error",
      "a11yinspect/textarea-element-error": "error",
      "a11yinspect/textarea-element-warning": "warn",
      "a11yinspect/optgroup-element-error": "error",
      "a11yinspect/form-element-error": "error",
      "a11yinspect/form-element-warning": "warn",
      "a11yinspect/autocomplete-element-error": "error",
      "a11yinspect/autocomplete-element-warning": "warn",
      "a11yinspect/required-element-warning": "warn",

      // ========================================
      // DOCUMENT STRUCTURE
      // ========================================
      "a11yinspect/heading-element-error": "error",
      "a11yinspect/heading-element-warning": "warn",
      "a11yinspect/lang-element-error": "error",
      "a11yinspect/title-element-error": "error",
      "a11yinspect/title-element-warning": "warn",
      "a11yinspect/iframe-element-error": "error",
      "a11yinspect/iframe-element-warning": "warn",
      "a11yinspect/duplicate-id-error": "error",

      // ========================================
      // TABLES
      // ========================================
      "a11yinspect/table-element-error": "error",
      "a11yinspect/table-element-warning": "warn",
      "a11yinspect/scope-element-error": "error",

      // ========================================
      // ARIA ATTRIBUTES
      // ========================================
      "a11yinspect/aria-element-error": "error",
      "a11yinspect/aria-element-warning": "warn",
      "a11yinspect/description-element-error": "error",
      "a11yinspect/description-element-warning": "warn",
      "a11yinspect/expanded-element-warning": "warn",
      "a11yinspect/disabled-element-warning": "warn",
      "a11yinspect/checked-element-error": "error",
      "a11yinspect/checked-element-warning": "warn",
      "a11yinspect/selected-element-warning": "warn",
      "a11yinspect/pressed-element-warning": "warn",
      "a11yinspect/live-region-error": "error",
      "a11yinspect/orientation-element-error": "error",
      "a11yinspect/role-props-element-error": "error",
      "a11yinspect/role-props-element-warning": "warn",

      // ========================================
      // LANDMARKS & NAVIGATION
      // ========================================
      "a11yinspect/landmark-element-error": "error",
      "a11yinspect/landmark-element-warning": "warn",
      "a11yinspect/skip-link-warning": "warn",
      "a11yinspect/section-element-warning": "warn",
      "a11yinspect/header-element-warning": "warn",
      "a11yinspect/footer-element-warning": "warn",

      // ========================================
      // LISTS
      // ========================================
      "a11yinspect/list-element-error": "error",
      "a11yinspect/list-element-warning": "warn",
      "a11yinspect/dl-element-error": "error",

      // ========================================
      // INTERACTIVE ELEMENTS
      // ========================================
      "a11yinspect/focus-element-error": "error",
      "a11yinspect/focus-element-warning": "warn",
      "a11yinspect/click-handler-warning": "warn",
      "a11yinspect/accesskey-element-error": "error",
      "a11yinspect/accesskey-element-warning": "warn",
      "a11yinspect/slider-element-warning": "warn",
      "a11yinspect/area-element-error": "error",

      // ========================================
      // DIALOG & DETAILS
      // ========================================
      "a11yinspect/dialog-element-error": "error",
      "a11yinspect/dialog-element-warning": "warn",
      "a11yinspect/details-element-error": "error",
      "a11yinspect/menu-element-error": "error",
      "a11yinspect/menu-element-warning": "warn",
      "a11yinspect/tab-element-warning": "warn",
      "a11yinspect/autofocus-element-warning": "warn",
      "a11yinspect/distracting-element-error": "error",

      // ========================================
      // METADATA
      // ========================================
      "a11yinspect/meta-element-error": "error",
      "a11yinspect/meta-element-warning": "warn",

      // ========================================
      // SEMANTIC HTML
      // ========================================
      "a11yinspect/figure-element-error": "error",
      "a11yinspect/abbr-element-error": "error",
      "a11yinspect/time-element-error": "error",
      "a11yinspect/blockquote-element-warning": "warn",
      "a11yinspect/ins-del-element-warning": "warn",
      "a11yinspect/address-element-error": "error",
      "a11yinspect/ruby-element-error": "error",
      "a11yinspect/ruby-element-warning": "warn",
      "a11yinspect/hr-element-warning": "warn",

      // ========================================
      // ADDITIONAL ELEMENTS
      // ========================================
      "a11yinspect/meter-element-error": "error",
      "a11yinspect/progress-element-error": "error",
      "a11yinspect/output-element-error": "error",
      "a11yinspect/object-element-error": "error",
      "a11yinspect/embed-element-error": "error",
      "a11yinspect/map-element-error": "error",
      "a11yinspect/noscript-element-error": "error"
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
