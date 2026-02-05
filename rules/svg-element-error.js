module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for SVG elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      svgMissingName: "❌ SVG missing accessible name",
      svgMissingRole: "❌ SVG missing role (no role=\"img\", \"graphics-document\", or \"graphics-symbol\")"
    },
    schema: []
  },
  create(context) {
    const validSvgRoles = ["img", "graphics-document", "graphics-symbol"];

    function hasTitle(children) {
      return children.some(child =>
        child.type === "JSXElement" && child.openingElement.name.name === "title"
      );
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "svg") return;

        const ariaLabelAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-label"
        );
        const ariaLabelledByAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-labelledby"
        );
        const ariaHidden = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-hidden"
        );
        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );

        const parent = node.parent;
        const title = parent.type === "JSXElement" ? hasTitle(parent.children) : false;

        const role = roleAttr && roleAttr.value && roleAttr.value.type === "Literal"
          ? roleAttr.value.value : null;

        if (ariaHidden && ariaHidden.value && ariaHidden.value.type === "Literal" &&
            (ariaHidden.value.value === "true" || ariaHidden.value.value === true)) {
          return;
        }

        const hasAriaLabel = ariaLabelAttr && ariaLabelAttr.value;
        const hasAriaLabelledBy = ariaLabelledByAttr && ariaLabelledByAttr.value;
        const hasValidRole = role && validSvgRoles.includes(role);

        if (!hasValidRole) {
          context.report({ node, messageId: "svgMissingRole" });
        }

        if (!hasAriaLabel && !hasAriaLabelledBy && !title) {
          context.report({ node, messageId: "svgMissingName" });
        }
      }
    };
  }
};
