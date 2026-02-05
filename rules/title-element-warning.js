module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for title element",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      titleElementTooLong60: "⚠️ title element too long (>60 chars)"
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
        if (node.name.name === "title") {
          const parent = node.parent;
          if (parent.type === "JSXElement") {
            const textContent = parent.children.map(child => getTextContent(child)).join("").trim();

            if (textContent && textContent.length > 60) {
              context.report({ node, messageId: "titleElementTooLong60" });
            }
          }
        }
      }
    };
  }
};
