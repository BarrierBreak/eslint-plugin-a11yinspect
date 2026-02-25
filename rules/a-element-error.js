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
      linkHrefEmpty: "❌ Link href is empty or #",
      linkImgMissingAlt: "❌ img inside link missing alt attribute (1.1.1 A)",
      linkSvgMissingAccessibleName: "❌ SVG inside link missing accessible name (aria-label, aria-labelledby, or title child) (1.1.1 A)",
      roleLinkMissingTabindex: "❌ Element with role=\"link\" missing tabindex attribute (2.1.1 A)"
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

    function hasTitle(children) {
      return children.some(child =>
        child.type === "JSXElement" && child.openingElement.name.name === "title"
      );
    }

    return {
      JSXOpeningElement(node) {
        // Non-native link element (role=link) must have tabindex
        const roleAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "role"
        );
        if (roleAttr && roleAttr.value && roleAttr.value.type === "Literal" &&
            roleAttr.value.value === "link" && node.name.name !== "a") {
          const tabindexAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && (attr.name.name === "tabIndex" || attr.name.name === "tabindex")
          );
          if (!tabindexAttr) {
            context.report({ node, messageId: "roleLinkMissingTabindex" });
          }
        }

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

        parent.children.forEach(child => {
          if (child.type !== "JSXElement") return;
          const childTag = child.openingElement.name.name;
          const childAttrs = child.openingElement.attributes;

          if (childTag === "img") {
            const altAttr = childAttrs.find(attr => attr.type === "JSXAttribute" && attr.name.name === "alt");
            if (!altAttr) {
              context.report({ node: child.openingElement, messageId: "linkImgMissingAlt" });
            }
          }

          if (childTag === "svg") {
            const svgAriaHidden = childAttrs.find(attr => attr.type === "JSXAttribute" && attr.name.name === "aria-hidden");
            if (svgAriaHidden && svgAriaHidden.value && svgAriaHidden.value.type === "Literal" &&
                (svgAriaHidden.value.value === "true" || svgAriaHidden.value.value === true)) {
              return;
            }
            const svgAriaLabel = childAttrs.find(attr => attr.type === "JSXAttribute" && attr.name.name === "aria-label");
            const svgAriaLabelledby = childAttrs.find(attr => attr.type === "JSXAttribute" && attr.name.name === "aria-labelledby");
            const svgTitle = child.children && hasTitle(child.children);
            if ((!svgAriaLabel || !svgAriaLabel.value) && (!svgAriaLabelledby || !svgAriaLabelledby.value) && !svgTitle) {
              context.report({ node: child.openingElement, messageId: "linkSvgMissingAccessibleName" });
            }
          }
        });
      }
    };
  }
};
