(function () {
  "use strict";

  const SDK = window.__HERMES_PLUGIN_SDK__;
  const registry = window.__HERMES_PLUGINS__;

  if (!SDK || !registry) {
    console.warn("[hermes-charcoal-visuals] Hermes dashboard plugin SDK unavailable");
    return;
  }

  const React = SDK.React;
  const useState = SDK.hooks.useState;
  const useEffect = SDK.hooks.useEffect;

  function cleanRawAsset(value) {
    if (!value) return "";
    return String(value).trim().replace(/^[\'\"]|[\'\"]$/g, "");
  }

  function readAsset(name) {
    return cleanRawAsset(
      getComputedStyle(document.documentElement)
        .getPropertyValue(`--theme-asset-${name}-raw`)
    );
  }

  function isCharcoalVisualAsset(value) {
    return Boolean(value && value.startsWith("/dashboard-plugins/hermes-charcoal-visuals/"));
  }

  function useThemeAsset(name) {
    const [value, setValue] = useState(() => readAsset(name));

    useEffect(() => {
      const update = () => setValue(readAsset(name));
      update();

      const observer = new MutationObserver(update);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["style", "class", "data-theme"]
      });

      return () => observer.disconnect();
    }, [name]);

    return value;
  }

  function CharcoalCrest() {
    const crest = useThemeAsset("crest");
    if (!isCharcoalVisualAsset(crest)) return null;

    return React.createElement(
      "div",
      { className: "hcv-crest-wrap", "aria-hidden": "true" },
      React.createElement("img", {
        className: "hcv-crest",
        src: crest,
        alt: "",
        draggable: false
      })
    );
  }

  registry.register("hermes-charcoal-visuals", function () { return null; });
  registry.registerSlot("hermes-charcoal-visuals", "header-left", CharcoalCrest);
})();
