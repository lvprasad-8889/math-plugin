// convert all dom node who has class `math-equation` will be rerender by katex in math form
const convertLatexToMath = (richDoc) => {
  let mathEquations = richDoc
    ? richDoc.querySelectorAll(".math-equation")
    : document.querySelectorAll(".math-equation");
  if (mathEquations) {
    mathEquations.forEach((equation) => {
      let latex = equation.getAttribute("data-katex");

      if (latex) {
        equation.innerHTML = katex.renderToString(latex, {
          throwOnError: false,
          displayMode: true,
        });
      }
    });
    console.log("done converting every equation...", mathEquations);
  } else {
    console.log("no math equations to convert.. ");
  }
};

// This function will take care of initial rendering of math expressions and
// also some mutations are added because of children might adding dynamically in community or forum topic page
// to rerender math equations again to not disturb the user flow
const renderMathEquations = () => {
  let communityCdn = {
    0: "#threadeddetailmessagelist",
    1: ".lia-component-reply-list > :first-child",
  };

  const targetNode = document.querySelector(
    ".min-width-wrapper .min-width section .message-list"
  );
  const config = { attributes: true, childList: true, subtree: false };

  const cdnObserver = new MutationObserver(convertLatexToMath);
  if (targetNode) {
    cdnObserver.observe(targetNode, config);
  }

  setTimeout(convertLatexToMath, 100);

  if (forumTopicPage) {
    const forumTopicElement = document.querySelector(
      communityCdn[communityIndex]
    );
    const forumTopicParent =
      communityIndex <= 0 ? forumTopicElement.parentElement : forumTopicElement;

    const forumTopicConfig = {
      attributes: false,
      childList: true,
      subtree: false,
    };
    const forumTopicObserver = new MutationObserver(convertLatexToMath);
    forumTopicObserver.observe(forumTopicParent, forumTopicConfig);
  }
};

export default renderMathEquations;

export { convertLatexToMath };
