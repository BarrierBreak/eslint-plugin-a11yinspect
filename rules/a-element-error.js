module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for anchor elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      linkAccessibleName: "❌ [Critical] Link has no accessible name (2.4.4 A)",
      linkTextOnlyUrl: "❌ Link text is only a URL",
      linkMissingHrefAttribute: "❌ Link missing href attribute",
      linkHrefEmpty: "❌ Link href is empty or #"
    },
    schema: []
  },
  create(context) {
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

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "a") return;

        const hrefAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "href"
        );

        if (!hrefAttr) {
          context.report({ node, messageId: "linkMissingHrefAttribute" });
          return;
        }

        if (hrefAttr.value && hrefAttr.value.type === "Literal") {
          const href = hrefAttr.value.value;
          if (!href || href === "#" || href === "") {
            context.report({ node: hrefAttr, messageId: "linkHrefEmpty" });
          }
        }

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        if (ariaLabel && ariaLabel.value && ariaLabel.value.type === "Literal" && ariaLabel.value.value) {
          return;
        }

        const parent = node.parent;
        if (parent.type !== "JSXElement") return;

        const textContent = parent.children.map(child => getTextContent(child)).join("").trim();

        if (!textContent) {
          context.report({ node, messageId: "linkAccessibleName" });
          return;
        }

        if (/^https?:\/\//i.test(textContent)) {
          context.report({ node, messageId: "linkTextOnlyUrl" });
        }
      }
    };
  }
};
