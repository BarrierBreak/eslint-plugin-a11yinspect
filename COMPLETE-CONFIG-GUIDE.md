# Complete ESLint Configuration Guide
## eslint-plugin-a11yinspect

---

## Installation

```bash
# Install the plugin
npm install eslint-plugin-a11yinspect --save-dev

# For TypeScript support (optional)
npm install @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
```

---

## Configuration Files

### 1. ESLint 9+ (Recommended) - All 93 Rules

**File: `eslint.config.mjs`**

```javascript
import a11yinspect from "eslint-plugin-a11yinspect";

export default [
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: { a11yinspect },
    rules: {
      // IMAGES & MEDIA
      "a11yinspect/img-element-error": "error",
      "a11yinspect/img-element-warning": "warn",
      "a11yinspect/svg-element-error": "error",
      "a11yinspect/svg-element-warning": "warn",
      "a11yinspect/media-element-error": "error",
      "a11yinspect/media-element-warning": "warn",
      "a11yinspect/track-element-error": "error",
      "a11yinspect/canvas-element-error": "error",
      "a11yinspect/canvas-element-warning": "warn",

      // LINKS & BUTTONS
      "a11yinspect/a-element-error": "error",
      "a11yinspect/a-element-warning": "warn",
      "a11yinspect/button-element-error": "error",
      "a11yinspect/button-element-warning": "warn",

      // FORMS
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

      // DOCUMENT STRUCTURE
      "a11yinspect/heading-element-error": "error",
      "a11yinspect/heading-element-warning": "warn",
      "a11yinspect/lang-element-error": "error",
      "a11yinspect/title-element-error": "error",
      "a11yinspect/title-element-warning": "warn",
      "a11yinspect/iframe-element-error": "error",
      "a11yinspect/iframe-element-warning": "warn",
      "a11yinspect/duplicate-id-error": "error",

      // TABLES
      "a11yinspect/table-element-error": "error",
      "a11yinspect/table-element-warning": "warn",
      "a11yinspect/scope-element-error": "error",

      // ARIA ATTRIBUTES
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

      // LANDMARKS & NAVIGATION
      "a11yinspect/landmark-element-error": "error",
      "a11yinspect/landmark-element-warning": "warn",
      "a11yinspect/skip-link-warning": "warn",
      "a11yinspect/section-element-warning": "warn",
      "a11yinspect/header-element-warning": "warn",
      "a11yinspect/footer-element-warning": "warn",

      // LISTS
      "a11yinspect/list-element-error": "error",
      "a11yinspect/list-element-warning": "warn",
      "a11yinspect/dl-element-error": "error",

      // INTERACTIVE ELEMENTS
      "a11yinspect/focus-element-error": "error",
      "a11yinspect/focus-element-warning": "warn",
      "a11yinspect/click-handler-warning": "warn",
      "a11yinspect/accesskey-element-error": "error",
      "a11yinspect/accesskey-element-warning": "warn",
      "a11yinspect/slider-element-warning": "warn",
      "a11yinspect/area-element-error": "error",

      // DIALOG & DETAILS
      "a11yinspect/dialog-element-error": "error",
      "a11yinspect/dialog-element-warning": "warn",
      "a11yinspect/details-element-error": "error",
      "a11yinspect/menu-element-error": "error",
      "a11yinspect/menu-element-warning": "warn",
      "a11yinspect/tab-element-warning": "warn",
      "a11yinspect/autofocus-element-warning": "warn",
      "a11yinspect/distracting-element-error": "error",

      // METADATA
      "a11yinspect/meta-element-error": "error",
      "a11yinspect/meta-element-warning": "warn",

      // SEMANTIC HTML
      "a11yinspect/figure-element-error": "error",
      "a11yinspect/abbr-element-error": "error",
      "a11yinspect/time-element-error": "error",
      "a11yinspect/blockquote-element-warning": "warn",
      "a11yinspect/ins-del-element-warning": "warn",
      "a11yinspect/address-element-error": "error",
      "a11yinspect/ruby-element-error": "error",
      "a11yinspect/ruby-element-warning": "warn",
      "a11yinspect/hr-element-warning": "warn",

      // ADDITIONAL ELEMENTS
      "a11yinspect/meter-element-error": "error",
      "a11yinspect/progress-element-error": "error",
      "a11yinspect/output-element-error": "error",
      "a11yinspect/object-element-error": "error",
      "a11yinspect/embed-element-error": "error",
      "a11yinspect/map-element-error": "error",
      "a11yinspect/noscript-element-error": "error"
    }
  },
  {
    ignores: ["node_modules/**", "dist/**", "build/**"]
  }
];
```

