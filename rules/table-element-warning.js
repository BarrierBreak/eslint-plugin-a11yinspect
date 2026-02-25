module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for table elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      tableSummaryCaptionMatch: "💡 [Best Practice] Table summary attribute text matches caption text (should differ) (1.3.1 A)",
      tableRolePresentation: "⚠️ [Minor] table element has role=\"none\" or \"presentation\" — verify this is a layout table and not a data table (1.3.1 A)"
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

    function hasCaption(children) {
      return children.some(child =>
        child.type === "JSXElement" && child.openingElement.name.name === "caption"
      );
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "table") return;

        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );
        if (roleAttr && roleAttr.value && roleAttr.value.type === "Literal" &&
            (roleAttr.value.value === "none" || roleAttr.value.value === "presentation")) {
          context.report({ node: roleAttr, messageId: "tableRolePresentation" });
        }

        const summaryAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "summary"
        );

        const parent = node.parent;
        if (parent.type === "JSXElement") {
          const caption = hasCaption(parent.children);

          if (caption && summaryAttr && summaryAttr.value &&
              summaryAttr.value.type === "Literal" && typeof summaryAttr.value.value === "string") {
            const captionElement = parent.children.find(child =>
              child.type === "JSXElement" && child.openingElement.name.name === "caption"
            );
            if (captionElement) {
              const captionText = captionElement.children
                ? captionElement.children.map(c => getTextContent(c)).join("").trim()
                : "";
              const summaryText = summaryAttr.value.value.trim();
              if (captionText && summaryText && captionText === summaryText) {
                context.report({ node: summaryAttr, messageId: "tableSummaryCaptionMatch" });
              }
            }
          }
        }
      }
    };
  }
};
