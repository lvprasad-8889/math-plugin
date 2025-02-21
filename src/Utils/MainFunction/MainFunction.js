import variables from "../Variables/CommunityVariables";

import plugins from "../MathPlugin/MathPlugin";

import forumTopicMutations from "../Mutations/ForumTopicPageMutations";

import startProcessOfRenderingMathEquations from "../Mutations/JustRenderMathEquationMutations";

const mainFunction = () => {
  startProcessOfRenderingMathEquations();
  variables.isMathPluginUser();
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
      }, 0);
    }
  }
};

// export default mainFunction;
export default mainFunction;
