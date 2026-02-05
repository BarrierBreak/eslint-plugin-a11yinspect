module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for SVG elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      svgMissingName: "❌ SVG missing accessible name",
      svgShouldHaveRoleImg: "⚠️ SVG should have role img",
      svgDecorativeNeedsAriaHidden: "💡 Decorative SVG should have aria-hidden",
      svgMissingRole: "❌ SVG missing role (no role=\"img\", \"graphics-document\", or \"graphics-symbol\")",
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

        if (!hasAriaLabel && !hasAriaLabelledBy && !title) {
          context.report({ node, messageId: "svgMissingName" });
        }

        if (!roleAttr || (roleAttr.value && roleAttr.value.type === "Literal" &&
            roleAttr.value.value !== "img")) {
          context.report({ node, messageId: "svgShouldHaveRoleImg" });
        }
      }
    };
  }
};
