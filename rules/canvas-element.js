module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for canvas elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      canvasMissingRoleImg: "❌ Canvas element missing role=\"img\" attribute",
      canvasDecorative: "💡 Canvas marked as decorative - verify if informative or decorative",
      canvasMissingDescription: "⚠️ Canvas with role=\"img\" missing accessible description (no aria-label, aria-labelledby, or text content)",
      canvasHasDescription: "💡 Canvas element has accessible description - verify it is accurate"
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
        if (node.name.name !== "canvas") return;

        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );
        const ariaHidden = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-hidden"
        );
        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-label"
        );
        const ariaLabelledBy = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-labelledby"
        );

        const role = roleAttr && roleAttr.value && roleAttr.value.type === "Literal"
          ? roleAttr.value.value : null;

        const parent = node.parent;
        const textContent = parent.type === "JSXElement"
          ? parent.children.map(child => getTextContent(child)).join("").trim()
          : "";

        const isDecorative = role === "presentation" || role === "none" ||
          (ariaHidden && ariaHidden.value && ariaHidden.value.type === "Literal" &&
           (ariaHidden.value.value === "true" || ariaHidden.value.value === true));

        if (isDecorative) {
          context.report({ node, messageId: "canvasDecorative" });
          return;
        }

        if (role === "img") {
          const hasAriaLabel = ariaLabel && ariaLabel.value &&
            ariaLabel.value.type === "Literal" && ariaLabel.value.value &&
            ariaLabel.value.value.trim() !== "";
          const hasAriaLabelledBy = ariaLabelledBy && ariaLabelledBy.value;

          if (hasAriaLabel || hasAriaLabelledBy || textContent) {
            context.report({ node, messageId: "canvasHasDescription" });
          } else {
            context.report({ node, messageId: "canvasMissingDescription" });
          }
          return;
        }

        if (textContent) {
          context.report({ node, messageId: "canvasHasDescription" });
        } else {
          context.report({ node, messageId: "canvasMissingRoleImg" });
        }
      }
    };
  }
};
