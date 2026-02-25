module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for menu elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      menuContainMenuitemElements: "⚠️ [Minor] menu should contain menuitem elements (1.3.1 A)",
      menuMissingAccessibleName: "⚠️ [Minor] menu missing accessible name (4.1.2 A)"
    },
    schema: []
  },
  create(context) {
    function hasMenuitems(children) {
      return children.some(child => {
        if (child.type === "JSXElement") {
          const roleAttr = child.openingElement.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "role"
          );

          if (roleAttr && roleAttr.value && roleAttr.value.type === "Literal") {
            const role = roleAttr.value.value;
            return role === "menuitem" || role === "menuitemcheckbox" || role === "menuitemradio";
          }
        }
        return false;
      });
    }

    return {
      JSXOpeningElement(node) {
        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );
        const role = roleAttr && roleAttr.value && roleAttr.value.type === "Literal"
          ? roleAttr.value.value : null;

        if (node.name.name !== "menu" &&
            (!roleAttr || !roleAttr.value || roleAttr.value.type !== "Literal" ||
             roleAttr.value.value !== "menu")) {
          return;
        }

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        if (!ariaLabel) {
          context.report({ node, messageId: "menuMissingAccessibleName" });
        }

        const parent = node.parent;
        if (parent.type === "JSXElement" && parent.children) {
          if (!hasMenuitems(parent.children)) {
            context.report({ node, messageId: "menuContainMenuitemElements" });
          }
        }
      }
    };
  }
};
