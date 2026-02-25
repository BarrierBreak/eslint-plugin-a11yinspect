module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility error checks for media elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      videoElementMissingCaptions: "❌ [Critical] video element missing captions (1.2.2 A)",
      audioElementMissingTranscript: "❌ [Major] audio element missing transcript (1.2.1 A)",
      videoElementMissingAudioDescription: "❌ [Major] video element missing audio description (1.2.5 AA)"
    },
    schema: []
  },
  create(context) {
    function hasTrack(children, kind) {
      return children.some(child => {
        if (child.type === "JSXElement" && child.openingElement.name.name === "track") {
          const kindAttr = child.openingElement.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "kind"
          );
          if (!kind) return true;
          return kindAttr && kindAttr.value &&
                 kindAttr.value.type === "Literal" &&
                 kindAttr.value.value === kind;
        }
        return false;
      });
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name === "video") {
          const parent = node.parent;

          if (parent.type === "JSXElement") {
            if (!hasTrack(parent.children, "captions")) {
              context.report({ node, messageId: "videoElementMissingCaptions" });
            }
            if (!hasTrack(parent.children, "descriptions")) {
              context.report({ node, messageId: "videoElementMissingAudioDescription" });
            }
          }
        }

        if (node.name.name === "audio") {
          context.report({ node, messageId: "audioElementMissingTranscript" });
        }
      }
    };
  }
};
