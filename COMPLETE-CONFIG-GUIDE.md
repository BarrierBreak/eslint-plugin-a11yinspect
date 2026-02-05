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

### 1. ESLint 9+ (Recommended) - All 66 Rules

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
      // CRITICAL (errors)
      "a11yinspect/img-element": "error",
      "a11yinspect/svg-element": "error",
      "a11yinspect/media-element": "error",
      "a11yinspect/track-element": "error",
      "a11yinspect/canvas-element": "error",
      "a11yinspect/a-element": "error",
      "a11yinspect/button-element": "error",
      "a11yinspect/input-element": "error",
      "a11yinspect/label-element": "error",
      "a11yinspect/select-element": "error",
      "a11yinspect/textarea-element": "error",
      "a11yinspect/optgroup-element": "error",
      "a11yinspect/heading-element": "error",
      "a11yinspect/lang-element": "error",
      "a11yinspect/title-element": "error",
      "a11yinspect/iframe-element": "error",
      "a11yinspect/duplicate-id": "error",
      "a11yinspect/area-element": "error",

      // IMPORTANT (warnings)
      "a11yinspect/form-element": "warn",
      "a11yinspect/autocomplete-element": "warn",
      "a11yinspect/required-element": "warn",
      "a11yinspect/table-element": "warn",
      "a11yinspect/scope-element": "warn",
      "a11yinspect/aria-element": "warn",
      "a11yinspect/description-element": "warn",
      "a11yinspect/expanded-element": "warn",
      "a11yinspect/disabled-element": "warn",
      "a11yinspect/checked-element": "warn",
      "a11yinspect/selected-element": "warn",
      "a11yinspect/pressed-element": "warn",
      "a11yinspect/live-region": "warn",
      "a11yinspect/orientation-element": "warn",
      "a11yinspect/landmark-element": "warn",
      "a11yinspect/skip-link": "warn",
      "a11yinspect/section-element": "warn",
      "a11yinspect/header-element": "warn",
      "a11yinspect/footer-element": "warn",
      "a11yinspect/list-element": "warn",
      "a11yinspect/dl-element": "warn",
      "a11yinspect/focus-element": "warn",
      "a11yinspect/click-handler": "warn",
      "a11yinspect/accesskey-element": "warn",
      "a11yinspect/slider-element": "warn",
      "a11yinspect/dialog-element": "warn",
      "a11yinspect/details-element": "warn",
      "a11yinspect/menu-element": "warn",
      "a11yinspect/tab-element": "warn",
      "a11yinspect/role-props-element": "warn",
      "a11yinspect/autofocus-element": "warn",
      "a11yinspect/distracting-element": "error",
      "a11yinspect/meta-element": "warn",
      "a11yinspect/figure-element": "warn",
      "a11yinspect/abbr-element": "warn",
      "a11yinspect/time-element": "warn",
      "a11yinspect/blockquote-element": "warn",
      "a11yinspect/ins-del-element": "warn",
      "a11yinspect/address-element": "warn",
      "a11yinspect/ruby-element": "warn",
      "a11yinspect/hr-element": "warn",
      "a11yinspect/meter-element": "warn",
      "a11yinspect/progress-element": "warn",
      "a11yinspect/output-element": "warn",
      "a11yinspect/object-element": "warn",
      "a11yinspect/embed-element": "warn",
      "a11yinspect/map-element": "warn",
      "a11yinspect/noscript-element": "warn"
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
    "a11yinspect/img-element": "error",
    "a11yinspect/svg-element": "error",
    "a11yinspect/media-element": "error",
    "a11yinspect/track-element": "error",
    "a11yinspect/canvas-element": "error",
    "a11yinspect/a-element": "error",
    "a11yinspect/button-element": "error",
    "a11yinspect/input-element": "error",
    "a11yinspect/label-element": "error",
    "a11yinspect/select-element": "error",
    "a11yinspect/textarea-element": "error",
    "a11yinspect/optgroup-element": "error",
    "a11yinspect/heading-element": "error",
    "a11yinspect/lang-element": "error",
    "a11yinspect/title-element": "error",
    "a11yinspect/iframe-element": "error",
    "a11yinspect/duplicate-id": "error",
    "a11yinspect/area-element": "error",
    "a11yinspect/form-element": "warn",
    "a11yinspect/autocomplete-element": "warn",
    "a11yinspect/required-element": "warn",
    "a11yinspect/table-element": "warn",
    "a11yinspect/scope-element": "warn",
    "a11yinspect/aria-element": "warn",
    "a11yinspect/description-element": "warn",
    "a11yinspect/expanded-element": "warn",
    "a11yinspect/disabled-element": "warn",
    "a11yinspect/checked-element": "warn",
    "a11yinspect/selected-element": "warn",
    "a11yinspect/pressed-element": "warn",
    "a11yinspect/live-region": "warn",
    "a11yinspect/orientation-element": "warn",
    "a11yinspect/landmark-element": "warn",
    "a11yinspect/skip-link": "warn",
    "a11yinspect/section-element": "warn",
    "a11yinspect/header-element": "warn",
    "a11yinspect/footer-element": "warn",
    "a11yinspect/list-element": "warn",
    "a11yinspect/dl-element": "warn",
    "a11yinspect/focus-element": "warn",
    "a11yinspect/click-handler": "warn",
    "a11yinspect/accesskey-element": "warn",
    "a11yinspect/slider-element": "warn",
    "a11yinspect/dialog-element": "warn",
    "a11yinspect/details-element": "warn",
    "a11yinspect/menu-element": "warn",
    "a11yinspect/tab-element": "warn",
    "a11yinspect/role-props-element": "warn",
    "a11yinspect/autofocus-element": "warn",
    "a11yinspect/distracting-element": "error",
    "a11yinspect/meta-element": "warn",
    "a11yinspect/figure-element": "warn",
    "a11yinspect/abbr-element": "warn",
    "a11yinspect/time-element": "warn",
    "a11yinspect/blockquote-element": "warn",
    "a11yinspect/ins-del-element": "warn",
    "a11yinspect/address-element": "warn",
    "a11yinspect/ruby-element": "warn",
    "a11yinspect/hr-element": "warn",
    "a11yinspect/meter-element": "warn",
    "a11yinspect/progress-element": "warn",
    "a11yinspect/output-element": "warn",
    "a11yinspect/object-element": "warn",
    "a11yinspect/embed-element": "warn",
    "a11yinspect/map-element": "warn",
    "a11yinspect/noscript-element": "warn"
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
      "a11yinspect/img-element": "error",
      "a11yinspect/a-element": "error",
      "a11yinspect/button-element": "error",
      "a11yinspect/canvas-element": "error"
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
      "a11yinspect/img-element": "error",
      "a11yinspect/a-element": "error",
      "a11yinspect/button-element": "error",
      "a11yinspect/canvas-element": "error"
    }
  }
];
```

---

## Rule Severity Levels

### Error (Must Fix)
```javascript
"a11yinspect/img-element": "error"        // Blocks build/CI
"a11yinspect/a-element": "error"
"a11yinspect/button-element": "error"
"a11yinspect/input-element": "error"
"a11yinspect/heading-element": "error"
"a11yinspect/lang-element": "error"
"a11yinspect/title-element": "error"
"a11yinspect/duplicate-id": "error"
"a11yinspect/canvas-element": "error"
```

### Warning (Should Fix)
```javascript
"a11yinspect/form-element": "warn"        // Shows warning
"a11yinspect/table-element": "warn"
"a11yinspect/aria-element": "warn"
"a11yinspect/focus-element": "warn"
"a11yinspect/click-handler": "warn"
"a11yinspect/slider-element": "warn"
```

### Off (Disabled)
```javascript
"a11yinspect/some-rule": "off"           // Completely disabled
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
    "lint:a11y": "eslint . --rule '{\"a11yinspect/img-element\": \"error\"}'",
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
      "a11yinspect/img-element": "error",
      "a11yinspect/a-element": "error",
      "a11yinspect/canvas-element": "error"
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
      "a11yinspect/img-element": "error",
      "a11yinspect/canvas-element": "error"
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
  "a11yinspect/img-element": "error",
  "a11yinspect/a-element": "error",
  "a11yinspect/button-element": "error"
}
```

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [ESLint Documentation](https://eslint.org/)
