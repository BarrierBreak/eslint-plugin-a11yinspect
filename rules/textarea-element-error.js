module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for textarea elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      textareaMissingAssociatedLabel: "❌ [Major] Textarea missing associated label (1.3.1 A)",
      textareaMissingNameAttribute: "❌ [Best Practice] Textarea missing name attribute (1.3.1 A)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "textarea") return;

        const idAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "id"
        );

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        if (!idAttr && !ariaLabel) {
          context.report({ node, messageId: "textareaMissingAssociatedLabel" });
        }

        const nameAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "name"
        );

        if (!nameAttr) {
          context.report({ node, messageId: "textareaMissingNameAttribute" });
        }
      }
    };
  }
};
