module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for focus management",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      positiveTabindexValueFound: "💡 Positive tabindex value found",
      elementTabindexButRole: "⚠️ Element has tabindex but no role",
      interactiveRoleNotFocusable: "⚠️ Element with interactive role must be focusable (add tabIndex)"
    },
    schema: []
  },
  create(context) {
    const nativeFocusable = new Set(["a", "button", "input", "select", "textarea"]);

    const interactiveRoles = new Set([
      "button", "checkbox", "combobox", "gridcell", "link", "listbox", "menu",
      "menubar", "menuitem", "menuitemcheckbox", "menuitemradio", "option",
      "radio", "radiogroup", "scrollbar", "searchbox", "slider", "spinbutton",
      "switch", "tab", "textbox", "treeitem"
    ]);

    function getAttr(node, name) {
      return node.attributes.find(
        attr => attr.type === "JSXAttribute" && attr.name.name === name
      );
    }

    function hasTabIndex(node) {
      const tabAttr = getAttr(node, "tabIndex") || getAttr(node, "tabindex");
      return !!tabAttr;
    }

    function isFocusable(node) {
      const tagName = node.name.name;
      if (nativeFocusable.has(tagName)) return true;
      return hasTabIndex(node);
    }

    return {
      JSXOpeningElement(node) {
        const tagName = node.name.name;
        if (!tagName || typeof tagName !== "string") return;

        // Existing tabindex checks
        const tabindexAttr = getAttr(node, "tabIndex") || getAttr(node, "tabindex");

        if (tabindexAttr && tabindexAttr.value) {
          let tabindexValue = null;

          if (tabindexAttr.value.type === "Literal") {
            tabindexValue = tabindexAttr.value.value;
          } else if (tabindexAttr.value.type === "JSXExpressionContainer" &&
                     tabindexAttr.value.expression.type === "Literal") {
            tabindexValue = tabindexAttr.value.expression.value;
          }

          if (tabindexValue !== null) {
            const numValue = parseInt(tabindexValue, 10);

            if (!isNaN(numValue) && numValue > 0) {
              context.report({ node: tabindexAttr, messageId: "positiveTabindexValueFound" });
            }

            if (numValue === 0 || numValue === -1) {
              const roleAttr = getAttr(node, "role");
              if (!roleAttr && !nativeFocusable.has(tagName)) {
                context.report({ node: tabindexAttr, messageId: "elementTabindexButRole" });
              }
            }
          }
        }

        // Interactive role must be focusable
        const roleAttr = getAttr(node, "role");
        if (roleAttr && roleAttr.value && roleAttr.value.type === "Literal") {
          const role = roleAttr.value.value;
          if (role && interactiveRoles.has(role) && !isFocusable(node)) {
            context.report({ node, messageId: "interactiveRoleNotFocusable" });
          }
        }
      }
    };
  }
};
