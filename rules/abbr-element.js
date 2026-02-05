module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for abbr elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      abbrElementMissingTitleAttribute: "❌ abbr element missing title attribute"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "abbr") return;

        const titleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "title"
        );

        if (!titleAttr || !titleAttr.value || 
            (titleAttr.value.type === "Literal" && !titleAttr.value.value.trim())) {
          context.report({ node, messageId: "abbrElementMissingTitleAttribute" });
        }
      }
    };
  }
};