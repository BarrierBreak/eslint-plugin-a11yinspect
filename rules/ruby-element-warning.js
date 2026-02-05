module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for ruby elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      rubyHaveRpFallback: "⚠️ ruby should have rp for fallback"
    },
    schema: []
  },
  create(context) {
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
          if (!hasRp(parent.children)) {
            context.report({ node, messageId: "rubyHaveRpFallback" });
          }
        }
      }
    };
  }
};
