module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for required attributes",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      requiredFieldHaveVisualIndicator: "⚠️ [Major] Required field should have visual indicator (3.3.2 A)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "input" && node.name.name !== "select" &&
            node.name.name !== "textarea") return;

        const requiredAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "required"
        );

        const ariaRequired = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-required"
        );

        if (requiredAttr || (ariaRequired && ariaRequired.value &&
            ariaRequired.value.type === "Literal" &&
            (ariaRequired.value.value === "true" || ariaRequired.value.value === true))) {
          context.report({ node, messageId: "requiredFieldHaveVisualIndicator" });
        }
      }
    };
  }
};
