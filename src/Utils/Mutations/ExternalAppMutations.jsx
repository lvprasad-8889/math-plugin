import mathUtils from "../MathUtils";

const mutationForVirtualKeyboard = (isModalOpen, setVirtualKeyboardVisible) => {
  const mutationCallback = (mutationsList) => {
    if (isModalOpen) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.classList.contains("ML__keyboard")) {
              setVirtualKeyboardVisible(true);
            }
          });

          mutation.removedNodes.forEach((node) => {
            if (node.classList.contains("ML__keyboard")) {
              setVirtualKeyboardVisible(false);
            }
          });
        }
      }
    } else {
      setVirtualKeyboardVisible(false);
    }
  };

  const observer = new MutationObserver(mutationCallback);
  observer.observe(document.body, { childList: true, subtree: false });
  return observer;
};

const mutationForRerendingInTinyMCE = async () => {
  let innerDoc = mathUtils.getInnerDoc();

  function handleMutation(mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "attributes") {
        innerDoc
          ?.querySelectorAll(".math-equation")
          .forEach(async (element) => {
            mathUtils.removeDraggedMathEquations(innerDoc);
            mathUtils.setAttributeForMathElement(element);
            if (!element.shadowRoot) {
              mathUtils.addShadowRootToTheDom(element, true);
              mathUtils.addEventsForMathElement(element);
            }
          });
      }
    });
  }

  const observer = new MutationObserver(handleMutation);

  const config = {
    childList: true,
    attributes: true,
  };

  if (innerDoc) {
    observer.observe(innerDoc, config);
  }
};

let externalAppMutations = {
  mutationForVirtualKeyboard,
  mutationForRerendingInTinyMCE,
};

export default externalAppMutations;
