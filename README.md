# eslint-plugin-a11yinspect

> ESLint plugin for comprehensive static accessibility analysis

[![npm version](https://img.shields.io/npm/v/@barrierbreak/eslint-plugin-a11yinspect.svg)](https://www.npmjs.com/package/@barrierbreak/eslint-plugin-a11yinspect)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Static accessibility analysis for React/JSX with **93 rules** covering Web Content Accessibility Guideline (WCAG) guidelines, EN 301 549 and other accessibility standards. Catch accessibility issues at development time with zero runtime overhead.

## Features

- **93 accessibility rules** (split into error and warning variants) across 10 categories
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

The [A11yInspect Browser Extension](https://www.barrierbreak.com/a11yinspect/) provides in-browser insights into real accessibility concerns, showing how issues appear in the actual user experience.

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
      // Critical errors
      "a11yinspect/img-element-error": "error",
      "a11yinspect/img-element-warning": "warn",
      "a11yinspect/a-element-error": "error",
      "a11yinspect/a-element-warning": "warn",
      "a11yinspect/button-element-error": "error",
      "a11yinspect/button-element-warning": "warn",
      "a11yinspect/input-element-error": "error",
      "a11yinspect/input-element-warning": "warn",
      "a11yinspect/label-element-error": "error",
      "a11yinspect/label-element-warning": "warn",
      "a11yinspect/heading-element-error": "error",
      "a11yinspect/heading-element-warning": "warn",
      "a11yinspect/canvas-element-error": "error",
      "a11yinspect/canvas-element-warning": "warn",
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
    "a11yinspect/img-element-error": "error",
    "a11yinspect/img-element-warning": "warn",
    "a11yinspect/a-element-error": "error",
    "a11yinspect/a-element-warning": "warn",
    "a11yinspect/button-element-error": "error",
    "a11yinspect/button-element-warning": "warn",
    "a11yinspect/input-element-error": "error",
    "a11yinspect/heading-element-error": "error",
    "a11yinspect/canvas-element-error": "error"
  }
}
```

### Using the Recommended Config

```json
{
  "extends": ["plugin:a11yinspect/recommended"]
}
```

This enables all 93 accessibility rules with appropriate severity levels (error rules as `error`, warning rules as `warn`).

## Accessibility Rules Overview

**93 rules** organized by category (split into error and warning variants):

### Images & Media

| Rule | Default | Description |
|------|---------|-------------|
| `img-element-error` | error | Alt text missing, generic alt detection |
| `img-element-warning` | warn | Decorative images, alt text quality |
| `svg-element-error` | error | SVG roles, accessible names |
| `svg-element-warning` | warn | SVG generic descriptions |
| `media-element-error` | error | Audio/video critical accessibility |
| `media-element-warning` | warn | Audio/video recommendations |
| `track-element-error` | error | Subtitle/caption tracks |
| `canvas-element-error` | error | Canvas role, descriptions |
| `canvas-element-warning` | warn | Canvas decorative marking |

### Links & Navigation

| Rule | Default | Description |
|------|---------|-------------|
| `a-element-error` | error | Link text, href, accessible names |
| `a-element-warning` | warn | Link text quality |
| `skip-link-warning` | warn | Skip navigation links |

### Buttons & Interactive

| Rule | Default | Description |
|------|---------|-------------|
| `button-element-error` | error | Button types, text content |
| `button-element-warning` | warn | Button accessibility improvements |
| `click-handler-warning` | warn | Click handlers on non-interactive elements |
| `focus-element-error` | error | Focus management critical issues |
| `focus-element-warning` | warn | Focus management recommendations |
| `slider-element-warning` | warn | Slider role, accessible name, keyboard support |

### Forms

| Rule | Default | Description |
|------|---------|-------------|
| `input-element-error` | error | Input types and attributes |
| `input-element-warning` | warn | Input accessibility improvements |
| `label-element-error` | error | Label associations |
| `label-element-warning` | warn | Label improvements |
| `select-element-error` | error | Select/dropdown elements |
| `textarea-element-error` | error | Textarea elements |
| `textarea-element-warning` | warn | Textarea improvements |
| `form-element-error` | error | Form structure critical issues |
| `form-element-warning` | warn | Form structure recommendations |
| `optgroup-element-error` | error | Option groups |
| `autocomplete-element-error` | error | Autocomplete attributes |
| `autocomplete-element-warning` | warn | Autocomplete recommendations |
| `required-element-warning` | warn | Required attributes |
| `area-element-error` | error | Image map areas |

### Document Structure

| Rule | Default | Description |
|------|---------|-------------|
| `heading-element-error` | error | Heading hierarchy, hidden headings |
| `heading-element-warning` | warn | Heading improvements |
| `lang-element-error` | error | Language attributes |
| `title-element-error` | error | Page title |
| `title-element-warning` | warn | Title improvements |
| `iframe-element-error` | error | Iframe titles, hidden iframes |
| `iframe-element-warning` | warn | Iframe improvements |
| `list-element-error` | error | List structure critical issues |
| `list-element-warning` | warn | List improvements |
| `dl-element-error` | error | Definition lists |
| `duplicate-id-error` | error | Duplicate id attributes |

### ARIA

| Rule | Default | Description |
|------|---------|-------------|
| `aria-element-error` | error | ARIA attributes, roles critical issues |
| `aria-element-warning` | warn | ARIA recommendations |
| `role-props-element-error` | error | Role required/supported aria properties |
| `role-props-element-warning` | warn | Role property recommendations |
| `description-element-error` | error | aria-describedby critical issues |
| `description-element-warning` | warn | Description recommendations |
| `expanded-element-warning` | warn | aria-expanded states |
| `disabled-element-warning` | warn | aria-disabled |
| `checked-element-error` | error | aria-checked critical issues |
| `checked-element-warning` | warn | aria-checked recommendations |
| `selected-element-warning` | warn | aria-selected states |
| `pressed-element-warning` | warn | aria-pressed states |
| `live-region-error` | error | aria-live regions |
| `orientation-element-error` | error | aria-orientation |
| `accesskey-element-error` | error | Accesskey critical issues |
| `accesskey-element-warning` | warn | Accesskey recommendations |
| `autofocus-element-warning` | warn | Avoid autoFocus attribute |

### Landmarks

| Rule | Default | Description |
|------|---------|-------------|
| `landmark-element-error` | error | Landmark roles critical issues |
| `landmark-element-warning` | warn | Landmark recommendations |
| `section-element-warning` | warn | Section elements |
| `header-element-warning` | warn | Header elements |
| `footer-element-warning` | warn | Footer elements |
| `meta-element-error` | error | Viewport zoom critical issues |
| `meta-element-warning` | warn | Meta recommendations |

### Tables

| Rule | Default | Description |
|------|---------|-------------|
| `table-element-error` | error | Headers, captions critical issues |
| `table-element-warning` | warn | Table recommendations |
| `scope-element-error` | error | Table header scope |

### Dialogs & Components

| Rule | Default | Description |
|------|---------|-------------|
| `dialog-element-error` | error | Dialog/modal critical issues |
| `dialog-element-warning` | warn | Dialog recommendations |
| `details-element-error` | error | Details/summary elements |
| `menu-element-error` | error | Menu element structure |
| `menu-element-warning` | warn | Menu recommendations |
| `tab-element-warning` | warn | Tab, tablist, tabpanel roles |
| `distracting-element-error` | error | No marquee/blink elements |

### Semantic HTML

| Rule | Default | Description |
|------|---------|-------------|
| `figure-element-error` | error | Figure/figcaption |
| `abbr-element-error` | error | Abbreviations |
| `time-element-error` | error | Time elements |
| `blockquote-element-warning` | warn | Blockquote citations |
| `ins-del-element-warning` | warn | Inserted/deleted content |
| `address-element-error` | error | Address elements |
| `ruby-element-error` | error | Ruby annotations |
| `ruby-element-warning` | warn | Ruby recommendations |
| `hr-element-warning` | warn | Horizontal rules |
| `meter-element-error` | error | Meter elements |
| `progress-element-error` | error | Progress elements |
| `output-element-error` | error | Output elements |
| `object-element-error` | error | Embedded content |
| `embed-element-error` | error | Embedded content |
| `map-element-error` | error | Image maps |
| `noscript-element-error` | error | Noscript fallbacks |

## Acceibility Examples

### Bad Accessibility (will trigger errors)

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

### Good Acceibility (passes checks)

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

### More Bad Acceibility Examples

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

### More Good Acceibility Examples

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
<button onClick={handleClick} aria-label="Close dialog">X</button>

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

## Accessibility Support for File Types

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
      "a11yinspect/img-element-error": "error",
      "a11yinspect/img-element-warning": "warn",
      "a11yinspect/a-element-error": "error",
      "a11yinspect/a-element-warning": "warn",
      "a11yinspect/heading-element-error": "error",
      "a11yinspect/heading-element-warning": "warn"
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
      "a11yinspect/img-element-error": "error",
      "a11yinspect/img-element-warning": "warn",
      "a11yinspect/a-element-error": "error",
      "a11yinspect/a-element-warning": "warn"
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
      "a11yinspect/img-element-error": "error",
      "a11yinspect/img-element-warning": "warn",
      "a11yinspect/a-element-error": "error",
      "a11yinspect/a-element-warning": "warn"
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
    "lint:a11y": "eslint . --rule '{\"a11yinspect/img-element-error\": \"error\"}'",
    "lint:report": "eslint . --format json --output-file a11y-report.json"
  }
}
```

## Troubleshooting eslint-plugin-a11yinspect

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
  "a11yinspect/img-element-error": "error",
  "a11yinspect/a-element-error": "error",
  "a11yinspect/heading-element-error": "error"
}
```

## License

MIT - [BarrierBreak](https://www.barrierbreak.com/)

## Resources

- [GitHub Repository](https://github.com/BarrierBreak/eslint-plugin-a11yinspect)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [ESLint Documentation](https://eslint.org/)
