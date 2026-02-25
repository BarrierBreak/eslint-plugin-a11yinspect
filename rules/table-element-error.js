module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for table elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      tableMissingCaptionSummary: "❌ Table missing caption or summary",
      tableMissingTh: "❌ Table missing th elements",
      tableMissingHeaders: "❌ Table missing column/row headers (no th, role=columnheader, or role=rowheader)",
      tableEmptyHeader: "❌ Empty table header (th with no content)",
      tableMissingCaption: "❌ Table missing caption element",
      tdMissingTrParent: "❌ td element is not inside a tr element (1.3.1 A)",
      thMissingTrParent: "❌ th element is not inside a tr element (1.3.1 A)",
      trMissingTableParent: "❌ tr element is not inside a table, thead, tbody, or tfoot element (1.3.1 A)",
      tableDeprecatedSummary: "❌ table summary attribute is deprecated — use caption element or aria-label instead"
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

    function hasThElements(children) {
      for (const child of children) {
        if (child.type === "JSXElement") {
          const tagName = child.openingElement.name.name;
          if (tagName === "th") return true;
          if (tagName === "thead" || tagName === "tbody" || tagName === "tr") {
            if (child.children && hasThElements(child.children)) return true;
          }
        }
      }
      return false;
    }

    function hasRoleHeaders(children) {
      for (const child of children) {
        if (child.type === "JSXElement") {
          const roleAttr = child.openingElement.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "role"
          );
          if (roleAttr && roleAttr.value && roleAttr.value.type === "Literal" &&
              (roleAttr.value.value === "columnheader" || roleAttr.value.value === "rowheader")) {
            return true;
          }
          if (child.children && hasRoleHeaders(child.children)) return true;
        }
      }
      return false;
    }

    function findEmptyThElements(children, results) {
      for (const child of children) {
        if (child.type === "JSXElement") {
          const tagName = child.openingElement.name.name;
          if (tagName === "th") {
            const text = child.children
              ? child.children.map(c => getTextContent(c)).join("").trim()
              : "";
            if (!text) {
              results.push(child.openingElement);
            }
          }
          if (child.children) {
            findEmptyThElements(child.children, results);
          }
        }
      }
    }

    return {
      JSXOpeningElement(node) {
        const tagName = node.name.name;

        if (tagName === "td" || tagName === "th") {
          const directParent = node.parent;
          const parentTag = directParent && directParent.type === "JSXElement"
            ? directParent.openingElement.name.name : null;
          if (parentTag !== "tr") {
            context.report({ node, messageId: tagName === "td" ? "tdMissingTrParent" : "thMissingTrParent" });
          }
        }

        if (tagName === "tr") {
          const directParent = node.parent;
          const parentTag = directParent && directParent.type === "JSXElement"
            ? directParent.openingElement.name.name : null;
          if (!["table", "thead", "tbody", "tfoot"].includes(parentTag)) {
            context.report({ node, messageId: "trMissingTableParent" });
          }
        }

        if (node.name.name !== "table") return;

        const ariaLabel = node.attributes.find(
          attr => attr.type === "JSXAttribute" &&
          (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby")
        );

        const summaryAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "summary"
        );

        if (summaryAttr) {
          context.report({ node: summaryAttr, messageId: "tableDeprecatedSummary" });
        }

        const parent = node.parent;
        if (parent.type === "JSXElement") {
          const caption = hasCaption(parent.children);

          if (!caption && !ariaLabel && !summaryAttr) {
            context.report({ node, messageId: "tableMissingCaptionSummary", level: 2 });
          }

          if (!caption) {
            context.report({ node, messageId: "tableMissingCaption" });
          }

          if (!hasThElements(parent.children)) {
            context.report({ node, messageId: "tableMissingTh", level: 2 });
          }

          if (!hasThElements(parent.children) && !hasRoleHeaders(parent.children)) {
            context.report({ node, messageId: "tableMissingHeaders" });
          }

          const emptyHeaders = [];
          findEmptyThElements(parent.children, emptyHeaders);
          emptyHeaders.forEach(emptyTh => {
            context.report({ node: emptyTh, messageId: "tableEmptyHeader" });
          });
        }
      }
    };
  }
};
