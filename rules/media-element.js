module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility checks for media elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      videoElementMissingCaptions: "❌ video element missing captions",
      audioElementMissingTranscript: "❌ audio element missing transcript",
      videoElementMissingAudioDescription: "❌ video element missing audio description",
      mediaElementAutoplay: "⚠️ media element has autoplay",
      mediaRoleWithControls: "💡 audio/video with controls attribute should not have a role attribute"
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
        if (node.name.name === "video" || node.name.name === "audio") {
          const controlsAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "controls"
          );
          const roleAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "role"
          );
          if (controlsAttr && roleAttr) {
            context.report({ node: roleAttr, messageId: "mediaRoleWithControls" });
          }
        }

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

          const autoplayAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "autoplay"
          );

          if (autoplayAttr) {
            context.report({ node: autoplayAttr, messageId: "mediaElementAutoplay" });
          }
        }

        if (node.name.name === "audio") {
          context.report({ node, messageId: "audioElementMissingTranscript" });

          const autoplayAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "autoplay"
          );

          if (autoplayAttr) {
            context.report({ node: autoplayAttr, messageId: "mediaElementAutoplay" });
          }
        }
      }
    };
  }
};