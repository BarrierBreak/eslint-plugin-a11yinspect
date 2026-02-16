module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for checked state",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      ariaCheckedTrueFalseMixed: "⚠️ aria-checked should be true, false, or mixed"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
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
