module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for noscript elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      noscriptElementEmpty: "❌ noscript element is empty"
    },
    schema: []
  },
  create(context) {
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
        if (node.name.name !== "noscript") return;

        const parent = node.parent;
        if (parent.type === "JSXElement") {
          const textContent = parent.children.map(child => getTextContent(child)).join("").trim();

          if (!textContent) {
            context.report({ node, messageId: "noscriptElementEmpty" });
          }
        }
      }
    };
  }
};