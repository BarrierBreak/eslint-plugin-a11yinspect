module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for form elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      formHaveSubmitButton: "⚠️ Form should have submit button"
    },
    schema: []
  },
  create(context) {
    function hasSubmitButton(children) {
      for (const child of children) {
        if (child.type === "JSXElement") {
          const tagName = child.openingElement.name.name;

          if (tagName === "button") {
            const typeAttr = child.openingElement.attributes.find(
              attr => attr.type === "JSXAttribute" && attr.name.name === "type"
            );
            const typeValue = typeAttr && typeAttr.value && typeAttr.value.type === "Literal"
              ? typeAttr.value.value
              : "submit";

            if (typeValue === "submit") return true;
          }

          if (tagName === "input") {
            const typeAttr = child.openingElement.attributes.find(
              attr => attr.type === "JSXAttribute" && attr.name.name === "type"
            );
            const typeValue = typeAttr && typeAttr.value && typeAttr.value.type === "Literal"
              ? typeAttr.value.value
              : "";

            if (typeValue === "submit") return true;
          }

          if (child.children && hasSubmitButton(child.children)) {
            return true;
          }
        }
      }
      return false;
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name === "form") {
          const parent = node.parent;
          if (parent.type === "JSXElement" && parent.children) {
            if (!hasSubmitButton(parent.children)) {
              context.report({ node, messageId: "formHaveSubmitButton" });
            }
          }
        }
      }
    };
  }
};
