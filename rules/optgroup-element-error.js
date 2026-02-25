module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for optgroup elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      optgroupMissingLabelAttribute: "❌ [Best Practice] optgroup missing label attribute (1.3.1 A)",
      optgroupEmptyLabel: "❌ [Best Practice] optgroup has empty label (1.3.1 A)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "optgroup") return;

        const labelAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "label"
        );

        if (!labelAttr) {
          context.report({ node, messageId: "optgroupMissingLabelAttribute" });
          return;
        }

        if (!labelAttr.value ||
            (labelAttr.value.type === "Literal" && !labelAttr.value.value.trim())) {
          context.report({ node: labelAttr, messageId: "optgroupEmptyLabel" });
        }
      }
    };
  }
};
