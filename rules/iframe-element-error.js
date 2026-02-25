module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for iframe elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      iframeMissingTitle: "❌ [Minor] iframe missing title attribute (4.1.2 A)",
      iframeEmptyTitle: "❌ [Minor] iframe has empty title attribute (4.1.2 A)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "iframe") return;

        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );
        const ariaHidden = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-hidden"
        );

        const role = roleAttr && roleAttr.value && roleAttr.value.type === "Literal"
          ? roleAttr.value.value : null;
        const isHidden = role === "presentation" || role === "none" ||
          (ariaHidden && ariaHidden.value && ariaHidden.value.type === "Literal" &&
           (ariaHidden.value.value === "true" || ariaHidden.value.value === true));

        if (isHidden) {
          return;
        }

        const titleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "title"
        );

        if (!titleAttr || !titleAttr.value) {
          context.report({ node, messageId: "iframeMissingTitle" });
        } else if (titleAttr.value.type === "Literal" &&
                   (typeof titleAttr.value.value === "string" && !titleAttr.value.value.trim())) {
          context.report({ node: titleAttr, messageId: "iframeEmptyTitle" });
        }
      }
    };
  }
};
