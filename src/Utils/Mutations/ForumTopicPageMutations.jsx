import InternalApp from "../../InternalApp/InternalApp";
import createMathButton from "../CreateMathButton/CreateMathButton";
import startCDN from "../StartCDN/startCDN";
import { createRoot } from "react-dom/client";
import variables from "../Variables/CommunityVariables";

import plugins from "../MathPlugin/MathPlugin";
import convertLatexToMath from "../RenderEquations/RenderMathEquations";
import mathUtils from "../MathUtils";

let mutationsAdded = [];

const mutationForPreview = () => {
  const richElement = variables.page.forumTopicPage
    ? document.querySelector('[id^="rich_"]')
    : document.querySelector('[id^="rich"]');

  const element = richElement?.nextElementSibling;

  if (element) {
    const observer = new MutationObserver((mutationsList) => {
      const hasLoadingClass =
        element.querySelector(".lia-feedback-loading") !== null;

      if (!hasLoadingClass) {
        convertLatexToMath();
      }
    });

    observer.observe(element, { childList: true, subtree: false });
  }
};

const startMutationProcess = async (message) => {
  startCDN();

  let richDoc = message.querySelector('[id^="rich_"]');

  let element =
    richDoc?.querySelector(
      '.mce-btn-group > :first-child > [aria-label="Insert video"]'
    ) ||
    richDoc?.querySelector(
      '.mce-btn-group > :first-child > [aria-label="Insert/edit image"]'
    );

  let currTargetElement = createMathButton(false, true);

  let root;
  if (!root && variables.page.forumTopicPage) {
    root = createRoot(currTargetElement);
  }

  await root.render(<InternalApp />);

  let createdMathButton = document.getElementById(
    "tiny_mce_math_plugin_internal"
  );

  element.insertAdjacentElement("afterend", createdMathButton);

  mutationForPreview();
  plugins.threeDotsInRichEditor();
  plugins.externalMathPlugin();
};

const mutationForDynamicMessages = () => {
  variables.community[variables.communityIndex].dynamicMessageSelectors.forEach(
    (selector) => {
      let element = document.querySelector(selector);

      if (element) {
        if (variables.communityIndex <= 0) {
          element = element.parentElement;
        }
        const observer = new MutationObserver(mutatationForReplyButton);
        const forumTopicConfig = {
          attributes: false,
          childList: true,
          subtree: false,
        };
        observer.observe(element, forumTopicConfig);
      }
    }
  );
  variables.communityIndex <= 0 && mutatationForPostReplyButton();
};

const mutationForEditMessageInJmp = (replies) => {
  if (variables.communityIndex === 1) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.target.childNodes.forEach((child) => {
          if (child.id && child.id.startsWith("inlineMessageEditEditor")) {
            setTimeout(() => {
              try {
                startMutationProcess(child);
              } catch (err) {
                startMutationProcess(child);
              }
            }, 500);
          }
        });
      });
    });

    replies.forEach((element) => {
      const parent = element.parentElement;

      if (parent) {
        observer.observe(parent, {
          childList: true,
          attributes: true,
          attributeFilter: ["id"],
        });
      }
    });
  }
};

const mutatationForReplyButton = () => {
  convertLatexToMath();
  if (mutationsAdded.length) {
    mutationsAdded.forEach((element) => element.disconnect());
    mutationsAdded.length = 0;
  }
  const replies = [
    ...document.querySelectorAll(
      `[id^=${variables.community[variables.communityIndex].replies[0]}]`
    ),
    ...document.querySelectorAll(
      `[id^=${variables.community[variables.communityIndex].replies[1]}]`
    ),
  ];

  mutationForEditMessageInJmp(replies);

  const firstTargetNode = document.querySelector(
    `${variables.community[variables.communityIndex].firstNode}`
  );

  let mutationToRepliesList = [firstTargetNode, ...replies];

  mutationToRepliesList.forEach((message) => {
    const observer = new MutationObserver(async (mutationsList, obs) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          if (message.children.length >= 2) {
            startMutationProcess(message);
          }
        }
      }
    });

    const config = { childList: true, subtree: false };

    observer.observe(message, config);
    mutationsAdded.push(observer);
  });
};

const mutatationForPostReplyButton = () => {
  let element = document.getElementById("threadeddetailmessagelist");

  if (element) {
    let parent = element.parentElement;

    if (parent) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            let message;
            mutation.addedNodes.forEach((node) => {
              if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.classList.contains(
                  "lia-inline-message-reply-form-expanded"
                )
              ) {
                message = node;
              }
            });

            Array.from(parent.children).forEach((child) => {
              if (
                child.classList.contains(
                  "lia-inline-message-reply-form-expanded"
                )
              ) {
                message = child;
              }
            });
            if (message) {
              startMutationProcess(message);
            }
          }
        });
      });

      observer.observe(parent, {
        childList: true,
        subtree: false,
      });
    } else {
    }
  } else {
  }
};

let forumTopicMutations = {
  mutationForPreview,
  startMutationProcess,
  mutationForDynamicMessages,
  mutationForEditMessageInJmp,
  mutatationForReplyButton,
  mutatationForPostReplyButton,
};

export default forumTopicMutations;
