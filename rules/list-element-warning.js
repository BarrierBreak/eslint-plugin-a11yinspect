module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for list elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      listInvalidChildren: "⚠️ ul/ol contains non-li children",
      listInvalidElement: "⚠️ Non-li element with text content nested directly in ul/ol",
      listRedundantRoleList: "💡 ul/ol element has redundant role=\"list\" (implicit default)",
      listitemRedundantRole: "💡 li element has redundant role=\"listitem\" (implicit default)",
      listAriaHidden: "⚠️ List element or list item with aria-hidden=true is hidden from assistive technology"
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

    return {
      JSXOpeningElement(node) {
        if (node.name.name === "ul" || node.name.name === "ol" || node.name.name === "li") {
          const ariaHiddenAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "aria-hidden"
          );
          if (ariaHiddenAttr && ariaHiddenAttr.value && ariaHiddenAttr.value.type === "Literal" &&
              (ariaHiddenAttr.value.value === "true" || ariaHiddenAttr.value.value === true)) {
            context.report({ node, messageId: "listAriaHidden" });
          }
        }

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
      }
    };
  }
};
