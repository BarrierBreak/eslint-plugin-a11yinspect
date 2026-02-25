module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for input elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      inputMissingAssociatedLabel: "❌ [Major] Input missing associated label (1.3.1 A)",
      inputMissingTypeAttribute: "❌ [Best Practice] Input missing type attribute (1.3.1 A)",
      inputTypeImageMissingAlt: "❌ [Critical] Input[type=image] missing alt attribute (1.1.1 A)",
      inputMissingNameAttribute: "❌ [Best Practice] Input missing name attribute (1.3.1 A)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "input") return;

        const typeAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "type"
        );

        const typeValue = typeAttr && typeAttr.value && typeAttr.value.type === "Literal"
          ? typeAttr.value.value
          : "text";

        if (typeValue === "hidden") return;

        if (!typeAttr) {
          context.report({ node, messageId: "inputMissingTypeAttribute" });
        }

        if (typeValue === "image") {
          const altAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "alt"
          );

          if (!altAttr || !altAttr.value) {
            context.report({ node, messageId: "inputTypeImageMissingAlt" });
          }
        }

        const nameAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "name"
        );

        if (!nameAttr && typeValue !== "submit" && typeValue !== "button" && typeValue !== "reset") {
          context.report({ node, messageId: "inputMissingNameAttribute" });
        }

        const idAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "id"
        );

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        if (!idAttr && !ariaLabel) {
          context.report({ node, messageId: "inputMissingAssociatedLabel" });
        }
      }
    };
  }
};
