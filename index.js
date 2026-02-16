module.exports = {
  rules: {
    "img-element-error": require("./rules/img-element-error"),
    "img-element-warning": require("./rules/img-element-warning"),
    "a-element-error": require("./rules/a-element-error"),
    "a-element-warning": require("./rules/a-element-warning"),
    "button-element-error": require("./rules/button-element-error"),
    "button-element-warning": require("./rules/button-element-warning"),
    "input-element-error": require("./rules/input-element-error"),
    "input-element-warning": require("./rules/input-element-warning"),
    "label-element-error": require("./rules/label-element-error"),
    "label-element-warning": require("./rules/label-element-warning"),
    "heading-element-error": require("./rules/heading-element-error"),
    "heading-element-warning": require("./rules/heading-element-warning"),
    "form-element-error": require("./rules/form-element-error"),
    "form-element-warning": require("./rules/form-element-warning"),
    "select-element-error": require("./rules/select-element-error"),
    "textarea-element-error": require("./rules/textarea-element-error"),
    "textarea-element-warning": require("./rules/textarea-element-warning"),
    "iframe-element-error": require("./rules/iframe-element-error"),
    "iframe-element-warning": require("./rules/iframe-element-warning"),
    "table-element-error": require("./rules/table-element-error"),
    "table-element-warning": require("./rules/table-element-warning"),
    "aria-element-error": require("./rules/aria-element-error"),
    "aria-element-warning": require("./rules/aria-element-warning"),
    "lang-element-error": require("./rules/lang-element-error"),
    "media-element-error": require("./rules/media-element-error"),
    "media-element-warning": require("./rules/media-element-warning"),
    "title-element-error": require("./rules/title-element-error"),
    "title-element-warning": require("./rules/title-element-warning"),
    "list-element-error": require("./rules/list-element-error"),
    "list-element-warning": require("./rules/list-element-warning"),
    "focus-element-error": require("./rules/focus-element-error"),
    "focus-element-warning": require("./rules/focus-element-warning"),
    "landmark-element-error": require("./rules/landmark-element-error"),
    "landmark-element-warning": require("./rules/landmark-element-warning"),
    "meta-element-error": require("./rules/meta-element-error"),
    "meta-element-warning": require("./rules/meta-element-warning"),
    "svg-element-error": require("./rules/svg-element-error"),
    "svg-element-warning": require("./rules/svg-element-warning"),
    "click-handler-warning": require("./rules/click-handler-warning"),
    "autocomplete-element-error": require("./rules/autocomplete-element-error"),
    "autocomplete-element-warning": require("./rules/autocomplete-element-warning"),
    "scope-element-error": require("./rules/scope-element-error"),
    "skip-link-warning": require("./rules/skip-link-warning"),
    "accesskey-element-error": require("./rules/accesskey-element-error"),
    "accesskey-element-warning": require("./rules/accesskey-element-warning"),
    "duplicate-id-error": require("./rules/duplicate-id-error"),
    "dialog-element-error": require("./rules/dialog-element-error"),
    "dialog-element-warning": require("./rules/dialog-element-warning"),
    "required-element-warning": require("./rules/required-element-warning"),
    "live-region-error": require("./rules/live-region-error"),
    "description-element-error": require("./rules/description-element-error"),
    "description-element-warning": require("./rules/description-element-warning"),
    "orientation-element-error": require("./rules/orientation-element-error"),
    "expanded-element-warning": require("./rules/expanded-element-warning"),
    "disabled-element-warning": require("./rules/disabled-element-warning"),
    "checked-element-error": require("./rules/checked-element-error"),
    "checked-element-warning": require("./rules/checked-element-warning"),
    "selected-element-warning": require("./rules/selected-element-warning"),
    "pressed-element-warning": require("./rules/pressed-element-warning"),
    "details-element-error": require("./rules/details-element-error"),
    "abbr-element-error": require("./rules/abbr-element-error"),
    "dl-element-error": require("./rules/dl-element-error"),
    "figure-element-error": require("./rules/figure-element-error"),
    "time-element-error": require("./rules/time-element-error"),
    "meter-element-error": require("./rules/meter-element-error"),
    "progress-element-error": require("./rules/progress-element-error"),
    "output-element-error": require("./rules/output-element-error"),
    "track-element-error": require("./rules/track-element-error"),
    "object-element-error": require("./rules/object-element-error"),
    "embed-element-error": require("./rules/embed-element-error"),
    "area-element-error": require("./rules/area-element-error"),
    "map-element-error": require("./rules/map-element-error"),
    "optgroup-element-error": require("./rules/optgroup-element-error"),
    "blockquote-element-warning": require("./rules/blockquote-element-warning"),
    "ins-del-element-warning": require("./rules/ins-del-element-warning"),
    "address-element-error": require("./rules/address-element-error"),
    "section-element-warning": require("./rules/section-element-warning"),
    "header-element-warning": require("./rules/header-element-warning"),
    "footer-element-warning": require("./rules/footer-element-warning"),
    "ruby-element-error": require("./rules/ruby-element-error"),
    "ruby-element-warning": require("./rules/ruby-element-warning"),
    "menu-element-warning": require("./rules/menu-element-warning"),
    "noscript-element-error": require("./rules/noscript-element-error"),
    "hr-element-warning": require("./rules/hr-element-warning"),
    "canvas-element-error": require("./rules/canvas-element-error"),
    "canvas-element-warning": require("./rules/canvas-element-warning"),
    "slider-element-warning": require("./rules/slider-element-warning"),
    "tab-element-warning": require("./rules/tab-element-warning"),
    "role-props-element-error": require("./rules/role-props-element-error"),
    "role-props-element-warning": require("./rules/role-props-element-warning"),
    "autofocus-element-warning": require("./rules/autofocus-element-warning"),
    "distracting-element-error": require("./rules/distracting-element-error")
  },
  configs: {}
};

// Build all rule names
const allRuleNames = Object.keys(module.exports.rules);

// recommended: -error rules as "error", -warning rules as "warn"
const recommendedRules = {};
allRuleNames.forEach(function (name) {
  var severity = name.endsWith("-warning") ? "warn" : "error";
  recommendedRules["a11yinspect/" + name] = severity;
});

// strict: all rules set to "error"
const strictRules = {};
allRuleNames.forEach(function (name) {
  strictRules["a11yinspect/" + name] = "error";
});

// errors-only: only -error rules enabled (as "error"), -warning rules off
const errorsOnlyRules = {};
allRuleNames.forEach(function (name) {
  if (name.endsWith("-warning")) {
    errorsOnlyRules["a11yinspect/" + name] = "off";
  } else {
    errorsOnlyRules["a11yinspect/" + name] = "error";
  }
});

// warnings-only: only -warning rules enabled (as "warn"), -error rules off
const warningsOnlyRules = {};
allRuleNames.forEach(function (name) {
  if (name.endsWith("-warning")) {
    warningsOnlyRules["a11yinspect/" + name] = "warn";
  } else {
    warningsOnlyRules["a11yinspect/" + name] = "off";
  }
});

module.exports.configs.recommended = {
  plugins: ["a11yinspect"],
  rules: recommendedRules
};

module.exports.configs.strict = {
  plugins: ["a11yinspect"],
  rules: strictRules
};

module.exports.configs["errors-only"] = {
  plugins: ["a11yinspect"],
  rules: errorsOnlyRules
};

module.exports.configs["warnings-only"] = {
  plugins: ["a11yinspect"],
  rules: warningsOnlyRules
};
