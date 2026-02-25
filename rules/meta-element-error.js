module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for meta elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      metaViewportDisablesZoom: "❌ [Minor] meta viewport disables zoom (1.4.4 AA)",
      viewportUserScalableNo: "❌ [Major] Viewport meta tag has user-scalable=no or user-scalable=0 (1.4.4 AA)",
      viewportMaxScaleLow: "❌ [Major] Viewport meta tag has maximum-scale less than 2 (1.4.4 AA)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "meta") return;

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
