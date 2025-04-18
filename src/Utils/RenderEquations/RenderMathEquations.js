function isHTMLElement(element) {
  return element instanceof HTMLElement;
}

const getDisplayandLatex = (oldLatex) => {
  if (!oldLatex) return;
  let displayMode;
  let latex;
  if (oldLatex.startsWith("$$") && oldLatex.endsWith("$$")) {
    displayMode = true;
    latex = oldLatex.slice(2, -2);
  } else if (oldLatex.startsWith("$") && oldLatex.endsWith("$")) {
    displayMode = false;
    latex = oldLatex.slice(1, -1);
  } else {
    displayMode = true;
    latex = oldLatex;
  }
  return {
    displayMode,
    latex,
  };
};

const changeLatex = (oldLatex, inline = false) => {
  if (inline) {
    return "$" + oldLatex + "$";
  }
  return "$$" + oldLatex + "$$";
};

const convertLatexToMath = (richDoc = undefined) => {
  let mathEquations =
    richDoc && isHTMLElement(richDoc)
      ? richDoc.querySelectorAll(".math-equation")
      : document.querySelectorAll(".math-equation");
  if (mathEquations) {
    mathEquations.forEach((equation) => {
      let oldLatex = equation.getAttribute("data-katex");
      let { latex, displayMode } = getDisplayandLatex(oldLatex);

      if (latex) {
        equation.innerHTML = katex.renderToString(latex, {
          throwOnError: false,
          displayMode,
        });
      }
    });
    console.log("done converting every equation...", mathEquations);
  } else {
    console.log("no math equations to convert.. ");
  }
};

export default convertLatexToMath;

export { changeLatex, getDisplayandLatex };
