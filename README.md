# eslint-plugin-a11yinspect

> ESLint plugin for comprehensive static accessibility analysis

[![npm version](https://img.shields.io/npm/v/@barrierbreak/eslint-plugin-a11yinspect.svg)](https://www.npmjs.com/package/@barrierbreak/eslint-plugin-a11yinspect)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Static accessibility analysis for React/JSX with **66 rules** covering WCAG guidelines. Catch accessibility issues at development time with zero runtime overhead.

## Features

- **66 accessibility rules** across 10 categories
- **ESLint 7, 8, 9 compatible** - works with legacy and flat config
- **Pure static analysis** - no browser, jsdom, or runtime required
- **Framework agnostic** - React, Next.js, Vite, CRA
- **TypeScript ready** - full support for `.tsx` files
- **Zero dependencies** - lightweight and fast

## Why Accessibility Matters at Development

Accessibility isn't just a feature—it's a responsibility. It ensures that people of all abilities can navigate, understand, and interact with digital products without barriers. Following accessibility best practices leads to more inclusive experiences, stronger usability, and more resilient code.

Standards like the [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/) provide a benchmark for making the web perceivable, operable, understandable, and robust for everyone. Incorporating these guidelines early in development helps teams build with inclusion at the core rather than treating accessibility as an afterthought.

## A Great Place to Start: A11yInspect

The A11yInspect ESLint Plugin and [A11yInspect Browser Extension](https://www.barrierbreak.com/a11yinspect/) make it easier to bring accessibility into your everyday development workflow.

A11yInspect ESLint Plugin catches potential accessibility issues right inside your code editor, helping you enforce WCAG-aligned patterns from the start.

The [A11yInspect Browser Extension](https://www.barrierbreak.com/a11yinspect/) provides in‑browser insights into real accessibility concerns, showing how issues appear in the actual user experience.

Together, these tools give developers a practical, approachable way to begin building accessible applications that align with modern standards like WCAG.

## Installation

```bash
npm install @barrierbreak/eslint-plugin-a11yinspect --save-dev
```

## Quick Start

### ESLint 9+ (Flat Config) - Recommended

```javascript
// eslint.config.mjs
import a11yinspect from "@barrierbreak/eslint-plugin-a11yinspect";

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

// Button with accessible name
<button type="submit">Submit Form</button>

// Input with label
<label htmlFor="email">Email Address</label>
<input id="email" type="email" required />

// SVG with accessible name
<svg aria-label="Close icon" role="img">
  <path d="M10 10L20 20M20 10L10 20" stroke="currentColor" />
</svg>

// Link with descriptive text
<a href="/about" aria-label="Read more about our company">About Us</a>

// Proper language attribute
<html lang="en">
```

### More Bad Examples

```jsx
// SVG without accessible name
<svg>
  <path d="M10 10L20 20" />
</svg>

// Button without accessible name
<button type="submit"></button>

// Click handler on non-interactive element
<div onClick={handleClick}>Click me</div>

// Input without label association
<input type="email" placeholder="Email" />

// Missing lang attribute
<html>
  <head>...</head>
</html>

// Duplicate id attributes
<div id="unique">Content 1</div>
<div id="unique">Content 2</div>

// Invalid aria attribute
<button aria-invalid="yes">Submit</button>

// Dialog without aria-modal
<dialog>Modal content</dialog>

// Marquee element (deprecated and distracting)
<marquee>Important announcement</marquee>

// Missing required aria attribute for role
<div role="checkbox" aria-checked="true"></div>
```

### More Good Examples

```jsx
// SVG with proper accessibility
<svg aria-labelledby="title desc" role="img">
  <title id="title">Search Icon</title>
  <desc id="desc">A magnifying glass icon</desc>
  <circle cx="11" cy="11" r="8" />
</svg>

// Interactive button with proper attributes
<button type="button" aria-pressed={isPressed} onClick={toggle}>
  {isPressed ? 'Active' : 'Inactive'}
</button>

// Accessible click handler
<button onClick={handleClick} aria-label="Close dialog">✕</button>

// Properly labeled input
<label>
  Email Address
  <input type="email" required aria-describedby="email-help" />
</label>
<span id="email-help">Enter your work email</span>

// Page with language
<html lang="en">
  <head><title>Page Title</title></head>
  <body>...</body>
</html>

// Valid aria attribute values
<button aria-invalid="true">Submit</button>

// Accessible dialog
<dialog aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Action</h2>
  <p>Are you sure?</p>
</dialog>

// Proper checkbox role with all required attributes
<div role="checkbox" aria-checked={checked} tabIndex={0} onClick={toggle}>
  {checked ? 'Checked' : 'Unchecked'}
</div>

// Semantic figure with figcaption
<figure>
  <img src="chart.png" alt="Revenue growth chart" />
  <figcaption>Figure 1: Revenue growth in Q4 2024</figcaption>
</figure>

// Proper heading hierarchy
<h1>Main Title</h1>
<section>
  <h2>Section Title</h2>
  <h3>Subsection Title</h3>
</section>
<h2>Another Section</h2>
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
import a11yinspect from "@barrierbreak/eslint-plugin-a11yinspect";

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
import a11yinspect from "@barrierbreak/eslint-plugin-a11yinspect";

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
import a11yinspect from "@barrierbreak/eslint-plugin-a11yinspect";
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
npm install @barrierbreak/eslint-plugin-a11yinspect --save-dev
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