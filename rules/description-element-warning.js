module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for description elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      elementAriaDescribedbyReferencesNon: "⚠️ Element with aria-describedby references non-existent id"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
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
