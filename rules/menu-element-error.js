module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for menu elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      menuMissingAccessibleName: "❌ menu missing accessible name"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );

        if (node.name.name !== "menu" &&
            (!roleAttr || !roleAttr.value || roleAttr.value.type !== "Literal" ||
             roleAttr.value.value !== "menu")) {
          return;
        }

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        if (!ariaLabel) {
          context.report({ node, messageId: "menuMissingAccessibleName" });
        }
      }
    };
  }
};
