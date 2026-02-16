module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for meta elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      metaRefreshTimeout: "💡 meta refresh with timeout found",
      metaRefreshDetected: "💡 Meta http-equiv=\"refresh\" detected"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "meta") return;

        const httpEquivAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "http-equiv"
        );

        if (httpEquivAttr && httpEquivAttr.value && httpEquivAttr.value.type === "Literal") {
          if (httpEquivAttr.value.value === "refresh") {
            const contentAttr = node.attributes.find(
              attr => attr.type === "JSXAttribute" && attr.name.name === "content"
            );

            if (contentAttr && contentAttr.value && contentAttr.value.type === "Literal") {
              const content = contentAttr.value.value;
              if (content) {
                context.report({ node, messageId: "metaRefreshDetected" });
                if (!/^0;/.test(content)) {
                  context.report({ node, messageId: "metaRefreshTimeout" });
                }
              }
            }
          }
        }
      }
    };
  }
};
