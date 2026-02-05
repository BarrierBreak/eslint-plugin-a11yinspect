module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for track elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      trackMissingSrcAttribute: "❌ track missing src attribute",
      trackMissingKindAttribute: "❌ track missing kind attribute",
      trackMissingSrclangSubtitles: "❌ track missing srclang for subtitles"
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "track") return;

        const srcAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "src"
        );

        if (!srcAttr || !srcAttr.value ||
            (srcAttr.value.type === "Literal" && !srcAttr.value.value)) {
          context.report({ node, messageId: "trackMissingSrcAttribute" });
        }

        const kindAttr = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "kind"
        );

        if (!kindAttr) {
          context.report({ node, messageId: "trackMissingKindAttribute" });
        }

        if (kindAttr && kindAttr.value && kindAttr.value.type === "Literal" &&
            kindAttr.value.value === "subtitles") {
          const srclangAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "srcLang"
          );

          if (!srclangAttr) {
            context.report({ node, messageId: "trackMissingSrclangSubtitles" });
          }
        }
      }
    };
  }
};
