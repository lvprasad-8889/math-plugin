import useStore from "../Store/useStore";
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
  try {
    katex.renderToString(trimmedLatex);
    return true;
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
    lastChild.tagName === "P" &&
    lastChild.children.length === 1 &&
    lastChild.firstElementChild.tagName === "BR" &&
    lastChild.firstElementChild.hasAttribute("data-mce-bogus");

  if (isLastChildEmptyParagraph) {
    lastChild.remove();
  }
  return isLastChildEmptyParagraph;
};

const checkLastParagraphWithNbsp = () => {
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
    lastChild.innerHTML.trim() === "&nbsp;";

  return isLastParagraphWithNbsp;
};

const addNewLineAfterMathEqn = () => {
  let innerDoc = getInnerDoc();

  const p = document.createElement("p");
  const br = document.createElement("br");
  br.setAttribute("data-mce-bogus", "1");

  p.appendChild(br);

  innerDoc && innerDoc.appendChild(p);
};

const addElementAtCursorToTinyMCE = (element) => {
  const editor = tinymce.activeEditor;
  const selection = editor.selection;
  const elementHtml = element.outerHTML;

  // Remove selection if an existing non-editable element is selected
  const selectedNode = selection.getNode();
  if (selectedNode && selectedNode.contentEditable === "false") {
    selection.collapse(false); // Collapse to the end to avoid replacement
  }

  // Ensure we start a transaction
  editor.undoManager.transact(() => {
    // Insert the element safely without replacing the existing one
    editor.execCommand("mceInsertContent", false, elementHtml);

    // Ensure math gets re-rendered
    editor.setContent(editor.getContent(), { format: "raw" });

    // Move cursor after the inserted element
    setTimeout(() => {
      const insertedElements = editor
        .getBody()
        .querySelectorAll(element.tagName.toLowerCase());
      const insertedElement = insertedElements[insertedElements.length - 1]; // Get the last inserted element
      if (insertedElement) {
        let parent = insertedElement.parentNode;
        let nextSibling = insertedElement.nextSibling;

        // Move cursor *after* the inserted element
        if (nextSibling) {
          editor.selection.setCursorLocation(parent, nextSibling);
        } else {
          // If there's no nextSibling, place the cursor after the parent node
          let range = document.createRange();
          range.setStartAfter(insertedElement);
          range.collapse(true);
          selection.setRng(range);
        }
      }
    }, 0);
  });

  // Ensure TinyMCE registers the change
  editor.nodeChanged();
};

const addToTextArea = (element) => {
  let innerDoc = getInnerDoc();
  checkLastChildEmptyParagraph();
  if (variables.prod) {
    addElementAtCursorToTinyMCE(element);
  } else {
    innerDoc && innerDoc.appendChild(element);
  }
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
      addShadowRootToTheDom(equation, true);
      addEventsForMathElement(equation);
    });

    setTimeout(() => {
      console.log("trimming yet to begin..");
      trimAllParagraphTagsWithNbsp();
    }, 1000);

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
    checkLastChildEmptyParagraph();
    addNewLineAfterMathEqn();
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
  addEventsForMathElement,
  previewOfMathEquation,
  checkLastParagraphWithNbsp,
  checkLastChildEmptyParagraph,
  trimAllParagraphTagsWithNbsp,
};

export default mathUtils;
