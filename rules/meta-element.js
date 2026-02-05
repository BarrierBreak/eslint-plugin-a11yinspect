module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for meta elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      metaRefreshTimeout: "💡 meta refresh with timeout found",
      metaViewportDisablesZoom: "❌ meta viewport disables zoom",
      metaViewportMaxScaleRestrictive: "❌ meta viewport maximum-scale too restrictive",
      viewportUserScalableNo: "❌ Viewport meta tag has user-scalable=no or user-scalable=0",
      viewportMaxScaleLow: "❌ Viewport meta tag has maximum-scale less than 2",
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

        const nameAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "name"
        );

        if (nameAttr && nameAttr.value && nameAttr.value.type === "Literal") {
          if (nameAttr.value.value === "viewport") {
            const contentAttr = node.attributes.find(
              attr => attr.type === "JSXAttribute" && attr.name.name === "content"
            );

            if (contentAttr && contentAttr.value && contentAttr.value.type === "Literal") {
              const content = contentAttr.value.value;

              if (content) {
                if (/user-scalable\s*=\s*(no|0)/i.test(content)) {
                  context.report({ node: contentAttr, messageId: "metaViewportDisablesZoom" });
                  context.report({ node: contentAttr, messageId: "viewportUserScalableNo" });
                }

                const maxScaleMatch = /maximum-scale\s*=\s*([\d.]+)/i.exec(content);
                if (maxScaleMatch) {
                  const maxScale = parseFloat(maxScaleMatch[1]);
                  if (maxScale < 2) {
                    context.report({ node: contentAttr, messageId: "metaViewportMaxScaleRestrictive" });
                    context.report({ node: contentAttr, messageId: "viewportMaxScaleLow" });
                  }
                }
              }
            }
          }
        }
      }
    };
  }
};
