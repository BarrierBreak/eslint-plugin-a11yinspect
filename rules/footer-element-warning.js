module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for footer elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      footerContentinfoLandmarkAtPage: "⚠️ footer should be contentinfo landmark at page level",
      multipleContentinfoLandmarksFound: "💡 Multiple contentinfo landmarks found"
    },
    schema: []
  },
  create(context) {
    let footerCount = 0;

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "footer") return;

        footerCount++;

        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );

        if (!roleAttr || (roleAttr.value && roleAttr.value.type === "Literal" &&
            roleAttr.value.value === "contentinfo")) {
          if (footerCount > 1) {
            context.report({ node, messageId: "multipleContentinfoLandmarksFound" });
          }
        }
      }
    };
  }
};
