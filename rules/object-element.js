module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for object elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      objectMissingFallbackContent: "❌ object missing fallback content",
      objectMissingTypeAttribute: "❌ object missing type attribute",
      objectMissingAccessibleName: "❌ object missing accessible name"
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
        if (node.name.name !== "object") return;

        const typeAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "type"
        );

        if (!typeAttr) {
          context.report({ node, messageId: "objectMissingTypeAttribute" });
        }

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" && 
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        const parent = node.parent;
        const textContent = parent.type === "JSXElement" 
          ? parent.children.map(child => getTextContent(child)).join("").trim()
          : "";

        if (!ariaLabel && !textContent) {
          context.report({ node, messageId: "objectMissingFallbackContent" });
        }
      }
    };
  }
};