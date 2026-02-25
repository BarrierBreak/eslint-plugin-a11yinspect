module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for ARIA role required properties",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      roleMissingRequiredProp: "❌ [Major] Role requires aria property that is missing (4.1.2 A)"
    },
    schema: []
  },
  create(context) {
    // Roles and their REQUIRED aria properties (from WAI-ARIA spec)
    const roleRequiredProps = {
      checkbox: ["aria-checked"],
      combobox: ["aria-expanded"],
      heading: ["aria-level"],
      meter: ["aria-valuenow"],
      option: ["aria-selected"],
      radio: ["aria-checked"],
      scrollbar: ["aria-controls", "aria-valuenow"],
      slider: ["aria-valuenow"],
      spinbutton: ["aria-valuenow"],
      switch: ["aria-checked"],
      separator: [] // Only required when focusable: aria-valuenow
    };

    function getAttr(node, name) {
      return node.attributes.find(
        attr => attr.type === "JSXAttribute" && attr.name.name === name
      );
    }

    return {
      JSXOpeningElement(node) {
        const roleAttr = getAttr(node, "role");
        if (!roleAttr || !roleAttr.value || roleAttr.value.type !== "Literal") return;

        const role = roleAttr.value.value;
        if (!role) return;

        // Check required props
        const required = roleRequiredProps[role];
        if (required) {
          for (const prop of required) {
            const propAttr = getAttr(node, prop);
            if (!propAttr) {
              context.report({ node, messageId: "roleMissingRequiredProp" });
              break; // Only report once per element
            }
          }
        }
      }
    };
  }
};
