import variables from "../Variables/CommunityVariables";

import plugins from "../MathPlugin/MathPlugin";

import forumTopicMutations from "../Mutations/ForumTopicPageMutations";

import startProcessOfRenderingMathEquations from "../Mutations/JustRenderMathEquationMutations";

const mainFunction = () => {
  startProcessOfRenderingMathEquations();
  variables.isMathPluginUser();
  // only for custom ModifyTranslation_preview page
  if (document.body.classList.contains("ModifyTranslation_preview")) {
    let interval = setInterval(() => {
      convertLatexToMath();
    }, 1500);
    setTimeout(() => clearInterval(interval), 6000); // 5 seconds
  }
  if (!variables.prod) {
    plugins.internalMathPlugin();
    plugins.externalMathPlugin();
  } else if (!variables.isMobile()) {
    if (variables.page.forumTopicPage) {
      forumTopicMutations.mutatationForReplyButton();
      setTimeout(() => {
        if (variables.communityIndex <= 0) {
          forumTopicMutations.mutatationForPostReplyButton();
        }
        forumTopicMutations.mutationForDynamicMessages();
      }, 1000);
    } else {
      setTimeout(async () => {
        if (
          (variables.page.tkbArticleEditorPage ||
            variables.page.tkbArticlePage) &&
          variables.communityIndex === 1
        ) {
          variables.makeInsertVideoBtnInline();
        }
        plugins.internalMathPlugin();
        plugins.externalMathPlugin();
        forumTopicMutations.mutationForPreview();
        // another internal math plugin to be added after toolbar expanded
        plugins.threeDotsInRichEditor();
      }, variables.communityIndex === 1 ? 0 : 500);
    }
  }
};

// export default mainFunction;
export default mainFunction;
