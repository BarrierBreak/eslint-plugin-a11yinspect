module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for img elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      imgAltFilename: "⚠️ [Major] img alt contains filename (1.1.1 A)",
      imgAltTooLong: "⚠️ [Major] img alt too long (>150 chars) (1.1.1 A)",
      imgDecorative: "💡 [Minor] img marked as decorative (role=presentation/none or aria-hidden=true) - verify if informative or decorative (1.1.1 A)",
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

        if (!altAttr || !altAttr.value) {
          return;
        }

        if (altAttr.value.type === "Literal") {
          const altText = altAttr.value.value;
          if (typeof altText !== "string") return;

          if (altText.trim() === "") {
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
