module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for textarea elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      textareaMissingAssociatedLabel: "❌ Textarea missing associated label",
      textareaMissingNameAttribute: "❌ Textarea missing name attribute"
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
