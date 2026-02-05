module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for area elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      areaMissingAltAttribute: "❌ area missing alt attribute",
      areaEmptyAlt: "❌ area has empty alt",
      areaMissingHrefAttribute: "❌ area missing href attribute"
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