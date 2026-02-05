module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for meter elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      meterMissingAccessibleName: "❌ meter missing accessible name",
      meterMissingMinMaxAttributes: "❌ meter missing min/max attributes"
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
        if (node.name.name !== "meter") return;

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" && 
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        const parent = node.parent;
        const textContent = parent.type === "JSXElement" 
          ? parent.children.map(child => getTextContent(child)).join("").trim()
          : "";

        if (!ariaLabel && !textContent) {
          context.report({ node, messageId: "meterMissingAccessibleName" });
        }

        const minAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "min"
        );

        const maxAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "max"
        );

        if (!minAttr || !maxAttr) {
          context.report({ node, messageId: "meterMissingMinMaxAttributes" });
        }
      }
    };
  }
};