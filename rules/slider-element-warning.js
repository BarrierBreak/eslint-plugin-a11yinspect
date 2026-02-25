module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for slider, scrollbar, spinbutton, progressbar role elements and range inputs",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      sliderMissingName: "⚠️ [Critical] Element with role=\"slider\" missing accessible name (no aria-label or aria-labelledby) (4.1.2 A)",
      sliderEmptyAriaLabel: "⚠️ [Critical] Element with role=\"slider\" has empty aria-label (4.1.2 A)",
      sliderMissingTabindex: "⚠️ [Blocker] Element with role=\"slider\" missing tabindex=\"0\" for keyboard access (2.1.1 A)",
      sliderHasName: "⚠️ [Major] Element with role=\"slider\" has accessible name (2.4.6 AA)",
      sliderMissingValuemin: "💡 [Best Practice] Element with role=\"slider\" missing aria-valuemin attribute (4.1.2 A)",
      sliderEmptyValuemin: "💡 [Best Practice] Element with role=\"slider\" has empty aria-valuemin attribute (4.1.2 A)",
      sliderMissingValuemax: "💡 [Best Practice] Element with role=\"slider\" missing aria-valuemax attribute (4.1.2 A)",
      sliderEmptyValuemax: "💡 [Best Practice] Element with role=\"slider\" has empty aria-valuemax attribute (4.1.2 A)",
      scrollbarMissingValuemin: "💡 [Best Practice] Element with role=\"scrollbar\" missing aria-valuemin attribute (4.1.2 A)",
      scrollbarEmptyValuemin: "💡 [Best Practice] Element with role=\"scrollbar\" has empty aria-valuemin attribute (4.1.2 A)",
      scrollbarMissingValuemax: "💡 [Best Practice] Element with role=\"scrollbar\" missing aria-valuemax attribute (4.1.2 A)",
      scrollbarEmptyValuemax: "💡 [Best Practice] Element with role=\"scrollbar\" has empty aria-valuemax attribute (4.1.2 A)",
      spinbuttonMissingValuemin: "💡 [Best Practice] Element with role=\"spinbutton\" missing aria-valuemin attribute (4.1.2 A)",
      spinbuttonEmptyValuemin: "💡 [Best Practice] Element with role=\"spinbutton\" has empty aria-valuemin attribute (4.1.2 A)",
      spinbuttonMissingValuemax: "💡 [Best Practice] Element with role=\"spinbutton\" missing aria-valuemax attribute (4.1.2 A)",
      spinbuttonEmptyValuemax: "💡 [Best Practice] Element with role=\"spinbutton\" has empty aria-valuemax attribute (4.1.2 A)",
      progressbarMissingValuemin: "💡 [Best Practice] Element with role=\"progressbar\" missing aria-valuemin attribute (4.1.2 A)",
      progressbarEmptyValuemin: "💡 [Best Practice] Element with role=\"progressbar\" has empty aria-valuemin attribute (4.1.2 A)",
      progressbarMissingValuemax: "💡 [Best Practice] Element with role=\"progressbar\" missing aria-valuemax attribute (4.1.2 A)",
      progressbarEmptyValuemax: "💡 [Best Practice] Element with role=\"progressbar\" has empty aria-valuemax attribute (4.1.2 A)",
      rangeMissingMin: "💡 [Best Practice] Input type=\"range\" missing min attribute (4.1.2 A)",
      rangeMissingMax: "💡 [Best Practice] Input type=\"range\" missing max attribute (4.1.2 A)"
    },
    schema: []
  },
  create(context) {
    const rangeRoles = ["slider", "scrollbar", "spinbutton", "progressbar"];

    const prefixMap = {
      slider: "slider",
      scrollbar: "scrollbar",
      spinbutton: "spinbutton",
      progressbar: "progressbar"
    };

    function getAttr(node, name) {
      return node.attributes.find(
        attr => attr.type === "JSXAttribute" && attr.name.name === name
      );
    }

    function getAttrValue(attr) {
      if (!attr || !attr.value) return undefined;
      if (attr.value.type === "Literal") return attr.value.value;
      if (attr.value.type === "JSXExpressionContainer" &&
          attr.value.expression.type === "Literal") {
        return attr.value.expression.value;
      }
      return undefined;
    }

    function checkValueminValuemax(node, role) {
      const prefix = prefixMap[role];

      const valuemin = getAttr(node, "aria-valuemin");
      if (!valuemin || !valuemin.value) {
        context.report({ node, messageId: prefix + "MissingValuemin" });
      } else {
        const val = getAttrValue(valuemin);
        if (typeof val === "string" && val.trim() === "") {
          context.report({ node: valuemin, messageId: prefix + "EmptyValuemin" });
        }
      }

      const valuemax = getAttr(node, "aria-valuemax");
      if (!valuemax || !valuemax.value) {
        context.report({ node, messageId: prefix + "MissingValuemax" });
      } else {
        const val = getAttrValue(valuemax);
        if (typeof val === "string" && val.trim() === "") {
          context.report({ node: valuemax, messageId: prefix + "EmptyValuemax" });
        }
      }
    }

    return {
      JSXOpeningElement(node) {
        const roleAttr = getAttr(node, "role");
        const roleValue = roleAttr && roleAttr.value && roleAttr.value.type === "Literal"
          ? roleAttr.value.value : null;

        // Check input[type="range"] min/max
        const tagName = node.name.name;
        const typeAttr = getAttr(node, "type");
        const isInputRange = tagName === "input" && typeAttr &&
          typeAttr.value && typeAttr.value.type === "Literal" &&
          typeAttr.value.value === "range";

        if (isInputRange) {
          const minAttr = getAttr(node, "min");
          if (!minAttr || !minAttr.value) {
            context.report({ node, messageId: "rangeMissingMin" });
          }
          const maxAttr = getAttr(node, "max");
          if (!maxAttr || !maxAttr.value) {
            context.report({ node, messageId: "rangeMissingMax" });
          }
        }

        // Only process range roles from here
        if (!roleValue || !rangeRoles.includes(roleValue)) return;

        // Skip native <progress> for progressbar role (handled by progress-element rule)
        if (roleValue === "progressbar" && tagName === "progress") return;

        // Slider-specific checks: accessible name and tabindex
        if (roleValue === "slider") {
          const ariaLabel = getAttr(node, "aria-label");
          const ariaLabelledBy = getAttr(node, "aria-labelledby");

          if (ariaLabel) {
            const val = getAttrValue(ariaLabel);
            if (typeof val === "string" && val.trim() === "") {
              context.report({ node: ariaLabel, messageId: "sliderEmptyAriaLabel" });
            } else if (ariaLabel.value) {
              context.report({ node, messageId: "sliderHasName" });
            } else {
              context.report({ node, messageId: "sliderMissingName" });
            }
          } else if (ariaLabelledBy && ariaLabelledBy.value) {
            context.report({ node, messageId: "sliderHasName" });
          } else {
            context.report({ node, messageId: "sliderMissingName" });
          }

          if (!isInputRange) {
            const tabIndexAttr = getAttr(node, "tabIndex") || getAttr(node, "tabindex");
            const tabVal = tabIndexAttr ? getAttrValue(tabIndexAttr) : undefined;
            const hasValidTabIndex = tabVal === 0 || tabVal === "0";

            if (!hasValidTabIndex) {
              context.report({ node, messageId: "sliderMissingTabindex" });
            }
          }
        }

        // Value range checks for all range roles
        checkValueminValuemax(node, roleValue);
      }
    };
  }
};
