module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for button elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      buttonTextGeneric: "⚠️ [Major] Button text is generic (2.4.6 AA)"
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
        if (node.name.name === "button") {
          const ariaLabel = node.attributes.find(
            attr => attr.type === "JSXAttribute" &&
            (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
          );

          if (ariaLabel && ariaLabel.value && ariaLabel.value.type === "Literal" && ariaLabel.value.value) {
            return;
          }

          const parent = node.parent;
          if (parent.type !== "JSXElement") return;

          const textContent = parent.children.map(child => getTextContent(child)).join("").trim();

          if (!textContent) {
            return;
          }

          if (/^(click|submit|ok|yes|no)$/i.test(textContent)) {
            context.report({ node, messageId: "buttonTextGeneric" });
          }
        }

      }
    };
  }
};
