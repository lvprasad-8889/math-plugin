import variables from "./Variables/CommunityVariables";
import useStore from "../Store/useStore";

let globalState = useStore.getState();

const trimLatex = (tempLatex) => {
  let latexForKatex = tempLatex
    .replace(/\\displaylines\s*/g, "")
    .trim()
    .replace(/\\\s/g, "\\");
  if (latexForKatex.startsWith("{") && latexForKatex.endsWith("}")) {
    latexForKatex = latexForKatex.slice(1, -1).trim(); // Remove first and last character
  }
  return latexForKatex;
};

const isValidKaTeXEquation = (equation) => {
  let trimmedLatex = trimLatex(equation);
  try {
    katex.renderToString(trimmedLatex);
    return true;
  } catch (error) {
    console.error("Invalid equation:", error.message);
    return false;
  }
};

const addNewLineAfterMathEqn = () => {
  const p = document.createElement("p");
  const br = document.createElement("br");
  br.setAttribute("data-mce-bogus", "1");

  p.appendChild(br);

  addToTextArea(p);
};

const addToTextArea = (element) => {
  let innerDoc = getInnerDoc();
  innerDoc && innerDoc.appendChild(element);
};

const setAttributeForMathElement = (element) => {
  element.setAttribute("contenteditable", false);
  element.setAttribute("draggable", "false");
  element.className = "math-equation";
  element.style.width = "fit-content";
  element.style.minWidth = "99%";
};

const removeDraggedMathEquations = (innerDoc) => {
  const elementsToRemove = innerDoc.querySelectorAll(".mce-drag-container");

  elementsToRemove.forEach((element) => {
    if (element.querySelector(".math-equation")) {
      element.remove();
    }
  });
};

const getInnerDoc = () => {
  let iframe;
  let innerDoc;

  if (variables.prod) {
    iframe = variables.page.forumTopicPage
      ? document.querySelector('iframe[id^="tinyMceEditor_"][id$="_ifr"]')
      : document.getElementById("tinyMceEditor_ifr");
    innerDoc = iframe?.contentDocument || iframe?.contentWindow.document;
  } else {
    innerDoc = document.getElementById("math-plugin-dummy");
  }

  return variables.prod ? innerDoc?.body : innerDoc;
};

// adds shadow root to not get disturbed by the styles given by tinymce to its children
const addShadowRootToTheDom = async (
  element,
  customLatex = false,
  latex = ""
) => {
  if (element && !element.shadowRoot) {
    const shadowRoot = element.attachShadow({ mode: "open" });
    const head = document.createElement("head");
    head.innerHTML = `
      <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.css"
      integrity="sha384-NFTC4wvyQKLwuJ8Ez9AvPNBv8zcC2XaQzXSMvtORKw28BdJbB2QE8Ka+OyrIHcQJ"
      crossorigin="anonymous"
      />
      <script
        defer
        src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.js"
        integrity="sha384-z9arB7KJHppq8kK9AESncXcQd/KXIMMPiCrAdxfFpp+5QU438lgBE7UFGbk+gljP"
        crossorigin="anonymous"
      ></script>
      <script
        defer
        src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
        integrity="sha384-43gviWU0YVjaDtb/GhzOouOXtZMP/7XUzwPTstBeZFe/+rCMvRwr4yROQP43s0Xk"
        crossorigin="anonymous"
        onload="renderMathInElement(document.body);"
      ></script>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .math-content {
        font-size: 1.25rem;
      }
    `;

    const content = document.createElement("div");
    content.className = "math-content";

    let finalLatex;
    if (customLatex) {
      finalLatex = element.getAttribute("data-katex");
    } else {
      finalLatex = latex;
    }
    content.innerHTML = await katex.renderToString(finalLatex, {
      throwOnError: false,
      displayMode: true,
    });

    shadowRoot.appendChild(head);
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(content);
    return;
  }

  if (element && element.shadowRoot) {
    if (element.shadowRoot.children[2]) {
      element.shadowRoot.children[2].remove();
    }
    const content = document.createElement("div");
    content.className = "math-content";
    content.innerHTML = await katex.renderToString(latex, {
      throwOnError: false,
      displayMode: true,
    });
    element.shadowRoot.appendChild(content);
    return;
  }
};

const addEventsForMathElement = (element) => {
  element.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  element.addEventListener("dblclick", function () {
    globalState.openMathPlugin(element);
  });
};

const startProcessOfMathEquation = () => {
  let innerDoc = getInnerDoc();

  let nonConvertedMathEqn = innerDoc?.querySelectorAll(".math-equation");

  if (nonConvertedMathEqn && nonConvertedMathEqn.length) {
    nonConvertedMathEqn.forEach((equation) => {
      setAttributeForMathElement(equation);
      addNewLineAfterMathEqn();
      addShadowRootToTheDom(equation, true);
      addEventsForMathElement(equation);
    });

    console.log(
      "done converting every equation in tiny mce...",
      nonConvertedMathEqn
    );
  } else {
    console.log("No equations to convert in tinymce");
  }
};

const mathUtils = {
  trimLatex,
  isValidKaTeXEquation,
  setAttributeForMathElement,
  removeDraggedMathEquations,
  addNewLineAfterMathEqn,
  addToTextArea,
  getInnerDoc,
  addShadowRootToTheDom,
  startProcessOfMathEquation,
  addEventsForMathElement
};

export default mathUtils;
