module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for landmark elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      pageHaveMainLandmark: "⚠️ Page should have main landmark",
      multipleMainLandmarksFound: "💡 Multiple main landmarks found",
      pageHaveNavigationLandmark: "⚠️ Page should have navigation landmark",
      landmarkMissingAccessibleName: "❌ Landmark missing accessible name"
    },
    schema: []
  },
  create(context) {
    let mainCount = 0;
    let navFound = false;
    const landmarksWithMultiple = ["navigation", "complementary", "region"];

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
      },
      "Program:exit"() {
        if (mainCount === 0) {
          const program = context.getSourceCode().ast;
          context.report({ node: program, messageId: "pageHaveMainLandmark" });
        }
      }
    };
  }
};