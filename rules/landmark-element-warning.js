module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for landmark elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      landmarkMissingAccessibleName: "⚠️ [Minor] Landmark missing accessible name (1.3.1 A)",
      multipleMainLandmarksFound: "💡 Multiple main landmarks found"
    },
    schema: []
  },
  create(context) {
    const landmarksWithMultiple = ["navigation", "complementary", "region"];
    let mainCount = 0;
    let navFound = false;

    return {
      JSXOpeningElement(node) {
        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );

        const role = roleAttr && roleAttr.value && roleAttr.value.type === "Literal"
          ? roleAttr.value.value
          : null;

        if (node.name.name === "main" || role === "main") {
          mainCount++;
          if (mainCount > 1) {
            context.report({ node, messageId: "multipleMainLandmarksFound" });
          }
        }

        if (node.name.name === "nav" || role === "navigation") {
          navFound = true;
        }

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
