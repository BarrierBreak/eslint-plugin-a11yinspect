module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for output elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      outputMissingAccessibleName: "❌ output missing accessible name"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "output") return;

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        const nameAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "name"
        );

        if (!ariaLabel && !nameAttr) {
          context.report({ node, messageId: "outputMissingAccessibleName" });
        }
      }
    };
  }
};
