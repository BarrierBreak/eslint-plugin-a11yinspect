module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for focus management",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      activedescendantNotFocusable: "❌ Element with aria-activedescendant must be focusable (add tabIndex)",
      unnecessaryTabindex: "❌ Redundant tabindex=0 on natively focusable element — remove it (4.1.2 A)"
    },
    schema: []
  },
  create(context) {
    const nativeFocusable = new Set(["a", "button", "input", "select", "textarea"]);

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

        // aria-activedescendant requires focusability
        const activeDesc = getAttr(node, "aria-activedescendant");
        if (activeDesc && !isFocusable(node)) {
          context.report({ node, messageId: "activedescendantNotFocusable" });
        }

        if (nativeFocusable.has(tagName)) {
          const tabAttr = getAttr(node, "tabIndex") || getAttr(node, "tabindex");
          if (tabAttr && tabAttr.value) {
            let val = null;
            if (tabAttr.value.type === "Literal") val = tabAttr.value.value;
            else if (tabAttr.value.type === "JSXExpressionContainer" &&
                     tabAttr.value.expression.type === "Literal") val = tabAttr.value.expression.value;
            if (val !== null && parseInt(val, 10) === 0) {
              context.report({ node: tabAttr, messageId: "unnecessaryTabindex" });
            }
          }
        }
      }
    };
  }
};
