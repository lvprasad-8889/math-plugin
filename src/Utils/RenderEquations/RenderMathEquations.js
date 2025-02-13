function isHTMLElement(element) {
  return element instanceof HTMLElement;
}

const convertLatexToMath = (richDoc = undefined) => {
  let mathEquations = (richDoc && isHTMLElement(richDoc))
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


export default convertLatexToMath;
