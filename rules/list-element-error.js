module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for list elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      liOrphan: "❌ [Major] li element not inside ul/ol/menu (1.3.1 A)",
      listNoItems: "❌ [Major] List (ul/ol or role=list) has no li or listitem children (1.3.1 A)",
      listEmptyItem: "❌ [Minor] List contains empty li elements (1.3.1 A)",
      liNestedInLi: "❌ [Major] li element incorrectly nested inside another li (1.3.1 A)"
    },
    schema: []
  },
  create(context) {
    function hasLiChildren(children) {
      return children.some(child => {
        if (child.type === "JSXElement") {
          const tagName = child.openingElement.name.name;
          if (tagName === "li") return true;
          const roleAttr = child.openingElement.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "role"
          );
          if (roleAttr && roleAttr.value && roleAttr.value.type === "Literal" &&
              roleAttr.value.value === "listitem") {
            return true;
          }
        }
        return false;
      });
    }

    function isEmptyLi(child) {
      if (!child.children || child.children.length === 0) return true;
      const hasContent = child.children.some(c => {
        if (c.type === "JSXText") return c.value.trim() !== "";
        if (c.type === "JSXElement") return true;
        if (c.type === "JSXExpressionContainer") return true;
        return false;
      });
      return !hasContent;
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name === "ul" || node.name.name === "ol") {
          const parent = node.parent;
          if (parent.type === "JSXElement" && parent.children) {
            if (!hasLiChildren(parent.children)) {
              context.report({ node, messageId: "listNoItems" });
            }

            parent.children.forEach(child => {
              if (child.type === "JSXElement" && child.openingElement.name.name === "li") {
                if (isEmptyLi(child)) {
                  context.report({ node: child.openingElement, messageId: "listEmptyItem" });
                }
              }
            });
          }
        }

        if (node.name.name === "li") {
          let current = node.parent;
          let foundValidParent = false;

          while (current) {
            if (current.type === "JSXElement") {
              const parentTag = current.openingElement.name.name;
              if (parentTag === "ul" || parentTag === "ol" || parentTag === "menu") {
                foundValidParent = true;
                break;
              }
            }
            current = current.parent;
          }

          if (!foundValidParent) {
            context.report({ node, messageId: "liOrphan" });
          }

          const directParent = node.parent;
          if (directParent && directParent.type === "JSXElement") {
            const parentTag = directParent.openingElement.name.name;
            if (parentTag === "li") {
              context.report({ node, messageId: "liNestedInLi" });
            }
          }
        }

        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );
        if (roleAttr && roleAttr.value && roleAttr.value.type === "Literal" &&
            roleAttr.value.value === "list") {
          const parent = node.parent;
          if (parent.type === "JSXElement" && parent.children) {
            const hasListitemChildren = parent.children.some(child => {
              if (child.type !== "JSXElement") return false;
              const childTag = child.openingElement.name.name;
              if (childTag === "li") return true;
              const childRole = child.openingElement.attributes.find(
                attr => attr.type === "JSXAttribute" && attr.name.name === "role"
              );
              return childRole && childRole.value && childRole.value.type === "Literal" &&
                childRole.value.value === "listitem";
            });
            if (!hasListitemChildren) {
              context.report({ node, messageId: "listNoItems" });
            }
          }
        }
      }
    };
  }
};
