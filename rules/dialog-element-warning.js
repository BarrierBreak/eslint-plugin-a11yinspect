module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for dialog elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      modalDialogTrapFocus: "⚠️ [Major] Modal dialog should trap focus (2.4.3 A)",
      dialogAriaHidden: "⚠️ [Major] dialog/alertdialog element with aria-hidden=true is hidden from assistive technology (4.1.2 A)"
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

        if (node.name.name === "dialog" || role === "dialog" || role === "alertdialog") {
          const ariaHiddenAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "aria-hidden"
          );
          if (ariaHiddenAttr && ariaHiddenAttr.value && ariaHiddenAttr.value.type === "Literal" &&
              (ariaHiddenAttr.value.value === "true" || ariaHiddenAttr.value.value === true)) {
            context.report({ node, messageId: "dialogAriaHidden" });
          }
        }

        if (role === "dialog" || role === "alertdialog") {
          const ariaModal = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "aria-modal"
          );

          if (ariaModal && ariaModal.value && ariaModal.value.type === "Literal" &&
              (ariaModal.value.value === "true" || ariaModal.value.value === true)) {
            context.report({ node, messageId: "modalDialogTrapFocus" });
          }
        }
      }
    };
  }
};
