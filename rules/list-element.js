module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for list elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      listInvalidChildren: "⚠️ ul/ol contains non-li children",
      liOrphan: "❌ li element not inside ul/ol/menu",
      listNoItems: "❌ List (ul/ol or role=list) has no li or listitem children",
      listEmptyItem: "❌ List contains empty li elements",
      liNestedInLi: "❌ li element incorrectly nested inside another li",
      listInvalidElement: "⚠️ Non-li element with text content nested directly in ul/ol",
      listRedundantRoleList: "💡 ul/ol element has redundant role=\"list\" (implicit default)",
      listitemRedundantRole: "💡 li element has redundant role=\"listitem\" (implicit default)"
    },
    schema: []
  },
  create(context) {
    function getTextContent(node) {
      if (!node) return "";
      if (node.type === "Literal") return String(node.value || "");
      if (node.type === "JSXText") return node.value || "";
      if (node.type === "JSXExpressionContainer" && node.expression.type === "Literal") {
        return String(node.expression.value || "");
      }
      if (node.type === "JSXElement") {
        return node.children.map(child => getTextContent(child)).join("");
      }
      return "";
    }

    function hasInvalidChildren(children) {
      return children.some(child => {
        if (child.type === "JSXElement") {
          const tagName = child.openingElement.name.name;
          return tagName !== "li";
        }
        if (child.type === "JSXText") {
          return child.value.trim() !== "";
        }
        return false;
      });
    }

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
          const roleAttrList = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "role"
          );
          if (roleAttrList && roleAttrList.value && roleAttrList.value.type === "Literal" &&
              roleAttrList.value.value === "list") {
            context.report({ node: roleAttrList, messageId: "listRedundantRoleList" });
          }

          const parent = node.parent;
          if (parent.type === "JSXElement" && parent.children) {
            if (hasInvalidChildren(parent.children)) {
              context.report({ node, messageId: "listInvalidChildren" });
            }

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

            parent.children.forEach(child => {
              if (child.type === "JSXElement" && child.openingElement.name.name !== "li") {
                const childText = child.children
                  ? child.children.map(c => getTextContent(c)).join("").trim()
                  : "";
                if (childText) {
                  context.report({ node: child.openingElement, messageId: "listInvalidElement" });
                }
              }
            });

            parent.children.forEach(child => {
              if (child.type === "JSXElement" && child.openingElement.name.name === "li") {
                const liRole = child.openingElement.attributes.find(
                  attr => attr.type === "JSXAttribute" && attr.name.name === "role"
                );
                if (liRole && liRole.value && liRole.value.type === "Literal" &&
                    liRole.value.value === "listitem") {
                  context.report({ node: liRole, messageId: "listitemRedundantRole" });
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
