module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for skip links",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      pageHaveSkipLink: "⚠️ Page should have skip link"
    },
    schema: []
  },
  create(context) {
    let hasSkipLink = false;

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "a") return;

        const hrefAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "href"
        );

        if (hrefAttr && hrefAttr.value && hrefAttr.value.type === "Literal") {
          const href = hrefAttr.value.value;
          if (href && href.startsWith("#") && href.length > 1) {
            const parent = node.parent;
            if (parent.type === "JSXElement") {
              const textContent = parent.children
                .map(child => {
                  if (child.type === "JSXText") return child.value || "";
                  if (child.type === "Literal") return String(child.value || "");
                  return "";
                })
                .join("")
                .toLowerCase();

              if (textContent.includes("skip") || textContent.includes("main")) {
                hasSkipLink = true;
              }
            }
          }
        }
      },
      "Program:exit"() {
        if (!hasSkipLink) {
          const program = context.sourceCode.ast;
          context.report({ node: program, messageId: "pageHaveSkipLink" });
        }
      }
    };
  }
};
