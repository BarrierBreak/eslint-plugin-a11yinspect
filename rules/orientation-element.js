module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for orientation",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      contentLockedSpecificOrientation: "⚠️ Content should not be locked to specific orientation",
      invalidAriaOrientationValue: "❌ Invalid aria-orientation value"
    },
    schema: []
  },
  create(context) {
    const validOrientations = ["horizontal", "vertical"];

    return {
      JSXOpeningElement(node) {
        const ariaOrientation = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-orientation"
        );

        if (ariaOrientation && ariaOrientation.value && ariaOrientation.value.type === "Literal") {
          const orientation = ariaOrientation.value.value;
          if (orientation && !validOrientations.includes(orientation)) {
            context.report({ node: ariaOrientation, messageId: "invalidAriaOrientationValue" });
          }
        }
      }
    };
  }
};