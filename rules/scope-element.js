module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for scope attributes",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      thMissingScopeAttribute: "❌ th missing scope attribute",
      invalidScopeValue: "❌ Invalid scope value"
    },
    schema: []
  },
  create(context) {
    const validScopes = ["row", "col", "rowgroup", "colgroup"];

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "th") return;

        const scopeAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "scope"
        );

        if (!scopeAttr) {
          context.report({ node, messageId: "thMissingScopeAttribute" });
          return;
        }

        if (scopeAttr.value && scopeAttr.value.type === "Literal") {
          const scope = scopeAttr.value.value;
          if (scope && !validScopes.includes(scope)) {
            context.report({ node: scopeAttr, messageId: "invalidScopeValue" });
          }
        }
      }
    };
  }
};