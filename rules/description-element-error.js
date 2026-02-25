module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for description elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      ariaDescriptionEmpty: "❌ [Minor] aria-description is empty (4.1.2 A)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const ariaDescription = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-description"
        );

        if (ariaDescription && ariaDescription.value && ariaDescription.value.type === "Literal") {
          const description = ariaDescription.value.value;
          if (!description || description.trim() === "") {
            context.report({ node: ariaDescription, messageId: "ariaDescriptionEmpty" });
          }
        }
      }
    };
  }
};
