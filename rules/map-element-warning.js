module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Accessibility warning checks for map elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      mapAriaHidden: "⚠️ map element with aria-hidden=true is hidden from assistive technology"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "map") return;

        const ariaHidden = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-hidden"
        );

        if (ariaHidden && ariaHidden.value && ariaHidden.value.type === "Literal" &&
            (ariaHidden.value.value === "true" || ariaHidden.value.value === true)) {
          context.report({ node, messageId: "mapAriaHidden" });
        }
      }
    };
  }
};
