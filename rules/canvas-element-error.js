module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for canvas elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      canvasMissingRoleImg: "❌ Canvas element missing role=\"img\" attribute"
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
          return;
        }

        if (role === "img") {
          return;
        }

        if (!textContent) {
          context.report({ node, messageId: "canvasMissingRoleImg" });
        }
      }
    };
  }
};
