module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for details/summary elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      detailsElementMissingSummaryChild: "❌ [Major] details element missing summary child (1.3.1 A)",
      summaryElementInsideDetails: "❌ [Major] summary element not inside details (1.3.1 A)"
    },
    schema: []
  },
  create(context) {
    function hasSummary(children) {
      return children.some(child =>
        child.type === "JSXElement" && child.openingElement.name.name === "summary"
      );
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name === "details") {

          const parent = node.parent;
          if (parent.type === "JSXElement" && parent.children) {
            if (!hasSummary(parent.children)) {
              context.report({ node, messageId: "detailsElementMissingSummaryChild" });
            }
          }
        }

        if (node.name.name === "summary") {
          let current = node.parent;
          let foundDetails = false;

          while (current) {
            if (current.type === "JSXElement" && current.openingElement.name.name === "details") {
              foundDetails = true;
              break;
            }
            current = current.parent;
          }

          if (!foundDetails) {
            context.report({ node, messageId: "summaryElementInsideDetails" });
          }
        }
      }
    };
  }
};
