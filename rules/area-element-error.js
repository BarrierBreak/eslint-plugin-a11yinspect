module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for area elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      areaMissingAltAttribute: "❌ [Critical] area missing alt attribute (2.4.4 A)",
      areaEmptyAlt: "❌ [Critical] area has empty alt (2.4.4 A)",
      areaMissingHrefAttribute: "❌ [Blocker] area missing href attribute (2.1.1 A)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "area") return;

        const hrefAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "href"
        );

        if (!hrefAttr) {
          context.report({ node, messageId: "areaMissingHrefAttribute" });
        }

        const altAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "alt"
        );

        if (!altAttr) {
          context.report({ node, messageId: "areaMissingAltAttribute" });
          return;
        }

        if (!altAttr.value ||
            (altAttr.value.type === "Literal" && !altAttr.value.value.trim())) {
          context.report({ node: altAttr, messageId: "areaEmptyAlt" });
        }
      }
    };
  }
};
