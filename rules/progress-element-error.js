module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for progress elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      progressMissingAccessibleName: "❌ [Critical] progress missing accessible name (4.1.2 A)",
      progressMissingMax: "❌ [Best Practice] progress element missing max attribute (4.1.2 A)",
      progressEmptyMax: "❌ [Best Practice] progress element has empty max attribute (4.1.2 A)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "progress") return;

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        if (!ariaLabel) {
          context.report({ node, messageId: "progressMissingAccessibleName" });
        }

        const maxAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "max"
        );

        if (!maxAttr || !maxAttr.value) {
          context.report({ node, messageId: "progressMissingMax" });
        } else if (maxAttr.value.type === "Literal" &&
                   typeof maxAttr.value.value === "string" && maxAttr.value.value.trim() === "") {
          context.report({ node: maxAttr, messageId: "progressEmptyMax" });
        }
      }
    };
  }
};
