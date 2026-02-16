module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for autoFocus usage",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      noAutofocus: "⚠️ Avoid using autoFocus - it can disorient screen reader users"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const autofocusAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "autoFocus" || attr.name.name === "autofocus")
        );

        if (autofocusAttr) {
          // Check if it's explicitly set to false
          if (autofocusAttr.value &&
              autofocusAttr.value.type === "JSXExpressionContainer" &&
              autofocusAttr.value.expression.type === "Literal" &&
              autofocusAttr.value.expression.value === false) {
            return;
          }
          context.report({ node: autofocusAttr, messageId: "noAutofocus" });
        }
      }
    };
  }
};
