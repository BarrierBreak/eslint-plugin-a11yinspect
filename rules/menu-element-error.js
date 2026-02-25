module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for menu elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      menuItemRadioMissingAccessibleName: "❌ menuitemradio missing accessible name (aria-label or aria-labelledby) (4.1.2 A)",
      menuItemCheckboxMissingAccessibleName: "❌ menuitemcheckbox missing accessible name (aria-label or aria-labelledby) (4.1.2 A)",
      menuItemRadioMissingAriaChecked: "❌ menuitemradio missing aria-checked attribute (4.1.2 A)",
      menuItemCheckboxMissingAriaChecked: "❌ menuitemcheckbox missing aria-checked attribute (4.1.2 A)",
      menubarMissingAccessibleName: "❌ menubar missing accessible name (aria-label or aria-labelledby) (4.1.2 A)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );
        const role = roleAttr && roleAttr.value && roleAttr.value.type === "Literal"
          ? roleAttr.value.value : null;

        if (!role) return;

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        if (role === "menubar") {
          if (!ariaLabel) {
            context.report({ node, messageId: "menubarMissingAccessibleName" });
          }
        }

        if (role === "menuitemradio") {
          if (!ariaLabel) {
            context.report({ node, messageId: "menuItemRadioMissingAccessibleName" });
          }
          const ariaChecked = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "aria-checked"
          );
          if (!ariaChecked) {
            context.report({ node, messageId: "menuItemRadioMissingAriaChecked" });
          }
        }

        if (role === "menuitemcheckbox") {
          if (!ariaLabel) {
            context.report({ node, messageId: "menuItemCheckboxMissingAccessibleName" });
          }
          const ariaChecked = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "aria-checked"
          );
          if (!ariaChecked) {
            context.report({ node, messageId: "menuItemCheckboxMissingAriaChecked" });
          }
        }
      }
    };
  }
};
