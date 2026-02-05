module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for embed elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      embedMissingAccessibleName: "❌ embed missing accessible name",
      embedMissingTypeAttribute: "❌ embed missing type attribute"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "embed") return;

        const typeAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "type"
        );

        if (!typeAttr) {
          context.report({ node, messageId: "embedMissingTypeAttribute" });
        }

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" && 
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        if (!ariaLabel) {
          context.report({ node, messageId: "embedMissingAccessibleName" });
        }
      }
    };
  }
};