module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for label elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      labelMissingAttribute: "❌ Label missing for attribute",
      labelTextContent: "❌ Label has no text content",
      labelAttributeReferencesNonExistent: "⚠️ Label for attribute references non-existent id"
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

    function hasInputChild(node) {
      if (node.type !== "JSXElement") return false;
      return node.children.some(child => {
        if (child.type === "JSXElement" && child.openingElement.name.name === "input") {
          return true;
        }
        return false;
      });
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "label") return;

        const forAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "htmlFor"
        );

        const parent = node.parent;
        const hasInputInside = parent.type === "JSXElement" && hasInputChild(parent);

        if (!forAttr && !hasInputInside) {
          context.report({ node, messageId: "labelMissingAttribute" });
        }

        if (parent.type === "JSXElement") {
          const textContent = parent.children.map(child => getTextContent(child)).join("").trim();

          if (!textContent) {
            context.report({ node, messageId: "labelTextContent" });
          }
        }
      }
    };
  }
};