module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for accesskey attributes",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      avoidUsingAccesskeyAttribute: "⚠️ Avoid using accesskey attribute"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const accesskeyAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "accessKey" || attr.name.name === "accesskey")
        );

        if (accesskeyAttr) {
          context.report({ node: accesskeyAttr, messageId: "avoidUsingAccesskeyAttribute" });
        }
      }
    };
  }
};
