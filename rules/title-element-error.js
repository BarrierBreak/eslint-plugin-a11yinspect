module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for title element",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      pageMissingTitleElement: "❌ [Major] Page missing title element (2.4.2 A)",
      titleElementEmpty: "❌ [Major] title element is empty (2.4.2 A)"
    },
    schema: []
  },
  create(context) {
    let titleFound = false;

    function getTextContent(node) {
      if (!node) return "";
      if (node.type === "Literal") return String(node.value || "");
      if (node.type === "JSXText") return node.value || "";
      if (node.type === "JSXExpressionContainer" && node.expression.type === "Literal") {
        return String(node.expression.value || "");
      }
      if (node.type === "JSXElement") {
        return node.children.map(child => getTextContent(child)).join("");
      }
      return "";
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name === "title") {
          titleFound = true;

          const parent = node.parent;
          if (parent.type === "JSXElement") {
            const textContent = parent.children.map(child => getTextContent(child)).join("").trim();

            if (!textContent) {
              context.report({ node, messageId: "titleElementEmpty" });
            }
          }
        }
      },
      "Program:exit"() {
        if (!titleFound) {
          const program = context.sourceCode.ast;
          context.report({
            node: program,
            messageId: "pageMissingTitleElement"
          });
        }
      }
    };
  }
};
