import { createRoot } from "react-dom/client";
import App from "../../App";

import useStore from "../../Store/useStore";

import InternalApp from "../../InternalApp/InternalApp";
import variables from "../Variables/CommunityVariables";
import createMathButton from "../CreateMathButton/CreateMathButton";

const threeDotsInRichEditor = async () => {
  let selectorInThreeDots =
    (variables.page.postPage || variables.page.editPage) &&
    variables.communityIndex === 1
      ? ".MessageEditor [id^='rich'] [aria-label='Expand toolbar']"
      : '[aria-label="Expand toolbar"]';

  let threeDotsElelement = document.querySelector(selectorInThreeDots);

  threeDotsElelement?.addEventListener("click", async () => {
    let richDoc = variables.page.forumTopicPage
      ? document.querySelector('[id^="rich_"]')
      : document.querySelector('[id^="rich"]');

    let element =
      richDoc?.querySelector(
        '.mce-toolbar-grp.mce-container.mce-panel.mce-first.mce-last > :first-child > :last-child [aria-label="Insert video"]'
      ) ||
      richDoc?.querySelector(
        '.mce-toolbar-grp.mce-container.mce-panel.mce-first.mce-last > :first-child > :last-child [aria-label="Insert/edit image"]'
      );

    let currTargetElement = createMathButton(false, true);

    let root = createRoot(currTargetElement);

    await root.render(<InternalApp />);

    let createdMathButton = document.getElementById(
      "tiny_mce_math_plugin_internal"
    );

    element.insertAdjacentElement("afterend", createdMathButton);

    let elementInDom = richDoc.querySelector("#tiny_mce_math_plugin_internal");

    elementInDom.classList.add(
      "mce-widget",
      "mce-btn",
      "mce-btn-small",
      "lia-mce-math-plugin"
    );
  });
};

const internalMathPlugin = async () => {
  let richDoc = variables.page.forumTopicPage
    ? document.querySelector('[id^="rich_"]')
    : document.querySelector('[id^="rich"]');

  const toolbarContainer =
    richDoc?.querySelector('[aria-label="Insert video"]') ||
    richDoc?.querySelector('[aria-label="Insert/edit image"]');

  if (toolbarContainer || !variables.prod) {
    let currTargetElement = createMathButton(false, true);

    let root = createRoot(currTargetElement);

    await root.render(<InternalApp />);

    let createdMathButton = document.getElementById(
      "tiny_mce_math_plugin_internal"
    );

    if (!variables.prod) {
      document.body.prepend(createdMathButton);
      return;
    }

    toolbarContainer.insertAdjacentElement("afterend", createdMathButton);

    createdMathButton.classList.add(
      "mce-widget",
      "mce-btn",
      "mce-btn-small",
      "lia-mce-math-plugin"
    );
  }
};

const externalMathPlugin = async () => {
  if (useStore.getState().hasMathPluginRole || !variables.prod) {
    let currTargetElement = createMathButton(true, false);

    let root = createRoot(currTargetElement);

    await root.render(<App />);

    let createdMathButton = document.getElementById(
      "tiny_mce_math_plugin_external"
    );

    createdMathButton.style.display = "inline";

    createdMathButton.style.marginLeft = "10px";

    createdMathButton.style.marginRight = "10px";

    createdMathButton.style.position = variables.prod ? "absolute" : "";

    createdMathButton.style.top = "-70px";

    // dont keep syle property visibility as hidden, it doesnt open popup
    document.body.prepend(createdMathButton);
  }
};

let plugins = { externalMathPlugin, internalMathPlugin, threeDotsInRichEditor };

export default plugins;
