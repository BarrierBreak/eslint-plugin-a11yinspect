module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for media elements",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      mediaElementAutoplay: "⚠️ [Critical] media element has autoplay (1.4.2 A)",
      mediaRoleWithControls: "⚠️ [Major] audio/video with controls attribute should not have a role attribute (4.1.2 A)",
      audioAriaHidden: "⚠️ [Major] audio element with aria-hidden=true is hidden from assistive technology (1.1.1 A)",
      videoAriaHidden: "⚠️ [Major] video element with aria-hidden=true or tabindex=-1 is inaccessible (1.1.1 A)"
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

          const ariaHiddenAttr = node.attributes.find(
            attr => attr.type === "JSXAttribute" && attr.name.name === "aria-hidden"
          );
          const isAriaHidden = ariaHiddenAttr && ariaHiddenAttr.value &&
            ariaHiddenAttr.value.type === "Literal" &&
            (ariaHiddenAttr.value.value === "true" || ariaHiddenAttr.value.value === true);

          if (node.name.name === "audio" && isAriaHidden) {
            context.report({ node, messageId: "audioAriaHidden" });
          }

          if (node.name.name === "video") {
            if (isAriaHidden) {
              context.report({ node, messageId: "videoAriaHidden" });
            } else {
              const tabindexAttr = node.attributes.find(
                attr => attr.type === "JSXAttribute" && (attr.name.name === "tabIndex" || attr.name.name === "tabindex")
              );
              if (tabindexAttr && tabindexAttr.value && tabindexAttr.value.type === "Literal" &&
                  tabindexAttr.value.value === -1) {
                context.report({ node, messageId: "videoAriaHidden" });
              }
            }
          }
        }
      }
    };
  }
};
