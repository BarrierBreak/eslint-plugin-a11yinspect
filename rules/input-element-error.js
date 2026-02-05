module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for input elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      inputMissingAssociatedLabel: "❌ Input missing associated label",
      inputMissingTypeAttribute: "❌ Input missing type attribute",
      inputTypeImageMissingAlt: "❌ Input[type=image] missing alt attribute",
      inputMissingNameAttribute: "❌ Input missing name attribute"
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
