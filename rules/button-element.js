module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for button elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      buttonAccessibleName: "❌ Button has no accessible name",
      buttonTextGeneric: "⚠️ Button text is generic",
      buttonMissingTypeAttribute: "❌ Button missing type attribute",
      interactiveDivSpanButton: "⚠️ Interactive div/span should be a button",
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

          if (/^(click|submit|ok|yes|no)$/i.test(textContent)) {
            context.report({ node, messageId: "buttonTextGeneric" });
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

        if (node.name.name === "div" || node.name.name === "span") {
          const hasClickHandler = node.attributes.some(
            attr => attr.type === "JSXAttribute" && /^on(Click|KeyDown|KeyPress|KeyUp)$/i.test(attr.name.name)
          );

          if (hasClickHandler) {
            const hasRole = node.attributes.some(
              attr => attr.type === "JSXAttribute" && attr.name.name === "role"
            );

            if (!hasRole) {
              context.report({ node, messageId: "interactiveDivSpanButton" });
            }
          }
        }
      }
    };
  }
};