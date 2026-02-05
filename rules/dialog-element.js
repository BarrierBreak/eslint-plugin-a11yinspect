module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for dialog elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      dialogMissingAccessibleName: "❌ Dialog missing accessible name",
      dialogMissingRoleDialogAlertdialog: "❌ Dialog missing role dialog or alertdialog",
      modalDialogTrapFocus: "⚠️ Modal dialog should trap focus"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );

        const role = roleAttr && roleAttr.value && roleAttr.value.type === "Literal"
          ? roleAttr.value.value
          : null;

        if (role === "dialog" || role === "alertdialog") {
          const ariaLabel = node.attributes.find(
            attr => attr.type === "JSXAttribute" && 
            (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
          );

          if (!ariaLabel) {
            context.report({ node, messageId: "dialogMissingAccessibleName" });
          }

          const ariaModal = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "aria-modal"
          );

          if (ariaModal && ariaModal.value && ariaModal.value.type === "Literal" &&
              (ariaModal.value.value === "true" || ariaModal.value.value === true)) {
            context.report({ node, messageId: "modalDialogTrapFocus" });
          }
        }

        if (node.name.name === "dialog") {
          const ariaLabel = node.attributes.find(
            attr => attr.type === "JSXAttribute" && 
            (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
          );

          if (!ariaLabel) {
            context.report({ node, messageId: "dialogMissingAccessibleName" });
          }
        }
      }
    };
  }
};