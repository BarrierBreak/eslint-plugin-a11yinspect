module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for ARIA attributes",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      emptyAriaLabelAttribute: "❌ Empty aria-label attribute",
      invalidAriaRole: "❌ Invalid ARIA role",
      ariaInvalidProp: "❌ Invalid ARIA attribute (unknown aria-* property)"
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

    return {
      JSXOpeningElement(node) {
        const tagName = node.name.name;
        if (!tagName || typeof tagName !== "string") return;

        // Check all aria-* attributes for validity
        for (const attr of node.attributes) {
          if (attr.type !== "JSXAttribute" || !attr.name || !attr.name.name) continue;
          const name = attr.name.name;

          if (name.startsWith("aria-")) {
            // Check if aria prop name is valid
            if (!validAriaProps.has(name)) {
              context.report({ node: attr, messageId: "ariaInvalidProp" });
            }
          }
        }

        // Empty aria-label check
        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-label"
        );
        if (ariaLabel && ariaLabel.value && ariaLabel.value.type === "Literal") {
          if (!ariaLabel.value.value || ariaLabel.value.value.trim() === "") {
            context.report({ node: ariaLabel, messageId: "emptyAriaLabelAttribute" });
          }
        }

        // Role validation
        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );

        if (roleAttr && roleAttr.value && roleAttr.value.type === "Literal") {
          const role = roleAttr.value.value;
          if (role && !validRoles.includes(role)) {
            context.report({ node: roleAttr, messageId: "invalidAriaRole" });
          }
        }
      }
    };
  }
};
