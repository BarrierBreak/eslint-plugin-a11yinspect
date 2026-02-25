module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for select elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      selectMissingAssociatedLabel: "❌ [Major] Select missing associated label (4.1.2 A)",
      selectMissingNameAttribute: "❌ [Best Practice] Select missing name attribute (4.1.2 A)",
      selectOptions: "❌ [Best Practice] Select has no options (4.1.2 A)"
    },
    schema: []
  },
  create(context) {
    function hasOptions(children) {
      return children.some(child =>
        child.type === "JSXElement" && child.openingElement.name.name === "option"
      );
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "select") return;

        const idAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "id"
        );

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        if (!idAttr && !ariaLabel) {
          context.report({ node, messageId: "selectMissingAssociatedLabel" });
        }

        const nameAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "name"
        );

        if (!nameAttr) {
          context.report({ node, messageId: "selectMissingNameAttribute" });
        }

        const parent = node.parent;
        if (parent.type === "JSXElement" && parent.children) {
          if (!hasOptions(parent.children)) {
            context.report({ node, messageId: "selectOptions" });
          }
        }
      }
    };
  }
};
