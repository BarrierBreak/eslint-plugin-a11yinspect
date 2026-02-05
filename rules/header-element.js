module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for header elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      headerBannerLandmarkAtPage: "⚠️ header should be banner landmark at page level",
      multipleBannerLandmarksFound: "💡 Multiple banner landmarks found"
    },
    schema: []
  },
  create(context) {
    let headerCount = 0;

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "header") return;

        headerCount++;

        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );

        if (!roleAttr || (roleAttr.value && roleAttr.value.type === "Literal" && 
            roleAttr.value.value === "banner")) {
          if (headerCount > 1) {
            context.report({ node, messageId: "multipleBannerLandmarksFound" });
          }
        }
      }
    };
  }
};