module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for autocomplete attributes",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      inputHaveAutocompleteAttribute: "⚠️ Input should have autocomplete attribute",
      invalidAutocompleteValue: "❌ Invalid autocomplete value"
    },
    schema: []
  },
  create(context) {
    const personalDataTypes = ["email", "tel", "url", "password", "name", "street-address", 
                                "postal-code", "cc-number", "cc-exp", "cc-csc"];
    
    const validAutocompleteValues = [
      "name", "honorific-prefix", "given-name", "additional-name", "family-name",
      "honorific-suffix", "nickname", "email", "username", "new-password",
      "current-password", "organization-title", "organization", "street-address",
      "address-line1", "address-line2", "address-line3", "address-level4",
      "address-level3", "address-level2", "address-level1", "country", "country-name",
      "postal-code", "cc-name", "cc-given-name", "cc-additional-name", "cc-family-name",
      "cc-number", "cc-exp", "cc-exp-month", "cc-exp-year", "cc-csc", "cc-type",
      "transaction-currency", "transaction-amount", "language", "bday", "bday-day",
      "bday-month", "bday-year", "sex", "tel", "tel-country-code", "tel-national",
      "tel-area-code", "tel-local", "tel-extension", "url", "photo"
    ];

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
            } else if (autocompleteAttr.value && autocompleteAttr.value.type === "Literal") {
              const autocomplete = autocompleteAttr.value.value;
              
              if (autocomplete && autocomplete !== "off" && autocomplete !== "on" &&
                  !validAutocompleteValues.includes(autocomplete)) {
                context.report({ node: autocompleteAttr, messageId: "invalidAutocompleteValue" });
              }
            }
          }
        }
      }
    };
  }
};