module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for selected state",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      ariaSelectedTrueFalse: "⚠️ [Major] aria-selected should be true or false (4.1.2 A)",
      optionElementHaveValueAttribute: "💡 [Best Practice] option element should have value attribute (4.1.2 A)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name === "option") {
          const valueAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "value"
          );

          if (!valueAttr) {
            context.report({ node, messageId: "optionElementHaveValueAttribute" });
          }
        }

        const ariaSelected = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-selected"
        );

        if (ariaSelected && ariaSelected.value) {
          let selectedValue = null;

          if (ariaSelected.value.type === "Literal") {
            selectedValue = ariaSelected.value.value;
          } else if (ariaSelected.value.type === "JSXExpressionContainer" &&
                     ariaSelected.value.expression.type === "Literal") {
            selectedValue = ariaSelected.value.expression.value;
          }

          if (selectedValue !== null && selectedValue !== "true" && selectedValue !== "false" &&
              selectedValue !== true && selectedValue !== false) {
            context.report({ node: ariaSelected, messageId: "ariaSelectedTrueFalse" });
          }
        }
      }
    };
  }
};
