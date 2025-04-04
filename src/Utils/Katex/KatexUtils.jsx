import { changeLatex, getDisplayandLatex } from "../RenderEquations/RenderMathEquations";

const getMathEquation = async (oldLatex) => {
  
  let {displayMode, latex} = getDisplayandLatex(oldLatex);

  let res = await katex.renderToString(latex, {
    throwOnError: false,
    displayMode,
  });

  return res;
};

export { getMathEquation };
