# eslint-plugin-a11yinspect — Product Documentation

> Internal technical reference for contributors and maintainers.
> Package: `@barrierbreak/eslint-plugin-a11yinspect` · Version: `1.0.12` · License: MIT

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Repository Structure](#2-repository-structure)
3. [Architecture](#3-architecture)
4. [Rule Anatomy](#4-rule-anatomy)
5. [Rule Catalogue](#5-rule-catalogue)
6. [Preset Configurations](#6-preset-configurations)
7. [Adding a New Rule](#7-adding-a-new-rule)
8. [ESLint Config Files in This Repo](#8-eslint-config-files-in-this-repo)
9. [CI/CD & Publishing](#9-cicd--publishing)
10. [Compatibility Matrix](#10-compatibility-matrix)
11. [Key Design Decisions](#11-key-design-decisions)
12. [Resources](#12-resources)

---

## 1. Product Overview

`eslint-plugin-a11yinspect` is a **zero-dependency, pure static-analysis ESLint plugin** that detects web-accessibility violations in JSX/TSX source files at development time — before the browser ever runs.

### What it checks

| Dimension | Detail |
|---|---|
| Standards | WCAG 2.1 (A / AA), EN 301 549, ARIA 1.2 |
| Total rules | **96** (split into `-error` and `-warning` variants) |
| Analysis target | JSX/TSX AST nodes — no DOM, no runtime, no jsdom |
| Framework support | React, Next.js, Vite, CRA, any JSX toolchain |
| TypeScript | Full `.tsx` support (pair with `@typescript-eslint/parser`) |

### How severity is modelled

Each HTML/ARIA concern is represented as **two separate rules**:

- `*-error` — a definite accessibility violation; triggers **error** in `recommended`.
- `*-warning` — a best-practice recommendation; triggers **warn** in `recommended`.

This lets teams configure precise severity without touching rule internals.

---

## 2. Repository Structure

```
new-plugin/
├── index.js                  # Plugin entry point — registers rules & builds preset configs
├── rules/                    # 92 individual rule files (one file per rule)
│   ├── img-element-error.js
│   ├── img-element-warning.js
│   └── ...
├── package.json
├── .eslintrc.json            # Legacy ESLint config (used by the repo itself)
├── eslint.config.mjs         # Flat ESLint 9 config (used by the repo itself)
├── COMPLETE-CONFIG-GUIDE.md  # Copy-paste configuration guide for users
├── README.md                 # Public npm readme
├── DOCUMENTATION.md          # ← This file
└── .github/
    └── workflows/
        └── publish.yml       # Automated npm publish on git tag push
```

### Key files explained

| File | Purpose |
|---|---|
| `index.js` | Imports every rule module, exports `{ rules, configs }`, and programmatically builds the four preset configs (`recommended`, `strict`, `errors-only`, `warnings-only`). |
| `rules/*.js` | Each file is a self-contained ESLint rule. No shared helpers — intentionally zero coupling. |

---

## 3. Architecture

### Plugin entry point (`index.js`)

```
module.exports = {
  rules: { <rule-name>: require('./rules/<rule-name>'), ... },
  configs: {}          // populated below
}
```

After exporting `rules`, the file **auto-builds** each preset config by iterating `Object.keys(module.exports.rules)` and assigning severity based on whether the name ends in `-warning` or `-error`.

```
recommended   →  -error rules = "error",   -warning rules = "warn"
strict        →  all rules    = "error"
errors-only   →  -error rules = "error",   -warning rules = "off"
warnings-only →  -error rules = "off",     -warning rules = "warn"
```

All configs use the plugin namespace `"a11yinspect/"`, e.g. `"a11yinspect/img-element-error"`.

### Rule execution model

ESLint parses JSX files into an AST and walks it. Each rule registers **visitor functions** that are called for matching AST node types. This plugin exclusively uses the `JSXOpeningElement` visitor (and occasionally `JSXElement`) — it does not walk JavaScript logic, import declarations, or CSS.

```
Source file (JSX)
    │
    ▼ ESLint parser (Espree / @typescript-eslint/parser)
    │
    ▼ AST
    │
    ▼ Rule visitor: JSXOpeningElement(node) { ... }
         │
         ├─ Read node.name.name  → element tag ("img", "button", …)
         ├─ Read node.attributes → JSXAttribute list
         └─ Call context.report({ node, messageId }) on violation
```

No rules perform any async work, file I/O, or network calls.

---

## 4. Rule Anatomy

Every rule file in `rules/` follows the same structure:

```js
module.exports = {
  meta: {
    type: "problem" | "suggestion",   // "problem" for -error, "suggestion" for -warning
    docs: {
      description: "...",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      messageId: "Human-readable violation message with WCAG reference"
    },
    schema: []                        // No rule options — all rules are option-free
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        // 1. Guard: return early if the element tag is not relevant
        if (node.name.name !== "img") return;

        // 2. Read attributes from node.attributes (array of JSXAttribute nodes)
        const altAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "alt"
        );

        // 3. Report a violation
        if (!altAttr) {
          context.report({ node, messageId: "imgMissingAlt" });
        }
      }
    };
  }
};
```

### Conventions

| Convention | Detail |
|---|---|
| `schema: []` | All rules are option-free — no per-rule configuration. Severity is controlled at the config level. |
| WCAG reference in messages | Error messages embed the relevant WCAG success criterion, e.g. `(1.1.1 A)`. |
| Emoji prefix | `❌` for errors, `⚠️` for warnings, `💡` for notices/best practices — improves scannability in editor output. |
| Guard-first pattern | Rules return early if the element tag doesn't match, keeping logic flat and readable. |
| Attribute lookup | Always uses `Array.find()` against `node.attributes` — no helper abstractions. |

---

## 5. Rule Catalogue

96 rules organised by the category they cover.

### Images & Media (9 rules)

| Rule | Severity | What it checks |
|---|---|---|
| `img-element-error` | error | Missing `alt`, empty `alt` (non-decorative images) |
| `img-element-warning` | warn | Decorative image patterns, alt text quality guidance |
| `svg-element-error` | error | SVG missing `role="img"` or accessible name |
| `svg-element-warning` | warn | SVG missing role, role="img" without accessible name, or generic description text |
| `media-element-error` | error | `<audio>`/`<video>` missing critical accessibility attributes |
| `media-element-warning` | warn | Media accessibility recommendations |
| `track-element-error` | error | Missing subtitle/caption `<track>` on video |
| `canvas-element-error` | error | `<canvas>` missing `role="img"` or fallback text |
| `canvas-element-warning` | warn | Decorative canvas marking |

### Links & Navigation (3 rules)

| Rule | Severity | What it checks |
|---|---|---|
| `a-element-error` | error | Empty link text, missing `href`, no accessible name |
| `a-element-warning` | warn | Vague link text ("click here", "read more") |
| `skip-link-warning` | warn | Presence and correctness of skip-navigation links |

### Buttons & Interactive (6 rules)

| Rule | Severity | What it checks |
|---|---|---|
| `button-element-error` | error | Missing `type` attribute, no accessible name, SVG in button missing `role="img"` |
| `button-element-warning` | warn | Button accessibility best practices |
| `click-handler-warning` | warn | `onClick` on non-interactive elements (div, span) without keyboard support |
| `focus-element-error` | error | `outline: 0` / `tabIndex="-1"` misuse |
| `focus-element-warning` | warn | Focus management recommendations |
| `slider-element-warning` | warn | `role="slider"` missing accessible name, `tabIndex`, or value attributes |

### Forms (14 rules)

| Rule | Severity | What it checks |
|---|---|---|
| `input-element-error` | error | `<input>` without associated label or `aria-label` |
| `input-element-warning` | warn | Input accessibility improvements |
| `label-element-error` | error | `<label>` without `for`/`htmlFor` or wrapping an input |
| `label-element-warning` | warn | Label for-attribute forward-reference checks (placeholder — not yet implemented) |
| `select-element-error` | error | `<select>` missing accessible label, name attribute, or options |
| `textarea-element-error` | error | `<textarea>` without accessible label |
| `textarea-element-warning` | warn | Textarea improvements |
| `form-element-error` | error | Form missing accessible name or structure issues |
| `form-element-warning` | warn | Form structure recommendations |
| `optgroup-element-error` | error | `<optgroup>` missing `label` attribute |
| `autocomplete-element-error` | error | Invalid `autocomplete` attribute values |
| `autocomplete-element-warning` | warn | Autocomplete usage recommendations |
| `required-element-warning` | warn | Required fields should have a visible indicator when `required` or `aria-required="true"` is set |
| `area-element-error` | error | Image map `<area>` missing `alt` |

### Document Structure (11 rules)

| Rule | Severity | What it checks |
|---|---|---|
| `heading-element-error` | error | Empty headings, nested headings (`<h2>` inside `<h2>`) |
| `heading-element-warning` | warn | Heading hierarchy recommendations |
| `lang-element-error` | error | `<html>` missing `lang` attribute |
| `title-element-error` | error | Missing or empty `<title>` |
| `title-element-warning` | warn | Title quality improvements |
| `iframe-element-error` | error | `<iframe>` missing `title` or empty `title` |
| `iframe-element-warning` | warn | Iframe accessibility improvements |
| `list-element-error` | error | `<ul>`/`<ol>` with no `<li>` children |
| `list-element-warning` | warn | List structure improvements |
| `dl-element-error` | error | `<dl>` structure violations |
| `duplicate-id-error` | error | Duplicate `id` attributes within a file |

### ARIA (17 rules)

| Rule | Severity | What it checks |
|---|---|---|
| `aria-element-error` | error | Invalid ARIA role values, unknown `aria-*` properties, empty `aria-label` |
| `aria-element-warning` | warn | ARIA usage recommendations |
| `role-props-element-error` | error | Required aria properties missing for a given role |
| `role-props-element-warning` | warn | Supported (non-required) property recommendations per role |
| `description-element-error` | error | `aria-describedby` pointing to non-existent ID |
| `description-element-warning` | warn | Description usage recommendations |
| `expanded-element-warning` | warn | `aria-expanded` missing on toggle controls |
| `disabled-element-warning` | warn | Prefer `disabled` attribute over `aria-disabled` when both are available |
| `checked-element-error` | error | `aria-checked` on incorrect roles |
| `checked-element-warning` | warn | `aria-checked` best practices |
| `selected-element-warning` | warn | `aria-selected` usage |
| `pressed-element-warning` | warn | `aria-pressed` on non-button elements |
| `live-region-error` | error | Invalid `aria-live` values |
| `orientation-element-error` | error | Invalid `aria-orientation` attribute values (must be "horizontal" or "vertical") |
| `accesskey-element-error` | error | Duplicate `accessKey` values |
| `accesskey-element-warning` | warn | `accessKey` usage guidance |
| `autofocus-element-warning` | warn | Use of the `autoFocus` attribute |

### Landmarks (7 rules)

| Rule | Severity | What it checks |
|---|---|---|
| `landmark-element-error` | error | Page missing a `<main>` or `role="main"` landmark |
| `landmark-element-warning` | warn | Landmark usage recommendations |
| `section-element-warning` | warn | `<section>` without accessible name |
| `header-element-warning` | warn | Multiple banner landmarks (more than one `<header>` at page level) |
| `footer-element-warning` | warn | Multiple contentinfo landmarks (more than one `<footer>` at page level) |
| `meta-element-error` | error | `<meta name="viewport">` with `user-scalable=no` or `maximum-scale=1` |
| `meta-element-warning` | warn | Meta tag recommendations |

### Tables (3 rules)

| Rule | Severity | What it checks |
|---|---|---|
| `table-element-error` | error | Data table missing `<th>` headers or `<caption>` |
| `table-element-warning` | warn | Table accessibility recommendations |
| `scope-element-error` | error | `<th>` missing `scope` attribute |

### Dialogs & Components (8 rules)

| Rule | Severity | What it checks |
|---|---|---|
| `dialog-element-error` | error | `<dialog>` element or `role="dialog/alertdialog"` missing accessible name (aria-label or aria-labelledby) |
| `dialog-element-warning` | warn | Dialog accessibility improvements |
| `details-element-error` | error | `<details>` missing `<summary>` child |
| `details-element-warning` | warn | `<details>` with `aria-hidden=true` |
| `menu-element-error` | error | `role="menuitemradio/menuitemcheckbox"` missing accessible name or `aria-checked`; `role="menubar"` missing accessible name |
| `menu-element-warning` | warn | `role="menu"` missing accessible name or proper structure |
| `tab-element-warning` | warn | `role="tab"`, `tablist`, `tabpanel` structure |
| `distracting-element-error` | error | `<marquee>` and `<blink>` elements |

### Semantic HTML (18 rules)

| Rule | Severity | What it checks |
|---|---|---|
| `figure-element-error` | error | `<figure>` missing `<figcaption>` |
| `abbr-element-error` | error | `<abbr>` missing `title` attribute |
| `time-element-error` | error | `<time>` missing `dateTime` attribute |
| `blockquote-element-warning` | warn | `<blockquote>` missing `cite` attribute |
| `ins-del-element-warning` | warn | `<ins>`/`<del>` accessible context |
| `address-element-error` | error | `<address>` containing non-contact content |
| `ruby-element-error` | error | `<ruby>` missing `<rt>` pronunciation text |
| `ruby-element-warning` | warn | Ruby annotation recommendations |
| `hr-element-warning` | warn | Decorative `<hr>` vs. semantic separator |
| `meter-element-error` | error | `<meter>` missing accessible label |
| `progress-element-error` | error | `<progress>` missing accessible label |
| `output-element-error` | error | `<output>` missing `for`/`htmlFor` association |
| `object-element-error` | error | `<object>` missing `type` attribute or fallback content |
| `object-element-warning` | warn | `<object>` with `aria-hidden=true` |
| `embed-element-error` | error | `<embed>` missing accessible alternative |
| `map-element-error` | error | `<map>` missing `name` attribute or empty name |
| `map-element-warning` | warn | `<map>` with `aria-hidden=true` |
| `noscript-element-error` | error | `<noscript>` missing meaningful fallback content |

---

## 6. Preset Configurations

Defined programmatically in `index.js`:

| Config key | `-error` rules | `-warning` rules | Use case |
|---|---|---|---|
| `recommended` | `"error"` | `"warn"` | Default — start here |
| `strict` | `"error"` | `"error"` | Block CI on any issue |
| `errors-only` | `"error"` | `"off"` | Focus on critical issues only |
| `warnings-only` | `"off"` | `"warn"` | Awareness mode, no build failures |

### ESLint 9+ (flat config)

```js
// eslint.config.mjs
import a11yinspect from "@barrierbreak/eslint-plugin-a11yinspect";

export default [{
  files: ["**/*.{js,jsx,ts,tsx}"],
  languageOptions: {
    parserOptions: { ecmaFeatures: { jsx: true } }
  },
  plugins: { a11yinspect },
  rules: {
    ...a11yinspect.configs.recommended.rules   // swap for .strict, ["errors-only"], ["warnings-only"]
  }
}];
```

### ESLint 7–8 (legacy `.eslintrc`)

```json
{
  "extends": ["plugin:@barrierbreak/a11yinspect/recommended"]
}
```

---

## 7. Adding a New Rule

### Step 1 — Create the rule file

Add a file to `rules/`. Follow the naming convention:

- `<element>-element-error.js` for a critical violation rule
- `<element>-element-warning.js` for a best-practice rule

Use the template below:

```js
// rules/my-element-error.js
module.exports = {
  meta: {
    type: "problem",                    // "problem" for errors, "suggestion" for warnings
    docs: {
      description: "Accessibility error checks for my-element elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      myViolation: "❌ [Critical] Describe the issue here (WCAG X.X.X Level)"
    },
    schema: []                          // No options — keep rules option-free
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "my-element") return;  // guard first

        // attribute lookup example
        const myAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "my-attr"
        );

        if (!myAttr) {
          context.report({ node, messageId: "myViolation" });
        }
      }
    };
  }
};
```

### Step 2 — Register it in `index.js`

Add one line to the `rules` object (keep the list alphabetically grouped by element type):

```js
module.exports = {
  rules: {
    // ... existing rules ...
    "my-element-error": require("./rules/my-element-error"),
  },
  // ...
};
```

The preset configs (`recommended`, `strict`, etc.) are **built automatically** from `Object.keys(module.exports.rules)` — no further changes needed.

### Step 3 — Update `README.md`

Add an entry to the appropriate category table in the "Accessibility Rules Overview" section of `README.md`.

### Checklist

- [ ] Rule file created in `rules/`
- [ ] Rule registered in `index.js`
- [ ] `README.md` updated with the new rule row
- [ ] Manually verified against a JSX test file with `npx eslint yourfile.jsx`

---

## 8. ESLint Config Files in This Repo

The repository ships two ESLint config files for linting the plugin's own source:

| File | Format | Scope |
|---|---|---|
| `.eslintrc.json` | Legacy (ESLint 7–8) | Used by older tooling; extends `plugin:a11yinspect/recommended` |
| `eslint.config.mjs` | Flat (ESLint 9+) | Primary config; applies recommended rules to `**/*.{js,jsx,mjs,cjs}` |

Both configs ignore `node_modules`, `dist`, `build`, `coverage`, `.next`, and minified files.

---

## 9. CI/CD & Publishing

### Publish workflow (`.github/workflows/publish.yml`)

| Property | Value |
|---|---|
| Trigger | `push` to any tag matching `v*` (e.g. `v1.0.13`) |
| Node version | 24 |
| Registry | `https://registry.npmjs.org` |
| Auth | OIDC (`id-token: write`) — no stored npm token required |
| Steps | `npm ci` → `npm run build --if-present` → `npm publish` |

### Release process (manual steps)

1. Update `version` in `package.json`.
2. Commit: `git commit -m "1.0.X"`.
3. Tag: `git tag v1.0.X`.
4. Push: `git push && git push --tags`.
5. GitHub Actions picks up the tag and publishes to npm automatically.

### What is published to npm

Controlled by the `files` array in `package.json`:

```json
"files": ["index.js", "rules/", "README.md", "LICENSE"]
```

The following are **not** published: `.github/`, `.eslintrc.json`, `eslint.config.mjs`, `COMPLETE-CONFIG-GUIDE.md`, `DOCUMENTATION.md`, `node_modules/`.

---

## 10. Compatibility Matrix

| ESLint | Config format | Status |
|---|---|---|
| 7.x | `.eslintrc` (legacy) | Supported |
| 8.x | `.eslintrc` (legacy) | Supported |
| 9.x | `eslint.config.mjs` (flat) | Supported (recommended) |

| File extension | JSX parsing | Notes |
|---|---|---|
| `.js` / `.mjs` / `.cjs` | Via `parserOptions.ecmaFeatures.jsx: true` | Default Espree parser |
| `.jsx` | As above | Default Espree parser |
| `.ts` | Requires `@typescript-eslint/parser` | Install separately |
| `.tsx` | Requires `@typescript-eslint/parser` | Install separately |

**Peer dependency:** `eslint >= 7.0.0`
**Engine:** `node >= 14.0.0`
**Zero runtime dependencies** — `node_modules` only contains dev/peer packages used by the repo itself.

---

## 11. Key Design Decisions

### Why split into `-error` / `-warning` pairs?

Teams adopting a large rule set for the first time often need a gradual on-ramp. Splitting rules into error and warning variants lets teams use `errors-only` to fix critical blockers first, then progressively enable warnings — without requiring per-rule configuration in their own ESLint files.

### Why no shared helper utilities?

Rules deliberately avoid shared helper modules. This keeps each rule independently readable, prevents a helper change from silently affecting multiple rules, and makes it easy to copy/move individual rules in the future.

### Why no rule options (`schema: []`)?

Keeping rules option-free simplifies documentation, reduces the API surface, and pushes all configuration decisions to ESLint's built-in severity system. Teams who want partial adoption select a config preset rather than tweaking rule options.

### Why pure static analysis (no jsdom)?

Requiring a browser or DOM environment would make the plugin slow, environment-dependent, and unsuitable for pre-commit hooks or fast editor feedback. All checks are AST-based and run in milliseconds regardless of project size.

---

## 12. Resources

| Resource | Link |
|---|---|
| npm package | https://www.npmjs.com/package/@barrierbreak/eslint-plugin-a11yinspect |
| GitHub repository | https://github.com/BarrierBreak/eslint-plugin-a11yinspect |
| A11yInspect browser extension | https://www.barrierbreak.com/a11yinspect/ |
| WCAG 2.1 quick reference | https://www.w3.org/WAI/WCAG21/quickref/ |
| ARIA Authoring Practices Guide | https://www.w3.org/WAI/ARIA/apg/ |
| ESLint plugin developer guide | https://eslint.org/docs/developer-guide/working-with-plugins |
| EN 301 549 standard | https://www.etsi.org/deliver/etsi_en/301500_302000/301549/ |
