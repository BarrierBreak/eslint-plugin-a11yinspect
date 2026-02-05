module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for definition list elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      dlContainsInvalidChildren: "❌ dl contains invalid children",
      dtDdInsideDl: "❌ dt/dd not inside dl"
    },
    schema: []
  },
  create(context) {
    function hasInvalidChildren(children) {
      return children.some(child => {
        if (child.type === "JSXElement") {
          const tagName = child.openingElement.name.name;
          return tagName !== "dt" && tagName !== "dd" && tagName !== "div";
        }
        if (child.type === "JSXText") {
          return child.value.trim() !== "";
        }
        return false;
      });
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name === "dl") {
          const parent = node.parent;
          if (parent.type === "JSXElement" && parent.children) {
            if (hasInvalidChildren(parent.children)) {
              context.report({ node, messageId: "dlContainsInvalidChildren" });
            }
          }
        }

        if (node.name.name === "dt" || node.name.name === "dd") {
          let current = node.parent;
          let foundDl = false;

          while (current) {
            if (current.type === "JSXElement") {
              const parentTag = current.openingElement.name.name;
              if (parentTag === "dl") {
                foundDl = true;
                break;
              }
            }
            current = current.parent;
          }

          if (!foundDl) {
            context.report({ node, messageId: "dtDdInsideDl" });
          }
        }
      }
    };
  }
};