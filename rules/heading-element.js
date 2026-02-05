module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for heading elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      headingEmpty: "❌ Heading is empty",
      headingLevelSkipped: "⚠️ Heading level skipped",
      multipleH1: "⚠️ Multiple h1 elements on page",
      headingOnlyImageNoAlt: "⚠️ Heading contains only image without alt",
      headingHiddenOrPresentation: "💡 Heading has role=presentation/none or aria-hidden=true",
      headingTextTooLong: "⚠️ Heading text exceeds 120 characters or contains only special characters",
      headingNested: "⚠️ Heading contains nested heading element"
    },
    schema: []
  },
  create(context) {
    const headingLevels = [];
    let h1Count = 0;

    function getTextContent(node) {
      if (!node) return "";
      if (node.type === "Literal") return String(node.value || "");
      if (node.type === "JSXText") return node.value || "";
      if (node.type === "JSXExpressionContainer" && node.expression.type === "Literal") {
        return String(node.expression.value || "");
      }
      if (node.type === "JSXElement") {
        return node.children.map(child => getTextContent(child)).join("");
      }
      return "";
    }

    function hasOnlyImageWithoutAlt(children) {
      const nonEmptyChildren = children.filter(child => {
        if (child.type === "JSXText") return child.value.trim() !== "";
        return true;
      });

      if (nonEmptyChildren.length === 1 && nonEmptyChildren[0].type === "JSXElement") {
        const child = nonEmptyChildren[0];
        if (child.openingElement.name.name === "img") {
          const altAttr = child.openingElement.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "alt"
          );
          if (!altAttr || !altAttr.value ||
              (altAttr.value.type === "Literal" && !altAttr.value.value)) {
            return true;
          }
        }
      }
      return false;
    }

    function hasNestedHeading(children) {
      for (const child of children) {
        if (child.type === "JSXElement") {
          const childTag = child.openingElement.name.name;
          if (/^h[1-6]$/.test(childTag)) return true;
          const childRole = child.openingElement.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "role"
          );
          if (childRole && childRole.value && childRole.value.type === "Literal" &&
              childRole.value.value === "heading") {
            return true;
          }
          if (child.children && hasNestedHeading(child.children)) return true;
        }
      }
      return false;
    }

    return {
      JSXOpeningElement(node) {
        const headingMatch = /^h([1-6])$/.exec(node.name.name);
        if (!headingMatch) return;

        const level = parseInt(headingMatch[1], 10);

        if (level === 1) {
          h1Count++;
          if (h1Count > 1) {
            context.report({ node, messageId: "multipleH1" });
          }
        }

        const parent = node.parent;
        if (parent.type !== "JSXElement") return;

        const textContent = parent.children.map(child => getTextContent(child)).join("").trim();

        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );
        const ariaHidden = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "aria-hidden"
        );
        const roleValue = roleAttr && roleAttr.value && roleAttr.value.type === "Literal"
          ? roleAttr.value.value : null;
        const isHidden = roleValue === "presentation" || roleValue === "none" ||
          (ariaHidden && ariaHidden.value && ariaHidden.value.type === "Literal" &&
           (ariaHidden.value.value === "true" || ariaHidden.value.value === true));

        if (isHidden) {
          context.report({ node, messageId: "headingHiddenOrPresentation" });
        }

        if (!textContent) {
          if (hasOnlyImageWithoutAlt(parent.children)) {
            context.report({ node, messageId: "headingOnlyImageNoAlt" });
          } else {
            context.report({ node, messageId: "headingEmpty" });
          }
          return;
        }

        if (headingLevels.length > 0) {
          const lastLevel = headingLevels[headingLevels.length - 1];
          if (level > lastLevel + 1) {
            context.report({ node, messageId: "headingLevelSkipped" });
          }
        }

        headingLevels.push(level);

        if (textContent.length > 120 || /^[^a-zA-Z0-9]+$/.test(textContent)) {
          context.report({ node, messageId: "headingTextTooLong" });
        }

        if (hasNestedHeading(parent.children)) {
          context.report({ node, messageId: "headingNested" });
        }
      }
    };
  }
};
