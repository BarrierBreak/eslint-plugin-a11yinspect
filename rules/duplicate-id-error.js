module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for duplicate IDs",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      duplicateIdAttributeFound: "❌ Duplicate id attribute found"
    },
    schema: []
  },
  create(context) {
    const idMap = new Map();

    return {
      JSXOpeningElement(node) {
        const idAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "id"
        );

        if (idAttr && idAttr.value && idAttr.value.type === "Literal") {
          const id = idAttr.value.value;

          if (id && id.trim() !== "") {
            if (idMap.has(id)) {
              context.report({ node: idAttr, messageId: "duplicateIdAttributeFound" });
            } else {
              idMap.set(id, node);
            }
          }
        }
      }
    };
  }
};
