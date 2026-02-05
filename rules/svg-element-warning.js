module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for SVG elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      svgShouldHaveRoleImg: "⚠️ SVG should have role img",
      svgDecorativeNeedsAriaHidden: "💡 Decorative SVG should have aria-hidden",
      svgAriaLabelNoRole: "💡 SVG has aria-label but no appropriate role attribute",
      svgRoleImgNoDescription: "⚠️ SVG with role=\"img\" missing accessible description (no aria-label, title child, or aria-labelledby)",
      svgGenericDescription: "⚠️ SVG accessible description uses generic text"
    },
    schema: []
  },
  create(context) {
    const genericNames = new Set([
      "image", "graphic", "picture", "photo", "spacer",
      "thumbnail", "drawing", "painting", "artwork",
      "animation", "jpeg", "png", "gif", "svg", "tiff", "webp",
      "img", "icon"
    ]);

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

        if (hasAriaLabel && !hasValidRole) {
          context.report({ node, messageId: "svgAriaLabelNoRole" });
        }

        if (role === "img" && !hasAriaLabel && !hasAriaLabelledBy && !title) {
          context.report({ node, messageId: "svgRoleImgNoDescription" });
        }

        if (ariaLabelAttr && ariaLabelAttr.value && ariaLabelAttr.value.type === "Literal") {
          const labelText = ariaLabelAttr.value.value;
          if (typeof labelText === "string" && genericNames.has(labelText.trim().toLowerCase())) {
            context.report({ node: ariaLabelAttr, messageId: "svgGenericDescription" });
          }
        }

        if (!roleAttr || (roleAttr.value && roleAttr.value.type === "Literal" &&
            roleAttr.value.value !== "img")) {
          context.report({ node, messageId: "svgShouldHaveRoleImg" });
        }
      }
    };
  }
};
