module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for pressed state",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      ariaPressedTrueFalseMixed: "⚠️ [Major] aria-pressed should be true, false, or mixed (4.1.2 A)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const ariaPressed = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-pressed"
        );

        if (ariaPressed && ariaPressed.value) {
          let pressedValue = null;

          if (ariaPressed.value.type === "Literal") {
            pressedValue = ariaPressed.value.value;
          } else if (ariaPressed.value.type === "JSXExpressionContainer" &&
                     ariaPressed.value.expression.type === "Literal") {
            pressedValue = ariaPressed.value.expression.value;
          }

          if (pressedValue !== null && pressedValue !== "true" && pressedValue !== "false" &&
              pressedValue !== "mixed" && pressedValue !== true && pressedValue !== false) {
            context.report({ node: ariaPressed, messageId: "ariaPressedTrueFalseMixed" });
          }
        }
      }
    };
  }
};
