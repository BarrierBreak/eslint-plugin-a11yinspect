module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for disabled elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      disabledElementTabOrder: "⚠️ Disabled element should not be in tab order",
      ariaDisabledTrueFalse: "⚠️ aria-disabled should be true or false"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const disabledAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "disabled"
        );

        const tabindexAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "tabIndex"
        );

        if (disabledAttr && tabindexAttr) {
          let tabindexValue = null;

          if (tabindexAttr.value && tabindexAttr.value.type === "Literal") {
            tabindexValue = tabindexAttr.value.value;
          } else if (tabindexAttr.value && tabindexAttr.value.type === "JSXExpressionContainer" &&
                     tabindexAttr.value.expression.type === "Literal") {
            tabindexValue = tabindexAttr.value.expression.value;
          }

          if (tabindexValue !== null && parseInt(tabindexValue, 10) >= 0) {
            context.report({ node: tabindexAttr, messageId: "disabledElementTabOrder" });
          }
        }

        const ariaDisabled = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-disabled"
        );

        if (ariaDisabled && ariaDisabled.value) {
          let disabledValue = null;

          if (ariaDisabled.value.type === "Literal") {
            disabledValue = ariaDisabled.value.value;
          } else if (ariaDisabled.value.type === "JSXExpressionContainer" &&
                     ariaDisabled.value.expression.type === "Literal") {
            disabledValue = ariaDisabled.value.expression.value;
          }

          if (disabledValue !== null && disabledValue !== "true" && disabledValue !== "false" &&
              disabledValue !== true && disabledValue !== false) {
            context.report({ node: ariaDisabled, messageId: "ariaDisabledTrueFalse" });
          }
        }
      }
    };
  }
};
