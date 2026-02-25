module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for tab, tablist, and tabpanel role elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      tabMissingAriaControls: "💡 [Best Practice] Element with role=\"tab\" missing aria-controls attribute (4.1.2 A)",
      tabpanelMissingAccessibleName: "💡 [Best Practice] Element with role=\"tabpanel\" missing accessible name (no aria-label or aria-labelledby) (4.1.2 A)",
      tablistMissingAccessibleName: "💡 [Best Practice] Element with role=\"tablist\" missing accessible name (no aria-label or aria-labelledby) (4.1.2 A)"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );

        if (!roleAttr || !roleAttr.value || roleAttr.value.type !== "Literal") return;

        const role = roleAttr.value.value;

        if (role === "tab") {
          const ariaControls = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "aria-controls"
          );
          if (!ariaControls || !ariaControls.value) {
            context.report({ node, messageId: "tabMissingAriaControls" });
          }
        }

        if (role === "tabpanel") {
          const ariaLabel = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "aria-label"
          );
          const ariaLabelledBy = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "aria-labelledby"
          );
          if (!ariaLabel && !ariaLabelledBy) {
            context.report({ node, messageId: "tabpanelMissingAccessibleName" });
          }
        }

        if (role === "tablist") {
          const ariaLabel = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "aria-label"
          );
          const ariaLabelledBy = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "aria-labelledby"
          );
          if (!ariaLabel && !ariaLabelledBy) {
            context.report({ node, messageId: "tablistMissingAccessibleName" });
          }
        }
      }
    };
  }
};
