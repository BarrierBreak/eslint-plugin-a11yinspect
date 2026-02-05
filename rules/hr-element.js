module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for hr elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      hrHaveRoleSeparatorPresentation: "⚠️ hr should have role separator or presentation"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "hr") return;

        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );

        if (roleAttr && roleAttr.value && roleAttr.value.type === "Literal") {
          const role = roleAttr.value.value;
          if (role !== "separator" && role !== "presentation" && role !== "none") {
            context.report({ node: roleAttr, messageId: "hrHaveRoleSeparatorPresentation" });
          }
        }
      }
    };
  }
};