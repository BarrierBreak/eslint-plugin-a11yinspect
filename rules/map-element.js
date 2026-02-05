module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for map elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      mapMissingNameAttribute: "❌ map missing name attribute",
      mapAreaChildren: "❌ map has no area children"
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