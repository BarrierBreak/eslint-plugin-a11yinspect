module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for definition list elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      dlContainsInvalidChildren: "❌ dl contains invalid children",
      dtDdInsideDl: "❌ dt/dd not inside dl",
      dtNotFirstChildOfDl: "❌ dt element is not the first child element of dl",
      dlMissingDdElement: "❌ dl element has dt but is missing dd (definition) children",
      dlEmptyTerm: "❌ dl contains empty dt or dd element"
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
            const children = parent.children;

            if (hasInvalidChildren(children)) {
              context.report({ node, messageId: "dlContainsInvalidChildren" });
            }

            const elementChildren = children.filter(c => c.type === "JSXElement");
            if (elementChildren.length > 0) {
              const firstTag = elementChildren[0].openingElement.name.name;
              if (firstTag !== "dt") {
                context.report({ node, messageId: "dtNotFirstChildOfDl" });
              }
            }

            const hasDt = elementChildren.some(c => c.openingElement.name.name === "dt");
            const hasDd = elementChildren.some(c => c.openingElement.name.name === "dd");
            if (hasDt && !hasDd) {
              context.report({ node, messageId: "dlMissingDdElement" });
            }

            elementChildren.forEach(child => {
              const childTag = child.openingElement.name.name;
              if (childTag === "dt" || childTag === "dd") {
                const hasContent = child.children && child.children.some(c => {
                  if (c.type === "JSXText") return c.value.trim() !== "";
                  if (c.type === "JSXElement" || c.type === "JSXExpressionContainer") return true;
                  return false;
                });
                if (!hasContent) {
                  context.report({ node: child.openingElement, messageId: "dlEmptyTerm" });
                }
              }
            });
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
