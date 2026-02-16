module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for landmark elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      pageHaveMainLandmark: "❌ [Major] Page should have main landmark (1.3.1 A)"
    },
    schema: []
  },
  create(context) {
    let mainCount = 0;

    return {
      JSXOpeningElement(node) {
        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );

        const role = roleAttr && roleAttr.value && roleAttr.value.type === "Literal"
          ? roleAttr.value.value
          : null;

        if (node.name.name === "main" || role === "main") {
          mainCount++;
        }
      },
      "Program:exit"() {
        if (mainCount === 0) {
          const program = context.sourceCode.ast;
          context.report({ node: program, messageId: "pageHaveMainLandmark" });
        }
      }
    };
  }
};
