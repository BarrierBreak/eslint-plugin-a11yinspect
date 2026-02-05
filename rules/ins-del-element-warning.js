module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for ins/del elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      insDelHaveDatetimeAttribute: "⚠️ ins/del should have datetime attribute",
      insDelHaveCiteExplanation: "⚠️ ins/del should have cite for explanation"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "ins" && node.name.name !== "del") return;

        const datetimeAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "dateTime"
        );

        if (!datetimeAttr) {
          context.report({ node, messageId: "insDelHaveDatetimeAttribute" });
        }

        const citeAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "cite"
        );

        if (!citeAttr) {
          context.report({ node, messageId: "insDelHaveCiteExplanation" });
        }
      }
    };
  }
};
