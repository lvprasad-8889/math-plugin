import convertLatexToMath from "../RenderEquations/RenderMathEquations";
import variables from "../Variables/CommunityVariables";

let countOfMathEquations = 0;

function handleMutation(mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === "attributes" || mutation.type === "childList") {
      console.log("Hello sir, I am here...");
      convertLatexToMath();
    }
  }
}

const mutationForLanguageTranslator = () => {
  let selector;
  if (variables.page.forumTopicPage) {
    selector = ".message-subject > .lia-message-subject";
  } else if (variables.page.BlogPage) {
    selector = ".lia-tkb-article-subject";
  } else {
    selector = ".lia-blog-article-page-article-subject";
  }

  const elements = document.querySelector(selector);

  console.log("selector is", selector);

  console.log(elements);
  const observerConfig = {
    attributes: true,
    childList: true,
  };

  elements &&
    elements.forEach((element) => {
      const observer = new MutationObserver(handleMutation);
      observer.observe(element, observerConfig);
    });
};

const mutationForDynamicMessages = () => {
  if (variables.page.forumTopicPage) {
    const forumTopicElement = document.querySelector(
      variables.communityCdn[variables.communityIndex]
    );
    const forumTopicParent =
      variables.communityIndex <= 0
        ? forumTopicElement.parentElement
        : forumTopicElement;

    const forumTopicConfig = {
      attributes: false,
      childList: true,
      subtree: false,
    };

    const forumTopicObserver = new MutationObserver(convertLatexToMath);
    if (forumTopicParent) {
      forumTopicObserver.observe(forumTopicParent, forumTopicConfig);
    }

    // if (variables.communityIndex === 1) {
    //   const forumTopicElementJmp = document.querySelector(
    //     ".linear-message-list.message-list"
    //   );

    //   console.log("hello word from jmp", forumTopicElementJmp);

    //   const forumTopicObserverJmp = new MutationObserver(convertLatexToMath);
    //   forumTopicObserverJmp.observe(forumTopicElementJmp, forumTopicConfig);
    // }
  }
};

const mutationForMinWidthWrapper = () => {
  const targetNode = document.querySelector(
    ".min-width-wrapper .min-width section .message-list"
  );
  const config = { attributes: true, childList: true, subtree: false };

  const cdnObserver = new MutationObserver(convertLatexToMath);
  if (targetNode) {
    cdnObserver.observe(targetNode, config);
  }
};

const reRenderMathEquationForConfirmation = () => {
  let interval = setInterval(() => {
    let count = document.querySelectorAll(".math-equation").length;
    if (count != countOfMathEquations) {
      convertLatexToMath();
      countOfMathEquations = count;
    }
  }, 1000);

  setTimeout(() => clearInterval(interval), 10000);
};

const startProcessOfRenderingMathEquations = () => {
  countOfMathEquations = document.querySelectorAll(".math-equation").length;

  convertLatexToMath();

  if (variables.page.blogArticlePage) {
    reRenderMathEquationForConfirmation();
  }
  // mutationForLanguageTranslator();
  mutationForDynamicMessages();
  if (variables.communityIndex <= 0) {
    // for community page, forum topic page in italent2.demo.lithium.com
    mutationForMinWidthWrapper();
  }
};

export default startProcessOfRenderingMathEquations;
