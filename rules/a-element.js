module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for anchor elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      linkAccessibleName: "❌ Link has no accessible name",
      linkTextOnlyUrl: "❌ Link text is only a URL",
      linkTextGenericClickHere: "⚠️ Link text is generic (click here, read more, etc)",
      linkMissingHrefAttribute: "❌ Link missing href attribute",
      linkHrefEmpty: "❌ Link href is empty or #",
      linkTextTooLong: "⚠️ Link accessible name exceeds 150 characters"
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
          if (typeof ariaLabel.value.value === "string" && ariaLabel.value.value.trim().length > 150) {
            context.report({ node: ariaLabel, messageId: "linkTextTooLong" });
          }
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