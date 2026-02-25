module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for embed elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      embedMissingAccessibleName: "❌ [Major] embed missing accessible name (4.1.2 A)",
      embedMissingTypeAttribute: "❌ [Best Practice] embed missing type attribute (4.1.2 A)"
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
