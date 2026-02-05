// eslint.config.mjs
// ESLint 9+ Flat Config with eslint-plugin-a11yinspect
// Full example with all 66 accessibility rules

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
      // CRITICAL ERRORS (must fix)
      // ========================================
      
      // Images & Media
      "a11yinspect/img-element": "error",
      "a11yinspect/svg-element": "error",
      "a11yinspect/media-element": "error",
      "a11yinspect/track-element": "error",
      "a11yinspect/canvas-element": "error",
      
      // Links & Buttons
      "a11yinspect/a-element": "error",
      "a11yinspect/button-element": "error",
      
      // Forms
      "a11yinspect/input-element": "error",
      "a11yinspect/label-element": "error",
      "a11yinspect/select-element": "error",
      "a11yinspect/textarea-element": "error",
      "a11yinspect/optgroup-element": "error",
      
      // Document Structure
      "a11yinspect/heading-element": "error",
      "a11yinspect/lang-element": "error",
      "a11yinspect/title-element": "error",
      "a11yinspect/iframe-element": "error",
      "a11yinspect/duplicate-id": "error",
      
      // Interactive Elements
      "a11yinspect/area-element": "error",
      
      // ========================================
      // WARNINGS (should fix)
      // ========================================
      
      // Form Structure
      "a11yinspect/form-element": "warn",
      "a11yinspect/autocomplete-element": "warn",
      "a11yinspect/required-element": "warn",
      
      // Tables
      "a11yinspect/table-element": "warn",
      "a11yinspect/scope-element": "warn",
      
      // ARIA Attributes
      "a11yinspect/aria-element": "warn",
      "a11yinspect/description-element": "warn",
      "a11yinspect/expanded-element": "warn",
      "a11yinspect/disabled-element": "warn",
      "a11yinspect/checked-element": "warn",
      "a11yinspect/selected-element": "warn",
      "a11yinspect/pressed-element": "warn",
      "a11yinspect/live-region": "warn",
      "a11yinspect/orientation-element": "warn",
      
      // Landmarks & Navigation
      "a11yinspect/landmark-element": "warn",
      "a11yinspect/skip-link": "warn",
      "a11yinspect/section-element": "warn",
      "a11yinspect/header-element": "warn",
      "a11yinspect/footer-element": "warn",
      
      // Lists
      "a11yinspect/list-element": "warn",
      "a11yinspect/dl-element": "warn",
      
      // Interactive
      "a11yinspect/focus-element": "warn",
      "a11yinspect/click-handler": "warn",
      "a11yinspect/accesskey-element": "warn",
      "a11yinspect/slider-element": "warn",
      
      // Dialog & Details
      "a11yinspect/dialog-element": "warn",
      "a11yinspect/details-element": "warn",
      "a11yinspect/menu-element": "warn",
      "a11yinspect/tab-element": "warn",
      "a11yinspect/role-props-element": "warn",
      "a11yinspect/autofocus-element": "warn",
      "a11yinspect/distracting-element": "error",

      // Metadata
      "a11yinspect/meta-element": "warn",
      
      // Semantic HTML
      "a11yinspect/figure-element": "warn",
      "a11yinspect/abbr-element": "warn",
      "a11yinspect/time-element": "warn",
      "a11yinspect/blockquote-element": "warn",
      "a11yinspect/ins-del-element": "warn",
      "a11yinspect/address-element": "warn",
      "a11yinspect/ruby-element": "warn",
      "a11yinspect/hr-element": "warn",
      
      // Additional Elements
      "a11yinspect/meter-element": "warn",
      "a11yinspect/progress-element": "warn",
      "a11yinspect/output-element": "warn",
      "a11yinspect/object-element": "warn",
      "a11yinspect/embed-element": "warn",
      "a11yinspect/map-element": "warn",
      "a11yinspect/noscript-element": "warn"
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
