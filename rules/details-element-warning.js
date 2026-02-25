module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Accessibility warning checks for details elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      detailsAriaHidden: "⚠️ [Major] details element with aria-hidden=true hides its content from assistive technology (4.1.2 A)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "details") return;

        const ariaHidden = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-hidden"
        );

        if (ariaHidden && ariaHidden.value && ariaHidden.value.type === "Literal" &&
            (ariaHidden.value.value === "true" || ariaHidden.value.value === true)) {
          context.report({ node, messageId: "detailsAriaHidden" });
        }
      }
    };
  }
};
