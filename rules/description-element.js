module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for description elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      elementAriaDescribedbyReferencesNon: "⚠️ Element with aria-describedby references non-existent id",
      ariaDescriptionEmpty: "❌ aria-description is empty"
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

        const ariaDescribedby = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-describedby"
        );

        if (ariaDescribedby && ariaDescribedby.value && ariaDescribedby.value.type === "Literal") {
          const describedby = ariaDescribedby.value.value;
          if (!describedby || describedby.trim() === "") {
            context.report({ node: ariaDescribedby, messageId: "elementAriaDescribedbyReferencesNon" });
          }
        }
      }
    };
  }
};