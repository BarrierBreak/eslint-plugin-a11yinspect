module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for section elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      sectionHaveHeading: "⚠️ section should have heading",
      sectionHaveAccessibleName: "⚠️ section should have accessible name"
    },
    schema: []
  },
  create(context) {
    function hasHeading(children) {
      return children.some(child => {
        if (child.type === "JSXElement") {
          const tagName = child.openingElement.name.name;
          if (/^h[1-6]$/.test(tagName)) return true;
          
          const roleAttr = child.openingElement.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "role"
          );
          
          if (roleAttr && roleAttr.value && roleAttr.value.type === "Literal" &&
              roleAttr.value.value === "heading") {
            return true;
          }
        }
        return false;
      });
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "section") return;

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" && 
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        if (!ariaLabel) {
          context.report({ node, messageId: "sectionHaveAccessibleName" });
        }

        const parent = node.parent;
        if (parent.type === "JSXElement" && parent.children) {
          if (!hasHeading(parent.children)) {
            context.report({ node, messageId: "sectionHaveHeading" });
          }
        }
      }
    };
  }
};