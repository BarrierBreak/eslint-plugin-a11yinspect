# Complete ESLint Configuration Guide
## eslint-plugin-a11yinspect

---

## Installation

```bash
# Install the plugin
npm install @barrierbreak/eslint-plugin-a11yinspect --save-dev

# For TypeScript support (optional)
npm install @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
```

---

## Available Configs

| Config | Description | Use case |
|--------|-------------|----------|
| **`recommended`** | `-error` rules as `error`, `-warning` rules as `warn` | Default — start here |
| **`strict`** | All 93 rules set to `error` | CI enforcement — block on any issue |
| **`errors-only`** | Only `-error` rules enabled, `-warning` rules off | Focus on critical issues first |
| **`warnings-only`** | Only `-warning` rules enabled as `warn`, `-error` rules off | Awareness mode — no build failures |

---

## Configuration Files

### 1. ESLint 9+ (Recommended) - All 93 Rules

**File: `eslint.config.mjs`** — copy-paste and go:

```javascript
import a11yinspect from "@barrierbreak/eslint-plugin-a11yinspect";

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
      ...a11yinspect.configs.recommended.rules
    }
  },
  {
    ignores: ["node_modules/**", "dist/**", "build/**"]
  }
];
```

This enables all 93 rules with the correct severity (`error` or `warn`).

Swap `recommended` for any other config:

```javascript
// Strict — all rules as errors, blocks CI on any issue
rules: { ...a11yinspect.configs.strict.rules }

// Errors only — skip warnings, focus on critical issues
rules: { ...a11yinspect.configs["errors-only"].rules }

// Warnings only — awareness mode, no build failures
rules: { ...a11yinspect.configs["warnings-only"].rules }
```

To override a specific rule:

```javascript
rules: {
  ...a11yinspect.configs.recommended.rules,
  // Override: turn off a specific rule
  "a11yinspect/hr-element-warning": "off",
  // Override: downgrade an error to a warning
  "a11yinspect/abbr-element-error": "warn"
}
```

---

### 2. ESLint 7-8 (Legacy Format)

**File: `.eslintrc.json`** — copy-paste and go:

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
  "extends": ["plugin:@barrierbreak/a11yinspect/recommended"],
  "ignorePatterns": ["node_modules/", "dist/", "build/"]
}
```

This enables all 93 rules. Swap `recommended` for any other config:

```json
{ "extends": ["plugin:@barrierbreak/a11yinspect/strict"] }
{ "extends": ["plugin:@barrierbreak/a11yinspect/errors-only"] }
{ "extends": ["plugin:@barrierbreak/a11yinspect/warnings-only"] }
```

To override specific rules, add a `rules` section:

```json
{
  "extends": ["plugin:@barrierbreak/a11yinspect/recommended"],
  "rules": {
    "a11yinspect/hr-element-warning": "off",
    "a11yinspect/abbr-element-error": "warn"
  }
}
```

---

### 3. TypeScript Support

**File: `eslint.config.mjs`**

```javascript
import a11yinspect from "@barrierbreak/eslint-plugin-a11yinspect";
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
      ...a11yinspect.configs.recommended.rules
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
      ...a11yinspect.configs.recommended.rules
    }
  }
];
```

---

## Rule Severity Levels

Each config sets severity differently:

| Config | `-error` rules | `-warning` rules |
|--------|---------------|-----------------|
| `recommended` | `"error"` | `"warn"` |
| `strict` | `"error"` | `"error"` |
| `errors-only` | `"error"` | `"off"` |
| `warnings-only` | `"off"` | `"warn"` |

To override any rule after spreading a config:

```javascript
rules: {
  ...a11yinspect.configs.recommended.rules,
  // Downgrade to warning
  "a11yinspect/img-element-error": "warn",
  // Disable completely
  "a11yinspect/hr-element-warning": "off"
}
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
import a11yinspect from "@barrierbreak/eslint-plugin-a11yinspect";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    plugins: { a11yinspect },
    rules: {
      ...a11yinspect.configs.recommended.rules
    }
  },
  { ignores: [".next/**", "out/**"] }
];
```

### Vite
```javascript
// eslint.config.mjs
import a11yinspect from "@barrierbreak/eslint-plugin-a11yinspect";

export default [
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    plugins: { a11yinspect },
    rules: {
      ...a11yinspect.configs.recommended.rules
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
npm install @barrierbreak/eslint-plugin-a11yinspect --save-dev
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
Start with all rules as warnings, then promote to errors as you fix them:
```javascript
rules: {
  ...Object.fromEntries(
    Object.keys(a11yinspect.configs.recommended.rules).map(rule => [rule, "warn"])
  )
}
```

Or use the recommended config and disable specific rules you want to address later:
```javascript
rules: {
  ...a11yinspect.configs.recommended.rules,
  "a11yinspect/some-rule-error": "off"
}
```

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [ESLint Documentation](https://eslint.org/)
