module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Accessibility warning checks for click handlers",
      category: "Accessibility",
      recommended: true
    },
    messages: {
      onclickWithoutOnkeydownOnkeyup: "⚠️ onClick without onKeyDown/onKeyUp",
      mouseEventWithoutKeyboardEquivalent: "⚠️ Mouse event without keyboard equivalent"
    },
    schema: []
  },
  create(context) {
    const nonInteractiveElements = ["div", "span", "p", "section", "article", "main", "aside"];

    return {
      JSXOpeningElement(node) {
        if (!nonInteractiveElements.includes(node.name.name)) return;

        const onClick = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "onClick"
        );

        const onKeyDown = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "onKeyDown"
        );

        const onKeyUp = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "onKeyUp"
        );

        const onKeyPress = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "onKeyPress"
        );

        if (onClick && !onKeyDown && !onKeyUp && !onKeyPress) {
          context.report({ node: onClick, messageId: "onclickWithoutOnkeydownOnkeyup" });
        }

        const onMouseOver = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "onMouseOver"
        );

        const onMouseOut = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "onMouseOut"
        );

        const onFocus = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "onFocus"
        );

        const onBlur = node.attributes.find(
          attr => attr.type === "JSXAttribute" && attr.name.name === "onBlur"
        );

        if ((onMouseOver && !onFocus) || (onMouseOut && !onBlur)) {
          context.report({ node, messageId: "mouseEventWithoutKeyboardEquivalent" });
        }
      }
    };
  }
};
