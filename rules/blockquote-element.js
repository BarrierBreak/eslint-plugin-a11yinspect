module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for blockquote elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      blockquoteHaveCiteAttributeAttribution: "⚠️ blockquote should have cite attribute for attribution"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "blockquote") return;

        const citeAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "cite"
        );

        if (!citeAttr) {
          context.report({ node, messageId: "blockquoteHaveCiteAttributeAttribution" });
        }
      }
    };
  }
};