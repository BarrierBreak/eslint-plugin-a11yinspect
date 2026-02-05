module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for distracting elements (marquee, blink)",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      noMarquee: "❌ Do not use <marquee> - it cannot be paused and violates WCAG 2.2.2",
      noBlink: "❌ Do not use <blink> - it cannot be paused and violates WCAG 2.2.2"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const tagName = node.name.name;

        if (tagName === "marquee") {
          context.report({ node, messageId: "noMarquee" });
        }

        if (tagName === "blink") {
          context.report({ node, messageId: "noBlink" });
        }
      }
    };
  }
};
