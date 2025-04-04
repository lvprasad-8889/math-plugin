import useStore from "../Store/useStore";
import { getMathEquation } from "./Katex/KatexUtils";
import { getDisplayandLatex } from "./RenderEquations/RenderMathEquations";
import variables from "./Variables/CommunityVariables";

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
  if (!trimmedLatex) {
    return true;
  }
  try {
    katex.renderToString(trimmedLatex);
    return (
      true &&
      trimmedLatex.length > 0 &&
      trimmedLatex.trim().replace(/\\/g, "").length > 0
    );
  } catch (error) {
    console.error("Invalid equation:", error.message);
    return false;
  }
};

const checkLastChildEmptyParagraph = () => {
  let lastChild;

  if (variables.prod) {
    const editor = tinymce.activeEditor;
    lastChild = editor.getBody().lastElementChild;
  } else {
    let innerDoc = getInnerDoc();
    lastChild = innerDoc && innerDoc.lastElementChild;
  }

  const isLastChildEmptyParagraph =
    lastChild &&
    !lastChild.classList.contains("math-equation") &&
    lastChild.tagName === "p" &&
    lastChild.children.length === 1 &&
    lastChild.firstElementChild.tagName === "br" &&
    lastChild.firstElementChild.hasAttribute("data-mce-bogus");

  return { isLastChildEmptyParagraph, lastChild };
};

const checkLastElementInTinyMCE = () => {
  let lastChild;

  if (variables.prod) {
    const editor = tinymce.activeEditor;
    lastChild = editor.getBody().lastElementChild;
  } else {
    let innerDoc = getInnerDoc();
    lastChild = innerDoc && innerDoc.lastElementChild;
  }
  const isLastParagraphWithNbsp =
    lastChild &&
    lastChild.tagName === "P" &&
    !lastChild.classList.contains("math-equation") &&
    lastChild.textContent.trim() === "&nbsp;";

  const isLastChildEmptyParagraph =
    lastChild &&
    !lastChild.classList.contains("math-equation") &&
    lastChild.tagName === "P" &&
    lastChild.children.length === 1 &&
    lastChild.firstElementChild.tagName === "BR" &&
    lastChild.firstElementChild.hasAttribute("data-mce-bogus");

  return isLastParagraphWithNbsp || isLastChildEmptyParagraph;
};

const addNewLineAfterMathEqn = async () => {
  let innerDoc = getInnerDoc();
  let p = document.createElement("p");
  let br = document.createElement("br");

  br.setAttribute("data-mce-bogus", 1);

  p.appendChild(br);

  !checkLastElementInTinyMCE() && innerDoc && innerDoc.appendChild(p);
};

const addElementAtCursorToTinyMCE = (element) => {
  const editor = tinymce.activeEditor;

  const selection = editor.selection;
  const selectedNode = selection.getNode();

  if (selectedNode && selectedNode.contentEditable === "false") {
    selection.collapse(false);
  }

  if (!editor) return;

  editor.undoManager.transact(() => {
    editor.insertContent(element.outerHTML, { format: "raw" });
    addNewLineAfterMathEqn();
  });

  editor.selection.select(editor.getBody().lastChild, true);
  editor.selection.collapse(true);
  editor.nodeChanged();
};

const addToTextArea = (element) => {
  let innerDoc = getInnerDoc();
  if (variables.prod) {
    addElementAtCursorToTinyMCE(element);
  } else {
    innerDoc && innerDoc.appendChild(element);
  }
};

const setAttributeForMathElement = (element) => {
  let { displayMode } = getDisplayandLatex(element.getAttribute("data-katex"));
  element.setAttribute("draggable", "false");
  element.className = "math-equation";
  if (displayMode) {
    element.style.width = "fit-content";
    element.style.minWidth = "99%";
  } else {
    element.style.display = "inline";
  }
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
  let finalLatex;
  if (customLatex) {
    finalLatex = element.getAttribute("data-katex");
  } else {
    finalLatex = latex;
  }

  let displayMode = getDisplayandLatex(finalLatex).displayMode;

  const content = document.createElement(displayMode ? "div" : "span");
  content.className = "math-content";

  if (!displayMode) {
    element.style.padding = "5px 5px";
    element.style.margin = "0px 5px";
    element.style.minWidth = "";
  }

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
        font-size: ${variables.fontSize} !important;
      }
    `;

    content.innerHTML = await getMathEquation(finalLatex);

    shadowRoot.appendChild(head);
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(content);
    return;
  }

  if (element && element.shadowRoot) {
    if (element.shadowRoot.children[2]) {
      element.shadowRoot.children[2].remove();
    }
    content.innerHTML = await getMathEquation(finalLatex);
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

const previewOfMathEquation = (isModalOpen, latex) => {
  if (isModalOpen) {
    let previewElement = document.querySelector(".preview-of-math-equation");
    if (previewElement) {
      addShadowRootToTheDom(previewElement, false, latex);
    }
  }
};

const trimAllParagraphTagsWithNbsp = () => {
  if (variables.prod) {
    const editor = tinymce.activeEditor;
    const paragraphs = editor.getBody().querySelectorAll("p");

    paragraphs.forEach((p, index) => {
      if (
        p.className != "math-equation" &&
        (p.innerHTML.trim() === "&nbsp;" || p.innerHTML.trim() === "")
      ) {
        p.remove();
      }
    });
    addNewLineAfterMathEqn();
  }
};

const replacePWithSpan = (element) => {
  if (!element || element.tagName !== "P") return;

  const spanElement = document.createElement("span");

  for (const attr of element.attributes) {
    spanElement.setAttribute(attr.name, attr.value);
  }

  spanElement.innerHTML = element.innerHTML;

  element.parentNode.replaceChild(spanElement, element);

  return spanElement;
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
  addEventsForMathElement,
  previewOfMathEquation,
  checkLastElementInTinyMCE,
  checkLastChildEmptyParagraph,
  trimAllParagraphTagsWithNbsp,
  replacePWithSpan,
};

export default mathUtils;
