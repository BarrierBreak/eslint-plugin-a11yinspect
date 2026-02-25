module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for live regions",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      ariaLiveRegionMissingAria: "❌ [Major] aria-live region missing aria-atomic (4.1.2 A)",
      invalidAriaLiveValue: "❌ [Major] Invalid aria-live value (4.1.2 A)"
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
