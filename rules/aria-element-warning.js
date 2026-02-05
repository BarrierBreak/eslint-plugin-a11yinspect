module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for ARIA attributes",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      ariaLabelledbyReferencesNonExistent: "⚠️ aria-labelledby references non-existent id",
      ariaHiddenFocusableElement: "⚠️ aria-hidden on focusable element",
      ariaRoleRedundant: "💡 Element has ARIA role that matches its implicit default role",
      ariaRoleInvalidForElement: "⚠️ ARIA role is not allowed on this element type",
      ariaInvalidPropValue: "⚠️ Invalid value for ARIA attribute",
      preferSemanticElement: "💡 Prefer semantic HTML element over ARIA role",
      noninteractiveElementInteractiveRole: "⚠️ Non-interactive element should not have interactive ARIA role",
      interactiveElementNoninteractiveRole: "⚠️ Interactive element should not have non-interactive ARIA role"
    },
    schema: []
  },
  create(context) {
    const validRoles = [
      "alert", "alertdialog", "application", "article", "banner", "button",
      "checkbox", "columnheader", "combobox", "complementary", "contentinfo",
      "definition", "dialog", "directory", "document", "feed", "figure", "form",
      "grid", "gridcell", "group", "heading", "img", "link", "list", "listbox",
      "listitem", "log", "main", "marquee", "math", "menu", "menubar", "menuitem",
      "menuitemcheckbox", "menuitemradio", "navigation", "none", "note", "option",
      "presentation", "progressbar", "radio", "radiogroup", "region", "row",
      "rowgroup", "rowheader", "scrollbar", "search", "searchbox", "separator",
      "slider", "spinbutton", "status", "switch", "tab", "table", "tablist",
      "tabpanel", "term", "textbox", "timer", "toolbar", "tooltip", "tree",
      "treegrid", "treeitem"
    ];

    const validAriaProps = new Set([
      "aria-activedescendant", "aria-atomic", "aria-autocomplete", "aria-busy",
      "aria-checked", "aria-colcount", "aria-colindex", "aria-colspan",
      "aria-controls", "aria-current", "aria-describedby", "aria-description",
      "aria-details", "aria-disabled", "aria-dropeffect", "aria-errormessage",
      "aria-expanded", "aria-flowto", "aria-grabbed", "aria-haspopup",
      "aria-hidden", "aria-invalid", "aria-keyshortcuts", "aria-label",
      "aria-labelledby", "aria-level", "aria-live", "aria-modal",
      "aria-multiline", "aria-multiselectable", "aria-orientation", "aria-owns",
      "aria-placeholder", "aria-posinset", "aria-pressed", "aria-readonly",
      "aria-relevant", "aria-required", "aria-roledescription", "aria-rowcount",
      "aria-rowindex", "aria-rowspan", "aria-selected", "aria-setsize",
      "aria-sort", "aria-valuemax", "aria-valuemin", "aria-valuenow",
      "aria-valuetext", "aria-braillelabel", "aria-brailleroledescription"
    ]);

    const ariaPropTypes = {
      boolean: ["aria-atomic", "aria-busy", "aria-disabled", "aria-grabbed",
        "aria-hidden", "aria-modal", "aria-multiline", "aria-multiselectable",
        "aria-readonly", "aria-required"],
      tristate: ["aria-checked", "aria-pressed"],
      token: {
        "aria-autocomplete": ["inline", "list", "both", "none"],
        "aria-current": ["page", "step", "location", "date", "time", "true", "false"],
        "aria-dropeffect": ["copy", "execute", "link", "move", "none", "popup"],
        "aria-haspopup": ["true", "false", "menu", "listbox", "tree", "grid", "dialog"],
        "aria-invalid": ["grammar", "spelling", "true", "false"],
        "aria-live": ["assertive", "off", "polite"],
        "aria-orientation": ["horizontal", "vertical", "undefined"],
        "aria-relevant": ["additions", "additions text", "all", "removals", "text"],
        "aria-sort": ["ascending", "descending", "none", "other"],
        "aria-expanded": ["true", "false", "undefined"],
        "aria-selected": ["true", "false", "undefined"]
      },
      integer: ["aria-colcount", "aria-colindex", "aria-colspan", "aria-level",
        "aria-posinset", "aria-rowcount", "aria-rowindex", "aria-rowspan",
        "aria-setsize"],
      number: ["aria-valuemax", "aria-valuemin", "aria-valuenow"]
    };

    const focusableElements = ["a", "button", "input", "select", "textarea"];

    const defaultRoles = {
      button: "button", a: "link", img: "img", nav: "navigation",
      header: "banner", footer: "contentinfo", main: "main", aside: "complementary",
      form: "form", select: "listbox", textarea: "textbox",
      ul: "list", ol: "list", li: "listitem", table: "table",
      td: "cell", th: "columnheader", tr: "row", fieldset: "group",
      details: "group", summary: "button", article: "article",
      section: "region", hr: "separator", progress: "progressbar",
      meter: "meter", output: "status", dialog: "dialog"
    };

    const inputDefaultRoles = {
      text: "textbox", checkbox: "checkbox", radio: "radio", range: "slider",
      search: "searchbox", email: "textbox", tel: "textbox", url: "textbox",
      number: "spinbutton"
    };

    const interactiveRoles = new Set([
      "button", "checkbox", "combobox", "gridcell", "link", "listbox", "menu",
      "menubar", "menuitem", "menuitemcheckbox", "menuitemradio", "option",
      "radio", "radiogroup", "scrollbar", "searchbox", "slider", "spinbutton",
      "switch", "tab", "textbox", "treeitem"
    ]);

    const noninteractiveElements = new Set([
      "article", "aside", "blockquote", "caption", "dd", "details", "div",
      "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form",
      "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "li", "main",
      "nav", "ol", "p", "pre", "section", "span", "table", "tbody", "td",
      "tfoot", "th", "thead", "tr", "ul"
    ]);

    const interactiveElements = new Set(["a", "button", "input", "select", "textarea"]);

    const noninteractiveRoles = new Set([
      "alert", "article", "banner", "complementary", "contentinfo", "definition",
      "dialog", "directory", "document", "feed", "figure", "form", "group",
      "heading", "img", "list", "listitem", "log", "main", "marquee", "math",
      "navigation", "none", "note", "presentation", "region", "row", "rowgroup",
      "separator", "status", "table", "term", "timer", "toolbar", "tooltip"
    ]);

    const roleToSemanticElement = {
      button: "<button>", link: "<a>", heading: "<h1>-<h6>",
      navigation: "<nav>", main: "<main>", complementary: "<aside>",
      contentinfo: "<footer>", banner: "<header>", list: "<ul> or <ol>",
      listitem: "<li>", img: "<img>", form: "<form>",
      textbox: "<input> or <textarea>", table: "<table>",
      article: "<article>", region: "<section>"
    };

    function isGenericElement(tagName) {
      return tagName === "div" || tagName === "span";
    }

    function validateAriaValue(attrName, value) {
      if (typeof value !== "string") return true;
      const strVal = value.trim();

      if (ariaPropTypes.boolean.includes(attrName)) {
        return ["true", "false"].includes(strVal);
      }
      if (ariaPropTypes.tristate.includes(attrName)) {
        return ["true", "false", "mixed"].includes(strVal);
      }
      if (ariaPropTypes.token[attrName]) {
        return ariaPropTypes.token[attrName].includes(strVal);
      }
      if (ariaPropTypes.integer.includes(attrName)) {
        return /^-?\d+$/.test(strVal);
      }
      if (ariaPropTypes.number.includes(attrName)) {
        return /^-?\d+(\.\d+)?$/.test(strVal);
      }
      return true;
    }

    return {
      JSXOpeningElement(node) {
        const tagName = node.name.name;
        if (!tagName || typeof tagName !== "string") return;

        // Check all aria-* attributes for value validity
        for (const attr of node.attributes) {
          if (attr.type !== "JSXAttribute" || !attr.name || !attr.name.name) continue;
          const name = attr.name.name;

          if (name.startsWith("aria-") && validAriaProps.has(name)) {
            // Check if value type is valid
            if (attr.value && attr.value.type === "Literal" && attr.value.value != null) {
              const strVal = String(attr.value.value);
              if (!validateAriaValue(name, strVal)) {
                context.report({ node: attr, messageId: "ariaInvalidPropValue" });
              }
            }
          }
        }

        // Role validation for warnings
        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );

        if (roleAttr && roleAttr.value && roleAttr.value.type === "Literal") {
          const role = roleAttr.value.value;
          if (role && validRoles.includes(role)) {
            let implicitRole = defaultRoles[tagName] || null;
            if (tagName === "input") {
              const typeAttr = node.attributes.find(
                attr => attr.type === "JSXAttribute" && attr.name.name === "type"
              );
              const inputType = typeAttr && typeAttr.value && typeAttr.value.type === "Literal"
                ? typeAttr.value.value : "text";
              implicitRole = inputDefaultRoles[inputType] || null;
            }

            if (implicitRole && role === implicitRole) {
              context.report({ node: roleAttr, messageId: "ariaRoleRedundant" });
            }

            // Prefer semantic HTML over role on generic elements
            if (isGenericElement(tagName) && roleToSemanticElement[role]) {
              context.report({ node: roleAttr, messageId: "preferSemanticElement" });
            }

            // Non-interactive element with interactive role
            if (noninteractiveElements.has(tagName) && !isGenericElement(tagName) &&
                interactiveRoles.has(role)) {
              context.report({ node: roleAttr, messageId: "noninteractiveElementInteractiveRole" });
            }

            // Interactive element with non-interactive role
            if (interactiveElements.has(tagName) && noninteractiveRoles.has(role) &&
                role !== "presentation" && role !== "none") {
              context.report({ node: roleAttr, messageId: "interactiveElementNoninteractiveRole" });
            }
          }
        }

        // aria-hidden on focusable
        const ariaHidden = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-hidden"
        );
        if (ariaHidden && ariaHidden.value && ariaHidden.value.type === "Literal") {
          if (ariaHidden.value.value === "true" || ariaHidden.value.value === true) {
            if (focusableElements.includes(tagName)) {
              context.report({ node: ariaHidden, messageId: "ariaHiddenFocusableElement" });
            }
          }
        }
      }
    };
  }
};
