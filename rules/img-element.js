module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for img elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      imgMissingAlt: "❌ img missing alt attribute",
      imgEmptyAlt: "❌ img has empty alt",
      imgAltRedundant: "💡 img alt is redundant (image/picture/photo)",
      imgAltFilename: "⚠️ img alt contains filename",
      imgAltTooLong: "⚠️ img alt too long (>150 chars)",
      imgDecorative: "💡 img marked as decorative (role=presentation/none or aria-hidden=true) - verify if informative or decorative",
      imgMissingAltNoAria: "❌ img missing alt attribute and has no aria-label or aria-labelledby",
      imgAltGeneric: "⚠️ img alt text is generic (image, graphic, picture, photo, spacer, etc.)"
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

    return {
      JSXOpeningElement(node) {
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

        const isDecorative = role === "presentation" || role === "none" ||
          (ariaHidden && ariaHidden.value && ariaHidden.value.type === "Literal" &&
           (ariaHidden.value.value === "true" || ariaHidden.value.value === true));

        if (isDecorative) {
          context.report({ node, messageId: "imgDecorative" });
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
            return;
          }

          if (genericNames.has(altText.trim().toLowerCase())) {
            context.report({ node: altAttr, messageId: "imgAltGeneric" });
            return;
          }

          if (/\.(jpg|jpeg|png|gif|svg|webp|bmp)$/i.test(altText)) {
            context.report({ node: altAttr, messageId: "imgAltFilename" });
            return;
          }

          if (altText.length > 150) {
            context.report({ node: altAttr, messageId: "imgAltTooLong" });
          }
        }
      }
    };
  }
};
