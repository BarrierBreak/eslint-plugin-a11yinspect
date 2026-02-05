module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for expandable elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      ariaExpandedTrueFalse: "⚠️ aria-expanded should be true or false",
      ariaControlsReferencesNonExistent: "⚠️ aria-controls references non-existent id"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const ariaExpanded = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-expanded"
        );

        if (ariaExpanded && ariaExpanded.value) {
          let expandedValue = null;

          if (ariaExpanded.value.type === "Literal") {
            expandedValue = ariaExpanded.value.value;
          } else if (ariaExpanded.value.type === "JSXExpressionContainer" &&
                     ariaExpanded.value.expression.type === "Literal") {
            expandedValue = ariaExpanded.value.expression.value;
          }

          if (expandedValue !== null && expandedValue !== "true" && expandedValue !== "false" &&
              expandedValue !== true && expandedValue !== false) {
            context.report({ node: ariaExpanded, messageId: "ariaExpandedTrueFalse" });
          }
        }

        const ariaControls = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-controls"
        );

        if (ariaControls && ariaControls.value && ariaControls.value.type === "Literal") {
          const controls = ariaControls.value.value;
          if (!controls || controls.trim() === "") {
            context.report({ node: ariaControls, messageId: "ariaControlsReferencesNonExistent" });
          }
        }
      }
    };
  }
};
