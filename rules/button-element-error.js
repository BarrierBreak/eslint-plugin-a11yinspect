module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for button elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      buttonAccessibleName: "❌ [Critical] Button has no accessible name (4.1.2 A)",
      buttonMissingTypeAttribute: "❌ Button missing type attribute",
      buttonSvgMissingRoleImg: "❌ SVG inside button missing role=\"img\" attribute",
      buttonSvgHiddenFromAT: "❌ SVG inside button with role=\"presentation\"/\"none\" or aria-hidden=true hides content from assistive technology",
      buttonSvgMissingLabel: "❌ SVG inside button with role=\"img\" missing accessible name (aria-label or aria-labelledby) (1.1.1 A)",
      buttonImgMissingAlt: "❌ img inside button missing alt attribute (1.1.1 A)",
      buttonImgEmptyAlt: "❌ img inside button has empty or whitespace-only alt attribute (1.1.1 A)",
      buttonIconHiddenFromAT: "❌ Icon element inside button with role=\"presentation\"/\"none\" or aria-hidden=true hides content from assistive technology",
      buttonIconMissingRole: "❌ Icon element inside button missing role=\"img\" attribute",
      buttonIconMissingLabel: "❌ Icon element inside button with role=\"img\" missing accessible name (aria-label or aria-labelledby)",
      buttonImgSvgIconGenericLabel: "❌ [Minor] Image, SVG or icon inside button has a generic accessible name (1.1.1 A)"
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

    const genericLabels = new Set([
      "image", "graphic", "picture", "photo", "icon", "img", "svg",
      "button", "click", "submit", "spacer"
    ]);

    function getAttr(attrs, name) {
      return attrs.find(attr => attr.type === "JSXAttribute" && attr.name.name === name);
    }

    function isHiddenFromAT(attrs) {
      const roleAttr = getAttr(attrs, "role");
      const ariaHiddenAttr = getAttr(attrs, "aria-hidden");
      const roleValue = roleAttr && roleAttr.value && roleAttr.value.type === "Literal"
        ? roleAttr.value.value : null;
      if (roleValue === "presentation" || roleValue === "none") return true;
      if (ariaHiddenAttr && ariaHiddenAttr.value && ariaHiddenAttr.value.type === "Literal" &&
          (ariaHiddenAttr.value.value === "true" || ariaHiddenAttr.value.value === true)) return true;
      return false;
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
            if (child.type !== "JSXElement") return;

            const childTag = child.openingElement.name.name;
            const childAttrs = child.openingElement.attributes;
            const childRoleAttr = getAttr(childAttrs, "role");
            const childRoleValue = childRoleAttr && childRoleAttr.value && childRoleAttr.value.type === "Literal"
              ? childRoleAttr.value.value : null;

            if (childTag === "svg") {
              if (isHiddenFromAT(childAttrs)) {
                context.report({ node: child.openingElement, messageId: "buttonSvgHiddenFromAT" });
              } else if (childRoleValue !== "img") {
                context.report({ node: child.openingElement, messageId: "buttonSvgMissingRoleImg" });
              } else {
                const svgAriaLabel = getAttr(childAttrs, "aria-label");
                const svgAriaLabelledby = getAttr(childAttrs, "aria-labelledby");
                if ((!svgAriaLabel || !svgAriaLabel.value) && (!svgAriaLabelledby || !svgAriaLabelledby.value)) {
                  context.report({ node: child.openingElement, messageId: "buttonSvgMissingLabel" });
                }
              }
            }

            if (childTag === "img") {
              const altAttr = getAttr(childAttrs, "alt");
              if (!altAttr) {
                context.report({ node: child.openingElement, messageId: "buttonImgMissingAlt" });
              } else if (altAttr.value && altAttr.value.type === "Literal" &&
                         typeof altAttr.value.value === "string" && altAttr.value.value.trim() === "") {
                context.report({ node: child.openingElement, messageId: "buttonImgEmptyAlt" });
              }
            }

            // Generic accessible name check for img/svg/i inside button
            if (childTag === "img" || childTag === "svg" || childTag === "i") {
              const ariaLabelAttr = getAttr(childAttrs, "aria-label");
              if (ariaLabelAttr && ariaLabelAttr.value && ariaLabelAttr.value.type === "Literal") {
                const labelText = ariaLabelAttr.value.value;
                if (typeof labelText === "string" && genericLabels.has(labelText.trim().toLowerCase())) {
                  context.report({ node: ariaLabelAttr, messageId: "buttonImgSvgIconGenericLabel" });
                }
              }
            }

            if (childTag === "i") {
              if (isHiddenFromAT(childAttrs)) {
                context.report({ node: child.openingElement, messageId: "buttonIconHiddenFromAT" });
              } else if (childRoleValue !== "img") {
                context.report({ node: child.openingElement, messageId: "buttonIconMissingRole" });
              } else {
                const iconAriaLabel = getAttr(childAttrs, "aria-label");
                const iconAriaLabelledby = getAttr(childAttrs, "aria-labelledby");
                if ((!iconAriaLabel || !iconAriaLabel.value) && (!iconAriaLabelledby || !iconAriaLabelledby.value)) {
                  context.report({ node: child.openingElement, messageId: "buttonIconMissingLabel" });
                }
              }
            }
          });
        }
      }
    };
  }
};
