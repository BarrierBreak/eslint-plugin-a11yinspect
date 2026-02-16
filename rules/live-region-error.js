module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for live regions",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      ariaLiveRegionMissingAria: "❌ aria-live region missing aria-atomic",
      invalidAriaLiveValue: "❌ Invalid aria-live value"
    },
    schema: []
  },
  create(context) {
    const validLiveValues = ["off", "polite", "assertive"];

    return {
      JSXOpeningElement(node) {
        const ariaLive = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-live"
        );

        if (ariaLive && ariaLive.value && ariaLive.value.type === "Literal") {
          const liveValue = ariaLive.value.value;

          if (liveValue && !validLiveValues.includes(liveValue)) {
            context.report({ node: ariaLive, messageId: "invalidAriaLiveValue" });
          }

          if (liveValue && liveValue !== "off") {
            const ariaAtomic = node.attributes.find(
              attr => attr.type === "JSXAttribute" && attr.name.name === "aria-atomic"
            );

            if (!ariaAtomic) {
              context.report({ node, messageId: "ariaLiveRegionMissingAria" });
            }
          }
        }
      }
    };
  }
};
