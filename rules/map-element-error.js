module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for map elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      mapMissingNameAttribute: "❌ map missing name attribute",
      mapAreaChildren: "❌ map has no area children",
      mapEmptyNameAttribute: "❌ map name attribute is empty"
    },
    schema: []
  },
  create(context) {
    function hasAreaChildren(children) {
      return children.some(child =>
        child.type === "JSXElement" && child.openingElement.name.name === "area"
      );
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "map") return;

        const nameAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "name"
        );

        if (!nameAttr) {
          context.report({ node, messageId: "mapMissingNameAttribute" });
        } else if (nameAttr.value && nameAttr.value.type === "Literal" &&
                   typeof nameAttr.value.value === "string" && nameAttr.value.value.trim() === "") {
          context.report({ node: nameAttr, messageId: "mapEmptyNameAttribute" });
        }

        const parent = node.parent;
        if (parent.type === "JSXElement" && parent.children) {
          if (!hasAreaChildren(parent.children)) {
            context.report({ node, messageId: "mapAreaChildren" });
          }
        }
      }
    };
  }
};
