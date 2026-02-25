module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for dialog elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      dialogMissingAccessibleName: "❌ [Major] Dialog missing accessible name (4.1.2 A)"
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
