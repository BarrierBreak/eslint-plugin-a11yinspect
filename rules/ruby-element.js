module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for ruby elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      rubyMissingRtElement: "❌ ruby missing rt element",
      rubyHaveRpFallback: "⚠️ ruby should have rp for fallback"
    },
    schema: []
  },
  create(context) {
    function hasRt(children) {
      return children.some(child => 
        child.type === "JSXElement" && child.openingElement.name.name === "rt"
      );
    }

    function hasRp(children) {
      return children.some(child => 
        child.type === "JSXElement" && child.openingElement.name.name === "rp"
      );
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "ruby") return;

        const parent = node.parent;
        if (parent.type === "JSXElement" && parent.children) {
          if (!hasRt(parent.children)) {
            context.report({ node, messageId: "rubyMissingRtElement" });
          }

          if (!hasRp(parent.children)) {
            context.report({ node, messageId: "rubyHaveRpFallback" });
          }
        }
      }
    };
  }
};