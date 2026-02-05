module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for title element",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      pageMissingTitleElement: "❌ Page missing title element",
      titleElementEmpty: "❌ title element is empty",
      titleElementTooLong60: "⚠️ title element too long (>60 chars)"
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
            } else if (textContent.length > 60) {
              context.report({ node, messageId: "titleElementTooLong60" });
            }
          }
        }
      },
      "Program:exit"() {
        if (!titleFound) {
          const program = context.getSourceCode().ast;
          context.report({ 
            node: program, 
            messageId: "pageMissingTitleElement"
          });
        }
      }
    };
  }
};