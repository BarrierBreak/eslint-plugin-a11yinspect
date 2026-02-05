module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for time elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      timeElementMissingDatetimeAttribute: "❌ time element missing datetime attribute"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "time") return;

        const datetimeAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "dateTime"
        );

        if (!datetimeAttr || !datetimeAttr.value ||
            (datetimeAttr.value.type === "Literal" && !datetimeAttr.value.value)) {
          context.report({ node, messageId: "timeElementMissingDatetimeAttribute" });
        }
      }
    };
  }
};
