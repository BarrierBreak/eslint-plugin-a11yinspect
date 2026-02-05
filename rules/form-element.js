module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for form elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      formMissingAccessibleName: "❌ Form missing accessible name",
      formHaveSubmitButton: "⚠️ Form should have submit button",
      fieldsetMissingLegend: "❌ Fieldset missing legend"
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

    function hasLegend(children) {
      return children.some(child => 
        child.type === "JSXElement" && child.openingElement.name.name === "legend"
      );
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name === "form") {
          const ariaLabel = node.attributes.find(
            attr => attr.type === "JSXAttribute" && 
            (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
          );

          const nameAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "name"
          );

          if (!ariaLabel && !nameAttr) {
            context.report({ node, messageId: "formMissingAccessibleName" });
          }

          const parent = node.parent;
          if (parent.type === "JSXElement" && parent.children) {
            if (!hasSubmitButton(parent.children)) {
              context.report({ node, messageId: "formHaveSubmitButton" });
            }
          }
        }

        if (node.name.name === "fieldset") {
          const parent = node.parent;
          if (parent.type === "JSXElement" && parent.children) {
            if (!hasLegend(parent.children)) {
              context.report({ node, messageId: "fieldsetMissingLegend" });
            }
          }
        }
      }
    };
  }
};