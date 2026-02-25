module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for heading elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      multipleH1: "💡 [Best Practice] Multiple h1 elements on page (1.3.1 A)",
      headingOnlyImageNoAlt: "⚠️ Heading contains only image without alt",
      headingHiddenOrPresentation: "💡 Heading has role=presentation/none or aria-hidden=true",
      headingTextTooLong: "⚠️ Heading text exceeds 120 characters or contains only special characters",
      headingRoleMissingAriaLevel: "💡 Element with role=\"heading\" missing aria-level attribute (1.3.1 A)"
    },
    schema: []
  },
  create(context) {
    let h1Count = 0;

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

    function hasOnlyImageWithoutAlt(children) {
      const nonEmptyChildren = children.filter(child => {
        if (child.type === "JSXText") return child.value.trim() !== "";
        return true;
      });

      if (nonEmptyChildren.length === 1 && nonEmptyChildren[0].type === "JSXElement") {
        const child = nonEmptyChildren[0];
        if (child.openingElement.name.name === "img") {
          const altAttr = child.openingElement.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "alt"
          );
          if (!altAttr || !altAttr.value ||
              (altAttr.value.type === "Literal" && !altAttr.value.value)) {
            return true;
          }
        }
      }
      return false;
    }

    return {
      JSXOpeningElement(node) {
        const headingMatch = /^h([1-6])$/.exec(node.name.name);
        if (!headingMatch) {
          const roleAttrCheck = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "role"
          );
          if (roleAttrCheck && roleAttrCheck.value && roleAttrCheck.value.type === "Literal" &&
              roleAttrCheck.value.value === "heading") {
            const ariaLevelAttr = node.attributes.find(
              attr => attr.type === "JSXAttribute" && attr.name.name === "aria-level"
            );
            if (!ariaLevelAttr) {
              context.report({ node, messageId: "headingRoleMissingAriaLevel" });
            }
          }
          return;
        }

        const level = parseInt(headingMatch[1], 10);

        if (level === 1) {
          h1Count++;
          if (h1Count > 1) {
            context.report({ node, messageId: "multipleH1" });
          }
        }

        const parent = node.parent;
        if (parent.type !== "JSXElement") return;

        const textContent = parent.children.map(child => getTextContent(child)).join("").trim();

        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );
        const ariaHidden = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-hidden"
        );
        const roleValue = roleAttr && roleAttr.value && roleAttr.value.type === "Literal"
          ? roleAttr.value.value : null;
        const isHidden = roleValue === "presentation" || roleValue === "none" ||
          (ariaHidden && ariaHidden.value && ariaHidden.value.type === "Literal" &&
           (ariaHidden.value.value === "true" || ariaHidden.value.value === true));

        if (isHidden) {
          context.report({ node, messageId: "headingHiddenOrPresentation" });
        }

        if (!textContent) {
          if (hasOnlyImageWithoutAlt(parent.children)) {
            context.report({ node, messageId: "headingOnlyImageNoAlt" });
          }
          return;
        }

        if (textContent.length > 120 || /^[^a-zA-Z0-9]+$/.test(textContent)) {
          context.report({ node, messageId: "headingTextTooLong" });
        }
      }
    };
  }
};
