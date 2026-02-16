module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for media elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      mediaElementAutoplay: "⚠️ media element has autoplay",
      mediaRoleWithControls: "💡 audio/video with controls attribute should not have a role attribute"
    },
    schema: []
  },
  create(context) {
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
