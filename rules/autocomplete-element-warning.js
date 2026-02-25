module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for autocomplete attributes",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      inputHaveAutocompleteAttribute: "⚠️ [Major] Input should have autocomplete attribute (1.3.5 AA)"
    },
    schema: []
  },
  create(context) {
    const personalDataTypes = ["email", "tel", "url", "password", "name", "street-address",
                                "postal-code", "cc-number", "cc-exp", "cc-csc"];

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "input") return;

        const typeAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "type"
        );

        const typeValue = typeAttr && typeAttr.value && typeAttr.value.type === "Literal"
          ? typeAttr.value.value
          : "text";

        if (typeValue === "hidden" || typeValue === "submit" || typeValue === "button" ||
            typeValue === "reset" || typeValue === "checkbox" || typeValue === "radio") {
          return;
        }

        const nameAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "name"
        );

        if (nameAttr && nameAttr.value && nameAttr.value.type === "Literal") {
          const name = nameAttr.value.value;

          if (name && personalDataTypes.some(type => name.toLowerCase().includes(type))) {
            const autocompleteAttr = node.attributes.find(
              attr => attr.type === "JSXAttribute" && attr.name.name === "autoComplete"
            );

            if (!autocompleteAttr) {
              context.report({ node, messageId: "inputHaveAutocompleteAttribute" });
            }
          }
        }
      }
    };
  }
};
