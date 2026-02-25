module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for SVG elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      svgMissingName: "❌ [Major] SVG missing accessible name (1.1.1 A)"
    },
    schema: []
  },
  create(context) {
    function hasTitle(children) {
      return children.some(child =>
        child.type === "JSXElement" && child.openingElement.name.name === "title"
      );
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "svg") return;

        const ariaLabelAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-label"
        );
        const ariaLabelledByAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-labelledby"
        );
        const ariaHidden = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-hidden"
        );

        const parent = node.parent;
        const title = parent.type === "JSXElement" ? hasTitle(parent.children) : false;

        if (ariaHidden && ariaHidden.value && ariaHidden.value.type === "Literal" &&
            (ariaHidden.value.value === "true" || ariaHidden.value.value === true)) {
          return;
        }

        const hasAriaLabel = ariaLabelAttr && ariaLabelAttr.value;
        const hasAriaLabelledBy = ariaLabelledByAttr && ariaLabelledByAttr.value;

        if (!hasAriaLabel && !hasAriaLabelledBy && !title) {
          context.report({ node, messageId: "svgMissingName" });
        }
      }
    };
  }
};
