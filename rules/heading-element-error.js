module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for heading elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      headingEmpty: "❌ Heading is empty"
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
        if (!headingMatch) return;

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
          return;
        }

        if (!textContent && !hasOnlyImageWithoutAlt(parent.children)) {
          context.report({ node, messageId: "headingEmpty" });
        }
      }
    };
  }
};
