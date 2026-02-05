# eslint-plugin-a11yinspect

> ESLint plugin for comprehensive static accessibility analysis

[![npm version](https://img.shields.io/npm/v/eslint-plugin-a11yinspect.svg)](https://www.npmjs.com/package/eslint-plugin-a11yinspect)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Static accessibility analysis for React/JSX with **66 rules** covering WCAG guidelines. Catch accessibility issues at development time with zero runtime overhead.

## Features

- **66 accessibility rules** across 10 categories
- **ESLint 7, 8, 9 compatible** - works with legacy and flat config
- **Pure static analysis** - no browser, jsdom, or runtime required
- **Framework agnostic** - React, Next.js, Vite, CRA
- **TypeScript ready** - full support for `.tsx` files
- **Zero dependencies** - lightweight and fast

## Installation

```bash
npm install eslint-plugin-a11yinspect --save-dev
```

## Quick Start

### ESLint 9+ (Flat Config) - Recommended

```javascript
// eslint.config.mjs
import a11yinspect from "eslint-plugin-a11yinspect";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: { a11yinspect },
    rules: {
      // Critical
      "a11yinspect/img-element": "error",
      "a11yinspect/a-element": "error",
      "a11yinspect/button-element": "error",
      "a11yinspect/input-element": "error",
      "a11yinspect/label-element": "error",
      "a11yinspect/heading-element": "error",
      "a11yinspect/canvas-element": "error",
      // Warnings
      "a11yinspect/aria-element": "warn",
      "a11yinspect/table-element": "warn",
      "a11yinspect/list-element": "warn",
      "a11yinspect/slider-element": "warn"
      // See full rule list below
    }
  }
];
```

### ESLint 7-8 (.eslintrc)

```json
{
  "plugins": ["a11yinspect"],
  "parserOptions": {
    "ecmaFeatures": { "jsx": true }
  },
  "rules": {
    "a11yinspect/img-element": "error",
    "a11yinspect/a-element": "error",
    "a11yinspect/button-element": "error",
    "a11yinspect/input-element": "error",
    "a11yinspect/heading-element": "error",
    "a11yinspect/canvas-element": "error"
  }
}
```

### Using the Recommended Config

```json
{
  "extends": ["plugin:a11yinspect/recommended"]
}
```

This enables all 66 rules with appropriate severity levels (critical rules as `error`, others as `warn`).

## Rules Overview

**66 rules** organized by category:

### Images & Media (6 rules)

| Rule | Default | Description |
|------|---------|-------------|
| `img-element` | error | Alt text, generic alt detection, decorative images |
| `svg-element` | error | SVG roles, accessible names, generic descriptions |
| `media-element` | warn | Audio/video accessibility |
| `track-element` | warn | Subtitle/caption tracks |
| `object-element` | warn | Embedded object accessibility |
| `canvas-element` | error | Canvas role, descriptions, decorative marking |

### Links & Navigation (2 rules)

| Rule | Default | Description |
|------|---------|-------------|
| `a-element` | error | Link text, href, accessible names |
| `skip-link` | warn | Skip navigation links |

### Buttons & Interactive (4 rules)

| Rule | Default | Description |
|------|---------|-------------|
| `button-element` | error | Button types, text content |
| `click-handler` | warn | Click handlers on non-interactive elements |
| `focus-element` | warn | Focus management |
| `slider-element` | warn | Slider role, accessible name, keyboard support |

### Forms (9 rules)

| Rule | Default | Description |
|------|---------|-------------|
| `input-element` | error | Input types and attributes |
| `label-element` | error | Label associations |
| `select-element` | error | Select/dropdown elements |
| `textarea-element` | error | Textarea elements |
| `form-element` | warn | Form structure |
| `optgroup-element` | error | Option groups |
| `autocomplete-element` | warn | Autocomplete attributes |
| `required-element` | warn | Required attributes |
| `area-element` | error | Image map areas |

### Document Structure (7 rules)

| Rule | Default | Description |
|------|---------|-------------|
| `heading-element` | error | Heading hierarchy, hidden headings, nested headings, long text |
| `lang-element` | error | Language attributes |
| `title-element` | error | Page title |
| `iframe-element` | error | Iframe titles, hidden iframes, empty titles |
| `list-element` | warn | List structure, empty items, nesting, invalid children |
| `dl-element` | warn | Definition lists |
| `duplicate-id` | error | Duplicate id attributes |

### ARIA (12 rules)

| Rule | Default | Description |
|------|---------|-------------|
| `aria-element` | warn | ARIA attributes, roles, prop validation |
| `role-props-element` | warn | Role required/supported aria properties |
| `description-element` | warn | aria-describedby |
| `expanded-element` | warn | aria-expanded states |
| `disabled-element` | warn | aria-disabled |
| `checked-element` | warn | aria-checked states |
| `selected-element` | warn | aria-selected states |
| `pressed-element` | warn | aria-pressed states |
| `live-region` | warn | aria-live regions |
| `orientation-element` | warn | aria-orientation |
| `accesskey-element` | warn | Accesskey attributes |
| `autofocus-element` | warn | Avoid autoFocus attribute |

### Landmarks (5 rules)

| Rule | Default | Description |
|------|---------|-------------|
| `landmark-element` | warn | Landmark roles |
| `section-element` | warn | Section elements |
| `header-element` | warn | Header elements |
| `footer-element` | warn | Footer elements |
| `meta-element` | warn | Viewport zoom, user-scalable, meta refresh |

### Tables (2 rules)

| Rule | Default | Description |
|------|---------|-------------|
| `table-element` | warn | Headers, captions, empty headers, role-based headers |
| `scope-element` | warn | Table header scope |

### Dialogs & Components (5 rules)

| Rule | Default | Description |
|------|---------|-------------|
| `dialog-element` | warn | Dialog/modal elements |
| `details-element` | warn | Details/summary elements |
| `menu-element` | warn | Menu element structure |
| `tab-element` | warn | Tab, tablist, tabpanel roles |
| `distracting-element` | error | No marquee/blink elements |

### Semantic HTML (14 rules)

| Rule | Default | Description |
|------|---------|-------------|
| `figure-element` | warn | Figure/figcaption |
| `abbr-element` | warn | Abbreviations |
| `time-element` | warn | Time elements |
| `blockquote-element` | warn | Blockquote citations |
| `ins-del-element` | warn | Inserted/deleted content |
| `address-element` | warn | Address elements |
| `ruby-element` | warn | Ruby annotations |
| `hr-element` | warn | Horizontal rules |
| `meter-element` | warn | Meter elements |
| `progress-element` | warn | Progress elements |
| `output-element` | warn | Output elements |
| `embed-element` | warn | Embedded content |
| `map-element` | warn | Image maps |
| `noscript-element` | warn | Noscript fallbacks |

## Examples

### Bad (will trigger errors)

```jsx
// img missing alt and no aria alternative
<img src="logo.png" />

// Generic alt text
<img src="logo.png" alt="image" />

// Canvas missing role="img"
<canvas width="200" height="200"></canvas>

// Slider missing accessible name
<div role="slider"></div>

// Empty heading
<h1></h1>

// Nested heading
<h2><h3>Nested</h3></h2>

// List with no items
<ul></ul>

// Table missing headers
<table><tr><td>Data</td></tr></table>

// iframe with empty title
<iframe src="/page" title="" />

// Viewport disables zoom
<meta name="viewport" content="user-scalable=no" />
```

### Good (passes checks)

```jsx
// Proper alt text
<img src="logo.png" alt="Company Logo" />

// Canvas with role and description
<canvas role="img" aria-label="Sales chart for Q4">
  Fallback text
</canvas>

// Slider with name and keyboard support
<div role="slider" aria-label="Volume" tabIndex={0}></div>

// Heading with content
<h1>Welcome to Our Site</h1>

// Proper list structure
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

// Table with headers and caption
<table>
  <caption>Sales Data</caption>
  <tr><th>Product</th><th>Sales</th></tr>
  <tr><td>Widget</td><td>100</td></tr>
</table>

// iframe with title
<iframe src="/page" title="Contact Form" />

// Accessible viewport
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## Supported File Types

| Extension | Support |
|-----------|---------|
| `.js` | JavaScript |
| `.jsx` | React JSX |
| `.ts` | TypeScript (with `@typescript-eslint/parser`) |
| `.tsx` | TypeScript JSX |
| `.mjs` | ES Modules |
| `.cjs` | CommonJS |

This plugin checks **JSX/TSX files only**. For other template formats, see:
- HTML files - [html-validate](https://html-validate.org/)
- Vue templates - [eslint-plugin-vue](https://eslint.vuejs.org/)
- Angular templates - [angular-eslint](https://github.com/angular-eslint/angular-eslint)

## Framework Setup

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
      "a11yinspect/heading-element": "error"
    }
  },
  { ignores: [".next/**", "out/**"] }
];
```

### Vite / CRA

```javascript
// eslint.config.mjs
import a11yinspect from "eslint-plugin-a11yinspect";

export default [
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: { a11yinspect },
    rules: {
      "a11yinspect/img-element": "error",
      "a11yinspect/a-element": "error"
    }
  }
];
```

### TypeScript

```javascript
// eslint.config.mjs
import a11yinspect from "eslint-plugin-a11yinspect";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: "./tsconfig.json" }
    },
    plugins: { a11yinspect },
    rules: {
      "a11yinspect/img-element": "error",
      "a11yinspect/a-element": "error"
    }
  }
];
```

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
      - run: npx eslint . --format json --output-file a11y-report.json
```

### package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:a11y": "eslint . --rule '{\"a11yinspect/img-element\": \"error\"}'",
    "lint:report": "eslint . --format json --output-file a11y-report.json"
  }
}
```

## Troubleshooting

**"Cannot find module 'eslint-plugin-a11yinspect'"**

Make sure the plugin is installed in the project where ESLint is running:

```bash
npm install eslint-plugin-a11yinspect --save-dev
```

**ESLint not recognizing JSX**

Ensure JSX parsing is enabled:

```javascript
parserOptions: {
  ecmaFeatures: { jsx: true }
}
```

**Too many errors?**

Start with critical rules only and gradually enable more:

```javascript
rules: {
  "a11yinspect/img-element": "error",
  "a11yinspect/a-element": "error",
  "a11yinspect/heading-element": "error"
}
```

## License

MIT - [BarrierBreak](https://www.barrierbreak.com/)

## Resources

- [GitHub Repository](https://github.com/BarrierBreak/eslint-plugin-a11yinspect)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [ESLint Documentation](https://eslint.org/)
