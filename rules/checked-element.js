module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for checked state",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      ariaCheckedTrueFalseMixed: "⚠️ aria-checked should be true, false, or mixed",
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

        const ariaChecked = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-checked"
        );

        if (ariaChecked && ariaChecked.value) {
          let checkedValue = null;

          if (ariaChecked.value.type === "Literal") {
            checkedValue = ariaChecked.value.value;
          } else if (ariaChecked.value.type === "JSXExpressionContainer" && 
                     ariaChecked.value.expression.type === "Literal") {
            checkedValue = ariaChecked.value.expression.value;
          }

          if (checkedValue !== null && checkedValue !== "true" && checkedValue !== "false" && 
              checkedValue !== "mixed" && checkedValue !== true && checkedValue !== false) {
            context.report({ node: ariaChecked, messageId: "ariaCheckedTrueFalseMixed" });
          }
        }
      }
    };
  }
};