const createMathButton = (external = false, internal = false) => {
  let elementId = "tiny_mce_math_plugin_internal";

  if (external) {
    elementId = "tiny_mce_math_plugin_external";
  }

  let mathButton = document.getElementById(elementId);
  if (!mathButton) {
    mathButton = document.createElement("div");
    mathButton.id = elementId;
    mathButton.classList.add(
      "mce-widget",
      "mce-btn",
      "mce-btn-small",
      "lia-mce-math-plugin"
    );
    document.body.append(mathButton);
  }
  return mathButton;
};

export default createMathButton;
