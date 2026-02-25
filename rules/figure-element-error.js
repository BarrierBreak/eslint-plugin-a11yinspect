module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for figure elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      figureMissingFigcaption: "❌ [Minor] figure missing figcaption (1.1.1 A)"
    },
    schema: []
  },
  create(context) {
    function hasFigcaption(children) {
      return children.some(child =>
        child.type === "JSXElement" && child.openingElement.name.name === "figcaption"
      );
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "figure") return;

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        if (ariaLabel) return;

        const parent = node.parent;
        if (parent.type === "JSXElement" && parent.children) {
          if (!hasFigcaption(parent.children)) {
            context.report({ node, messageId: "figureMissingFigcaption" });
          }
        }
      }
    };
  }
};
