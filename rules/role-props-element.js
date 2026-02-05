module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for ARIA role required and supported properties",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      roleMissingRequiredProp: "❌ Role requires aria property that is missing",
      roleUnsupportedProp: "⚠️ ARIA property is not supported by this role"
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

    // Roles and their SUPPORTED (allowed) aria properties
    // This is a simplified subset - full spec has more
    const roleSupportedProps = {
      alert: ["aria-atomic", "aria-busy", "aria-controls", "aria-describedby", "aria-details",
        "aria-flowto", "aria-hidden", "aria-label", "aria-labelledby", "aria-live",
        "aria-owns", "aria-relevant", "aria-roledescription"],
      button: ["aria-atomic", "aria-busy", "aria-controls", "aria-describedby", "aria-details",
        "aria-disabled", "aria-expanded", "aria-flowto", "aria-haspopup", "aria-hidden",
        "aria-label", "aria-labelledby", "aria-owns", "aria-pressed", "aria-roledescription"],
      checkbox: ["aria-atomic", "aria-busy", "aria-checked", "aria-controls", "aria-describedby",
        "aria-details", "aria-disabled", "aria-errormessage", "aria-expanded", "aria-flowto",
        "aria-hidden", "aria-invalid", "aria-label", "aria-labelledby", "aria-owns",
        "aria-readonly", "aria-required", "aria-roledescription"],
      combobox: ["aria-activedescendant", "aria-atomic", "aria-autocomplete", "aria-busy",
        "aria-controls", "aria-describedby", "aria-details", "aria-disabled", "aria-errormessage",
        "aria-expanded", "aria-flowto", "aria-haspopup", "aria-hidden", "aria-invalid",
        "aria-label", "aria-labelledby", "aria-owns", "aria-readonly", "aria-required",
        "aria-roledescription"],
      dialog: ["aria-atomic", "aria-busy", "aria-describedby", "aria-details", "aria-flowto",
        "aria-hidden", "aria-label", "aria-labelledby", "aria-modal", "aria-owns",
        "aria-roledescription"],
      grid: ["aria-activedescendant", "aria-atomic", "aria-busy", "aria-colcount",
        "aria-describedby", "aria-details", "aria-disabled", "aria-flowto", "aria-hidden",
        "aria-label", "aria-labelledby", "aria-multiselectable", "aria-owns", "aria-readonly",
        "aria-roledescription", "aria-rowcount"],
      img: ["aria-atomic", "aria-busy", "aria-describedby", "aria-details", "aria-flowto",
        "aria-hidden", "aria-label", "aria-labelledby", "aria-owns", "aria-roledescription"],
      link: ["aria-atomic", "aria-busy", "aria-controls", "aria-describedby", "aria-details",
        "aria-disabled", "aria-expanded", "aria-flowto", "aria-haspopup", "aria-hidden",
        "aria-label", "aria-labelledby", "aria-owns", "aria-roledescription"],
      listbox: ["aria-activedescendant", "aria-atomic", "aria-busy", "aria-describedby",
        "aria-details", "aria-disabled", "aria-errormessage", "aria-expanded", "aria-flowto",
        "aria-hidden", "aria-invalid", "aria-label", "aria-labelledby", "aria-multiselectable",
        "aria-orientation", "aria-owns", "aria-readonly", "aria-required", "aria-roledescription"],
      menu: ["aria-activedescendant", "aria-atomic", "aria-busy", "aria-describedby",
        "aria-details", "aria-disabled", "aria-flowto", "aria-hidden", "aria-label",
        "aria-labelledby", "aria-orientation", "aria-owns", "aria-roledescription"],
      menuitem: ["aria-atomic", "aria-busy", "aria-describedby", "aria-details", "aria-disabled",
        "aria-expanded", "aria-flowto", "aria-haspopup", "aria-hidden", "aria-label",
        "aria-labelledby", "aria-owns", "aria-posinset", "aria-roledescription", "aria-setsize"],
      option: ["aria-atomic", "aria-busy", "aria-checked", "aria-describedby", "aria-details",
        "aria-disabled", "aria-flowto", "aria-hidden", "aria-label", "aria-labelledby",
        "aria-owns", "aria-posinset", "aria-roledescription", "aria-selected", "aria-setsize"],
      progressbar: ["aria-atomic", "aria-busy", "aria-describedby", "aria-details", "aria-flowto",
        "aria-hidden", "aria-label", "aria-labelledby", "aria-owns", "aria-roledescription",
        "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext"],
      radio: ["aria-atomic", "aria-busy", "aria-checked", "aria-describedby", "aria-details",
        "aria-disabled", "aria-flowto", "aria-hidden", "aria-label", "aria-labelledby",
        "aria-owns", "aria-posinset", "aria-roledescription", "aria-setsize"],
      slider: ["aria-atomic", "aria-busy", "aria-describedby", "aria-details", "aria-disabled",
        "aria-errormessage", "aria-flowto", "aria-haspopup", "aria-hidden", "aria-invalid",
        "aria-label", "aria-labelledby", "aria-orientation", "aria-owns", "aria-readonly",
        "aria-roledescription", "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext"],
      spinbutton: ["aria-atomic", "aria-busy", "aria-describedby", "aria-details", "aria-disabled",
        "aria-errormessage", "aria-flowto", "aria-hidden", "aria-invalid", "aria-label",
        "aria-labelledby", "aria-owns", "aria-readonly", "aria-required", "aria-roledescription",
        "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext"],
      switch: ["aria-atomic", "aria-busy", "aria-checked", "aria-controls", "aria-describedby",
        "aria-details", "aria-disabled", "aria-errormessage", "aria-expanded", "aria-flowto",
        "aria-hidden", "aria-invalid", "aria-label", "aria-labelledby", "aria-owns",
        "aria-readonly", "aria-required", "aria-roledescription"],
      tab: ["aria-atomic", "aria-busy", "aria-controls", "aria-describedby", "aria-details",
        "aria-disabled", "aria-expanded", "aria-flowto", "aria-haspopup", "aria-hidden",
        "aria-label", "aria-labelledby", "aria-owns", "aria-posinset", "aria-roledescription",
        "aria-selected", "aria-setsize"],
      tablist: ["aria-activedescendant", "aria-atomic", "aria-busy", "aria-describedby",
        "aria-details", "aria-disabled", "aria-flowto", "aria-hidden", "aria-label",
        "aria-labelledby", "aria-multiselectable", "aria-orientation", "aria-owns",
        "aria-roledescription"],
      tabpanel: ["aria-atomic", "aria-busy", "aria-describedby", "aria-details", "aria-flowto",
        "aria-hidden", "aria-label", "aria-labelledby", "aria-owns", "aria-roledescription"],
      textbox: ["aria-activedescendant", "aria-atomic", "aria-autocomplete", "aria-busy",
        "aria-describedby", "aria-details", "aria-disabled", "aria-errormessage", "aria-flowto",
        "aria-haspopup", "aria-hidden", "aria-invalid", "aria-label", "aria-labelledby",
        "aria-multiline", "aria-owns", "aria-placeholder", "aria-readonly", "aria-required",
        "aria-roledescription"],
      tree: ["aria-activedescendant", "aria-atomic", "aria-busy", "aria-describedby",
        "aria-details", "aria-disabled", "aria-errormessage", "aria-flowto", "aria-hidden",
        "aria-invalid", "aria-label", "aria-labelledby", "aria-multiselectable", "aria-orientation",
        "aria-owns", "aria-required", "aria-roledescription"],
      treeitem: ["aria-atomic", "aria-busy", "aria-checked", "aria-describedby", "aria-details",
        "aria-disabled", "aria-expanded", "aria-flowto", "aria-haspopup", "aria-hidden",
        "aria-label", "aria-labelledby", "aria-level", "aria-owns", "aria-posinset",
        "aria-roledescription", "aria-selected", "aria-setsize"]
    };

    // Global aria props allowed on any role
    const globalAriaProps = new Set([
      "aria-atomic", "aria-busy", "aria-controls", "aria-describedby", "aria-details",
      "aria-disabled", "aria-dropeffect", "aria-errormessage", "aria-flowto", "aria-grabbed",
      "aria-haspopup", "aria-hidden", "aria-invalid", "aria-keyshortcuts", "aria-label",
      "aria-labelledby", "aria-live", "aria-owns", "aria-relevant", "aria-roledescription"
    ]);

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

        // Check supported props (only for roles we have data for)
        const supported = roleSupportedProps[role];
        if (supported) {
          const supportedSet = new Set([...supported, ...globalAriaProps]);

          for (const attr of node.attributes) {
            if (attr.type !== "JSXAttribute" || !attr.name || !attr.name.name) continue;
            const name = attr.name.name;

            if (name.startsWith("aria-") && !supportedSet.has(name)) {
              context.report({ node: attr, messageId: "roleUnsupportedProp" });
            }
          }
        }
      }
    };
  }
};
