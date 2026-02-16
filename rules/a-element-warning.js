module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for anchor elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      linkTextGenericClickHere: "⚠️ [Critical] Link text is generic (click here, read more, etc) (2.4.4 A)",
      linkTextTooLong: "⚠️ [Best Practice] Link accessible name exceeds 150 characters (2.4.4 A)"
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
          return;
        }

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        if (ariaLabel && ariaLabel.value && ariaLabel.value.type === "Literal" && ariaLabel.value.value) {
          if (typeof ariaLabel.value.value === "string" && ariaLabel.value.value.trim().length > 150) {
            context.report({ node: ariaLabel, messageId: "linkTextTooLong" });
          }
          return;
        }

        const parent = node.parent;
        if (parent.type !== "JSXElement") return;

        const textContent = parent.children.map(child => getTextContent(child)).join("").trim();

        if (!textContent) {
          return;
        }

        if (/^https?:\/\//i.test(textContent)) {
          return;
        }

        if (/^(click here|here|link|read more|more|continue|next|previous|back|download)$/i.test(textContent)) {
          context.report({ node, messageId: "linkTextGenericClickHere" });
        }

        if (textContent.length > 150) {
          context.report({ node, messageId: "linkTextTooLong" });
        }
      }
    };
  }
};