---

### 2. ESLint 7-8 (Legacy Format)

**File: `.eslintrc.json`**

```json
{
  "root": true,
  "env": {
    "browser": true,
    "es2021": true
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": ["a11yinspect"],
  "rules": {
    "a11yinspect/img-element-error": "error",
    "a11yinspect/img-element-warning": "warn",
    "a11yinspect/svg-element-error": "error",
    "a11yinspect/svg-element-warning": "warn",
    "a11yinspect/media-element-error": "error",
    "a11yinspect/media-element-warning": "warn",
    "a11yinspect/track-element-error": "error",
    "a11yinspect/canvas-element-error": "error",
    "a11yinspect/canvas-element-warning": "warn",
    "a11yinspect/a-element-error": "error",
    "a11yinspect/a-element-warning": "warn",
    "a11yinspect/button-element-error": "error",
    "a11yinspect/button-element-warning": "warn",
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
    "a11yinspect/heading-element-error": "error",
    "a11yinspect/heading-element-warning": "warn",
    "a11yinspect/lang-element-error": "error",
    "a11yinspect/title-element-error": "error",
    "a11yinspect/title-element-warning": "warn",
    "a11yinspect/iframe-element-error": "error",
    "a11yinspect/iframe-element-warning": "warn",
    "a11yinspect/duplicate-id-error": "error",
    "a11yinspect/table-element-error": "error",
    "a11yinspect/table-element-warning": "warn",
    "a11yinspect/scope-element-error": "error",
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
    "a11yinspect/landmark-element-error": "error",
    "a11yinspect/landmark-element-warning": "warn",
    "a11yinspect/skip-link-warning": "warn",
    "a11yinspect/section-element-warning": "warn",
    "a11yinspect/header-element-warning": "warn",
    "a11yinspect/footer-element-warning": "warn",
    "a11yinspect/list-element-error": "error",
    "a11yinspect/list-element-warning": "warn",
    "a11yinspect/dl-element-error": "error",
    "a11yinspect/focus-element-error": "error",
    "a11yinspect/focus-element-warning": "warn",
    "a11yinspect/click-handler-warning": "warn",
    "a11yinspect/accesskey-element-error": "error",
    "a11yinspect/accesskey-element-warning": "warn",
    "a11yinspect/slider-element-warning": "warn",
    "a11yinspect/area-element-error": "error",
    "a11yinspect/dialog-element-error": "error",
    "a11yinspect/dialog-element-warning": "warn",
    "a11yinspect/details-element-error": "error",
    "a11yinspect/menu-element-error": "error",
    "a11yinspect/menu-element-warning": "warn",
    "a11yinspect/tab-element-warning": "warn",
    "a11yinspect/autofocus-element-warning": "warn",
    "a11yinspect/distracting-element-error": "error",
    "a11yinspect/meta-element-error": "error",
    "a11yinspect/meta-element-warning": "warn",
    "a11yinspect/figure-element-error": "error",
    "a11yinspect/abbr-element-error": "error",
    "a11yinspect/time-element-error": "error",
    "a11yinspect/blockquote-element-warning": "warn",
    "a11yinspect/ins-del-element-warning": "warn",
    "a11yinspect/address-element-error": "error",
    "a11yinspect/ruby-element-error": "error",
    "a11yinspect/ruby-element-warning": "warn",
    "a11yinspect/hr-element-warning": "warn",
    "a11yinspect/meter-element-error": "error",
    "a11yinspect/progress-element-error": "error",
    "a11yinspect/output-element-error": "error",
    "a11yinspect/object-element-error": "error",
    "a11yinspect/embed-element-error": "error",
    "a11yinspect/map-element-error": "error",
    "a11yinspect/noscript-element-error": "error"
  }
}
```

---

### 3. TypeScript Support

**File: `eslint.config.mjs`**

