module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for hr elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      hrHaveRoleSeparatorPresentation: "💡 [Best Practice] hr should have role separator or presentation (1.3.1 A)"
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
