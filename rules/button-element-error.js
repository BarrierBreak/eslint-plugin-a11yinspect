module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for button elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      buttonAccessibleName: "❌ Button has no accessible name",
      buttonMissingTypeAttribute: "❌ Button missing type attribute",
      buttonSvgMissingRoleImg: "❌ SVG inside button missing role=\"img\" attribute"
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
          const typeAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "type"
          );

          if (!typeAttr) {
            context.report({ node, messageId: "buttonMissingTypeAttribute" });
          }

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
            context.report({ node, messageId: "buttonAccessibleName" });
            return;
          }

          parent.children.forEach(child => {
            if (child.type === "JSXElement" && child.openingElement.name.name === "svg") {
              const svgRole = child.openingElement.attributes.find(
                attr => attr.type === "JSXAttribute" && attr.name.name === "role"
              );
              if (!svgRole || !svgRole.value || svgRole.value.type !== "Literal" ||
                  svgRole.value.value !== "img") {
                context.report({ node: child.openingElement, messageId: "buttonSvgMissingRoleImg" });
              }
            }
          });
        }
      }
    };
  }
};
