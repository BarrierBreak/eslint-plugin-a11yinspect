module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for input elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      inputPlaceholderLabelSubstitute: "⚠️ Input placeholder is not a label substitute"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "input") return;

        const typeAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "type"
        );

        const typeValue = typeAttr && typeAttr.value && typeAttr.value.type === "Literal"
          ? typeAttr.value.value
          : "text";

        if (typeValue === "hidden") return;

        const idAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "id"
        );

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        const placeholderAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "placeholder"
        );

        if (placeholderAttr && !idAttr && !ariaLabel) {
          context.report({ node, messageId: "inputPlaceholderLabelSubstitute" });
        }
      }
    };
  }
};
