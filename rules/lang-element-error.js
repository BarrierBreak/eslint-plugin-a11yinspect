module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for language attributes",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      htmlElementMissingLangAttribute: "❌ [Major] html element missing lang attribute (3.1.1 A)",
      invalidLangAttributeValue: "❌ [Major] Invalid lang attribute value (3.1.1 A)",
      emptyLangAttribute: "❌ [Major] Empty lang attribute (3.1.1 A)"
    },
    schema: []
  },
  create(context) {
    const validLangCodes = [
      "en", "es", "fr", "de", "it", "pt", "ru", "ja", "ko", "zh", "ar", "hi",
      "en-US", "en-GB", "es-ES", "es-MX", "fr-FR", "de-DE", "pt-BR", "pt-PT",
      "zh-CN", "zh-TW", "en-CA", "en-AU", "ja-JP", "ko-KR"
    ];

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "html") return;

        const langAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "lang"
        );

        if (!langAttr) {
          context.report({ node, messageId: "htmlElementMissingLangAttribute" });
          return;
        }

        if (!langAttr.value ||
            (langAttr.value.type === "Literal" && !langAttr.value.value)) {
          context.report({ node: langAttr, messageId: "emptyLangAttribute" });
          return;
        }

        if (langAttr.value.type === "Literal") {
          const lang = langAttr.value.value;
          if (lang && !validLangCodes.includes(lang) && !/^[a-z]{2,3}(-[A-Z]{2})?$/.test(lang)) {
            context.report({ node: langAttr, messageId: "invalidLangAttributeValue" });
          }
        }
      }
    };
  }
};
