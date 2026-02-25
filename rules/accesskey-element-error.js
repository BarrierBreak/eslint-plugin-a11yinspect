module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for accesskey attributes",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      duplicateAccesskey: "❌ [Best Practice] Duplicate accesskey value found (2.1.1 A)"
    },
    schema: []
  },
  create(context) {
    const accesskeyMap = new Map();

    return {
      JSXOpeningElement(node) {
        const accesskeyAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "accessKey" || attr.name.name === "accesskey")
        );

        if (accesskeyAttr) {
          if (accesskeyAttr.value && accesskeyAttr.value.type === "Literal" &&
              accesskeyAttr.value.value) {
            const key = String(accesskeyAttr.value.value).toLowerCase();
            if (!accesskeyMap.has(key)) {
              accesskeyMap.set(key, []);
            }
            accesskeyMap.get(key).push(accesskeyAttr);
          }
        }
      },
      "Program:exit"() {
        for (const [, nodes] of accesskeyMap) {
          if (nodes.length > 1) {
            nodes.forEach(attrNode => {
              context.report({ node: attrNode, messageId: "duplicateAccesskey" });
            });
          }
        }
      }
    };
  }
};