```javascript
import a11yinspect from "eslint-plugin-a11yinspect";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  // JavaScript files
  {
    files: ["**/*.{js,jsx}"],
    plugins: { a11yinspect },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    rules: {
      "a11yinspect/img-element-error": "error",
      "a11yinspect/img-element-warning": "warn",
      "a11yinspect/a-element-error": "error",
      "a11yinspect/a-element-warning": "warn",
      "a11yinspect/button-element-error": "error",
      "a11yinspect/button-element-warning": "warn",
      "a11yinspect/canvas-element-error": "error",
      "a11yinspect/canvas-element-warning": "warn"
    }
  },
  // TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      a11yinspect
    },
    rules: {
      "a11yinspect/img-element-error": "error",
      "a11yinspect/img-element-warning": "warn",
      "a11yinspect/a-element-error": "error",
      "a11yinspect/a-element-warning": "warn",
      "a11yinspect/button-element-error": "error",
      "a11yinspect/button-element-warning": "warn",
      "a11yinspect/canvas-element-error": "error",
      "a11yinspect/canvas-element-warning": "warn"
    }
  }
];
```

---

## Rule Severity Levels

### Error (Must Fix)
```javascript
"a11yinspect/img-element-error": "error"        // Blocks build/CI
"a11yinspect/a-element-error": "error"
"a11yinspect/button-element-error": "error"
"a11yinspect/input-element-error": "error"
"a11yinspect/heading-element-error": "error"
"a11yinspect/lang-element-error": "error"
"a11yinspect/title-element-error": "error"
"a11yinspect/duplicate-id-error": "error"
"a11yinspect/canvas-element-error": "error"
```

### Warning (Should Fix)
```javascript
"a11yinspect/img-element-warning": "warn"       // Shows warning
"a11yinspect/form-element-warning": "warn"
"a11yinspect/table-element-warning": "warn"
"a11yinspect/aria-element-warning": "warn"
"a11yinspect/focus-element-warning": "warn"
"a11yinspect/click-handler-warning": "warn"
"a11yinspect/slider-element-warning": "warn"
```

### Off (Disabled)
```javascript
"a11yinspect/some-rule-error": "off"           // Completely disabled
```

---

## Usage

### Run Linting
```bash
# Lint all files
npx eslint .

# Lint specific file
npx eslint src/App.jsx

# Output as JSON
npx eslint . --format json --output-file a11y-report.json
```

### Package.json Scripts
```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:a11y": "eslint . --rule '{\"a11yinspect/img-element-error\": \"error\"}'",
    "lint:report": "eslint . --format json --output-file a11y-report.json"
  }
}
```

---

## Framework-Specific Examples

### Next.js
```javascript
// eslint.config.mjs
import a11yinspect from "eslint-plugin-a11yinspect";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { a11yinspect },
    rules: {
      "a11yinspect/img-element-error": "error",
      "a11yinspect/img-element-warning": "warn",
      "a11yinspect/a-element-error": "error",
      "a11yinspect/a-element-warning": "warn",
      "a11yinspect/canvas-element-error": "error",
      "a11yinspect/canvas-element-warning": "warn"
    }
  },
  { ignores: [".next/**", "out/**"] }
];
```

### Vite
```javascript
// eslint.config.mjs
import a11yinspect from "eslint-plugin-a11yinspect";

export default [
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: { a11yinspect },
    rules: {
      "a11yinspect/img-element-error": "error",
      "a11yinspect/img-element-warning": "warn",
      "a11yinspect/canvas-element-error": "error",
      "a11yinspect/canvas-element-warning": "warn"
    }
  }
];
```

---

## CI/CD Integration

### GitHub Actions
```yaml
name: Accessibility Lint
on: [push, pull_request]
jobs:
  a11y-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx eslint .
```

### Pre-commit Hook (husky + lint-staged)
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": "eslint --fix"
  }
}
```

---

## Troubleshooting

### "Cannot find module 'eslint-plugin-a11yinspect'"
```bash
npm install eslint-plugin-a11yinspect --save-dev
```

### ESLint not recognizing JSX
```javascript
parserOptions: {
  ecmaFeatures: {
    jsx: true
  }
}
```

### Too many errors?
Start with critical rules only:
```javascript
rules: {
  "a11yinspect/img-element-error": "error",
  "a11yinspect/a-element-error": "error",
  "a11yinspect/button-element-error": "error"
}
```

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [ESLint Documentation](https://eslint.org/)
