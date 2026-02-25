module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for form elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      formMissingAccessibleName: "❌ [Minor] Form missing accessible name (1.3.1 A)",
      fieldsetMissingLegend: "❌ [Minor] Fieldset missing legend (1.3.1 A)"
    },
    schema: []
  },
  create(context) {
    function hasLegend(children) {
      return children.some(child =>
        child.type === "JSXElement" && child.openingElement.name.name === "legend"
      );
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name === "form") {
          const ariaLabel = node.attributes.find(
            attr => attr.type === "JSXAttribute" &&
            (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
          );

          const nameAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "name"
          );

          if (!ariaLabel && !nameAttr) {
            context.report({ node, messageId: "formMissingAccessibleName" });
          }
        }

        if (node.name.name === "fieldset") {
          const parent = node.parent;
          if (parent.type === "JSXElement" && parent.children) {
            if (!hasLegend(parent.children)) {
              context.report({ node, messageId: "fieldsetMissingLegend" });
            }
          }
        }
      }
    };
  }
};
