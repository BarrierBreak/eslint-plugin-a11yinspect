module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for img elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      imgMissingAlt: "❌ [Critical] img missing alt attribute (1.1.1 A)",
      imgEmptyAlt: "❌ [Critical] img has empty alt (1.1.1 A)",
      imgMissingAltNoAria: "❌ [Critical] img missing alt attribute and has no aria-label or aria-labelledby (1.1.1 A)",
      imgRoleImgAriaHidden: "❌ img with role=\"img\" has aria-hidden=true — use role=\"presentation\" or role=\"none\" instead",
      iconMissingAccessibleName: "❌ Icon element (<i>) with role=\"img\" missing accessible name (aria-label or aria-labelledby) (1.1.1 A)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        // Icon element: only check accessible name when role=img is present (iconMissingRoleImg warning is in img-element-warning.js)
        if (node.name.name === "i") {
          const ariaHidden = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "aria-hidden"
          );
          if (ariaHidden && ariaHidden.value && ariaHidden.value.type === "Literal" &&
              (ariaHidden.value.value === "true" || ariaHidden.value.value === true)) {
            return;
          }
          const roleAttrI = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "role"
          );
          const roleI = roleAttrI && roleAttrI.value && roleAttrI.value.type === "Literal"
            ? roleAttrI.value.value : null;
          if (roleI === "img") {
            const ariaLabel = node.attributes.find(
              attr => attr.type === "JSXAttribute" && attr.name.name === "aria-label"
            );
            const ariaLabelledBy = node.attributes.find(
              attr => attr.type === "JSXAttribute" && attr.name.name === "aria-labelledby"
            );
            if ((!ariaLabel || !ariaLabel.value) && (!ariaLabelledBy || !ariaLabelledBy.value)) {
              context.report({ node, messageId: "iconMissingAccessibleName" });
            }
          }
          return;
        }

        if (node.name.name !== "img") return;

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

        if (role === "img" && ariaHidden && ariaHidden.value && ariaHidden.value.type === "Literal" &&
            (ariaHidden.value.value === "true" || ariaHidden.value.value === true)) {
          context.report({ node, messageId: "imgRoleImgAriaHidden" });
          return;
        }

        const isDecorative = role === "presentation" || role === "none" ||
          (ariaHidden && ariaHidden.value && ariaHidden.value.type === "Literal" &&
           (ariaHidden.value.value === "true" || ariaHidden.value.value === true));

        if (isDecorative) {
          return;
        }

        const altAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "alt"
        );

        if (!altAttr) {
          const hasAriaLabel = ariaLabel && ariaLabel.value;
          const hasAriaLabelledBy = ariaLabelledBy && ariaLabelledBy.value;

          if (!hasAriaLabel && !hasAriaLabelledBy) {
            context.report({ node, messageId: "imgMissingAltNoAria" });
          } else {
            context.report({ node, messageId: "imgMissingAlt" });
          }
          return;
        }

        if (!altAttr.value) {
          context.report({ node: altAttr, messageId: "imgEmptyAlt" });
          return;
        }

        if (altAttr.value.type === "Literal") {
          const altText = altAttr.value.value;
          if (typeof altText !== "string") return;

          if (altText.trim() === "") {
            context.report({ node: altAttr, messageId: "imgEmptyAlt" });
          }
        }
      }
    };
  }
};
