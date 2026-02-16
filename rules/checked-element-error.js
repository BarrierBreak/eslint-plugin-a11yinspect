module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for checked state",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      checkboxRadioMissingNameAttribute: "❌ Checkbox/radio missing name attribute"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name === "input") {
          const typeAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "type"
          );

          const typeValue = typeAttr && typeAttr.value && typeAttr.value.type === "Literal"
            ? typeAttr.value.value
            : null;

          if (typeValue === "checkbox" || typeValue === "radio") {
            const nameAttr = node.attributes.find(
              attr => attr.type === "JSXAttribute" && attr.name.name === "name"
            );

            if (!nameAttr) {
              context.report({ node, messageId: "checkboxRadioMissingNameAttribute" });
            }
          }
        }
      }
    };
  }
};
