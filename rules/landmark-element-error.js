module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for landmark elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      landmarkMissingAccessibleName: "❌ Landmark missing accessible name"
    },
    schema: []
  },
  create(context) {
    const landmarksWithMultiple = ["navigation", "complementary", "region"];

    return {
      JSXOpeningElement(node) {
        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );

        const role = roleAttr && roleAttr.value && roleAttr.value.type === "Literal"
          ? roleAttr.value.value
          : null;

        if (node.name.name === "nav" || role === "navigation") {
          if (landmarksWithMultiple.includes(role)) {
            const ariaLabel = node.attributes.find(
              attr => attr.type === "JSXAttribute" &&
              (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
            );

            if (!ariaLabel) {
              context.report({ node, messageId: "landmarkMissingAccessibleName" });
            }
          }
        }

        if (role && landmarksWithMultiple.includes(role)) {
          const ariaLabel = node.attributes.find(
            attr => attr.type === "JSXAttribute" &&
            (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
          );

          if (!ariaLabel) {
            context.report({ node, messageId: "landmarkMissingAccessibleName" });
          }
        }
      }
    };
  }
};
