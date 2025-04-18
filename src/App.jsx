import React, { useEffect, useRef, useState } from "react";
import "./App.css";

import "mathlive";

import Root from "./assets/root";
import Modal from "./Modal/Modal";

import useStore from "./Store/useStore";

import variables from "./Utils/Variables/CommunityVariables";
import mathUtils from "./Utils/MathUtils";
import externalAppMutations from "./Utils/Mutations/ExternalAppMutations";
import {
  changeLatex,
  getDisplayandLatex,
} from "./Utils/RenderEquations/RenderMathEquations";

function App() {
  const {
    invokeMathPopUp,
    elementNeedToBeEdited,
    closeMathPlugin,
    updateTinyMceBody,
    setUpdateTinyMceBody,
    setShowLatex,
    showLatex,
    setContextMenu,
  } = useStore();

  const mathFieldRef = useRef(null);

  const [currElement, setCurrElement] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVirtualKeyboardVisible, setVirtualKeyboardVisible] = useState(false);

  const [latex, setLatex] = useState("");
  const [inline, setInline] = useState(false);

  const addExpression = () => {
    if (!mathUtils.isValidKaTeXEquation(latex) || !latex.trim()) {
      closeModal();
      return;
    }

    if (currElement) {
      if (!latex.trim()) {
        currElement.remove();
      } else {
        let newLatex = changeLatex(latex, inline);
        let newCurrElement;
        if (inline) {
          newCurrElement = mathUtils.convertPtoSpan(currElement);
        } else {
          newCurrElement = mathUtils.convertSpantoP(currElement);
        }
        newCurrElement.setAttribute("data-katex", newLatex);
        mathUtils.addEventsForMathElement(newCurrElement);
        mathUtils.setAttributeForMathElement(newCurrElement);
        mathUtils.addShadowRootToTheDom(newCurrElement, false, newLatex);
        if (variables.prod) {
          const editor = tinymce.activeEditor;
          editor.selection.select(editor.getBody().lastChild, true);
          editor.selection.collapse(true);
          editor.nodeChanged();
        }
      }
      setCurrElement(null);
      closeModal();
      return;
    }
    addToTMCE();
    closeModal();
  };

  const addToTMCE = async () => {
    let element = document.createElement(inline ? "span" : "p");
    let updatedLatex = changeLatex(latex, inline);
    element.setAttribute("data-katex", updatedLatex);

    mathUtils.setAttributeForMathElement(element);
    mathUtils.addShadowRootToTheDom(element, false, updatedLatex);
    mathUtils.addEventsForMathElement(element);
    mathUtils.addToTextArea(element);
  };

  const closeModal = () => {
    setCurrElement(null);
    setIsModalOpen(false);
    closeMathPlugin();
    mathVirtualKeyboard.hide();
  };

  // delete the math equation
  const deleteNode = () => {
    currElement.remove();
    setCurrElement(null);
    closeModal();
  };

  // focus math field immediately after opening popup
  const focusMathField = () => {
    if (mathFieldRef.current) {
      mathFieldRef.current.focus();
    }
  };

  const handleInput = (evt) => {
    let val = evt.target.value.trim();

    const replacedVal = val.replace(/\\~/g, "\\sim");

    setLatex((prevLatex) => {
      if (evt.nativeEvent.data === "insertLineBreak") {
        return prevLatex + "\\\\";
      }
      return replacedVal;
    });
  };

  const handleLatexInput = (evt) => {
    let val = evt.target.value.trim();
    const replacedVal = val.replace(/\\~/g, "\\sim");

    setLatex((prevLatex) => {
      if (evt.nativeEvent.data === "insertLineBreak") {
        return prevLatex + "\\\\";
      }
      return replacedVal;
    });
  };

  const openModal = () => {
    setLatex("");
    setIsModalOpen(true);
    setCurrElement(null);
    setInline(false);
    setVirtualKeyboardVisible(false);
  };

  // we make sure shadow root is applied to preview
  // enabling user to add space and enter new line in the mathlive editor
  useEffect(() => {
    if (mathFieldRef.current && isModalOpen) {
      const mathField = mathFieldRef.current;
      const handleKeyDown = async (event) => {
        if (event.code === "Space") {
          mathField.insert("\\;");
        } else if (event.shiftKey && event.key === "Enter") {
          setLatex(latex + "\\\\");
          event.preventDefault();
        }
      };
      mathField.addEventListener("keydown", handleKeyDown);

      return () => {
        mathField.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [latex, isModalOpen]);

  useEffect(() => {
    mathUtils.previewOfMathEquation(isModalOpen, changeLatex(latex, inline));
  }, [latex, isModalOpen, inline]);

  useEffect(() => {
    if (isModalOpen) {
      focusMathField();
      mathFieldRef.current && mathUtils.setStylesForMathField();
    }
  }, [isModalOpen]);

  // for observing whether keyboard is visible or not
  useEffect(() => {
    if (isModalOpen) {
      let observer = externalAppMutations.mutationForVirtualKeyboard(
        isModalOpen,
        setVirtualKeyboardVisible
      );
      return () => {
        observer.disconnect();
      };
    }
  }, [isModalOpen]);

  // statrting a mutation on tinymce for re rendering
  useEffect(() => {
    let timer = setTimeout(() => {
      mathUtils.startProcessOfMathEquation();
      externalAppMutations.mutationForRerendingInTinyMCE();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (invokeMathPopUp) {
      openModal();
      if (elementNeedToBeEdited) {
        setCurrElement(elementNeedToBeEdited);
        setIsModalOpen(true);
        let dataKatex = elementNeedToBeEdited.getAttribute("data-katex");
        let latexTobeEdited = getDisplayandLatex(dataKatex).latex;

        let displayMode = getDisplayandLatex(dataKatex).displayMode;
        setLatex(latexTobeEdited);
        setInline(!displayMode);
      }
    }
  }, [invokeMathPopUp]);

  useEffect(() => {
    if (updateTinyMceBody) {
      tinymce.activeEditor.setContent(tinymce.activeEditor.getContent(), {
        format: variables.page.editPage ? "raw" : "html",
      });
      setUpdateTinyMceBody(false);
    }
  }, [updateTinyMceBody]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--math-plugin-font-size",
      variables.fontSize
    );
    document.documentElement.style.setProperty(
      "--math-plugin-theme",
      variables.theme
    );
  }, []);

  return (
    <div className="math-plugin">
      <div
        onClick={variables.prod ? () => {} : openModal}
        className="math-plugin-btn"
      >
        <Root />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        keyboardVisible={isVirtualKeyboardVisible}
      >
        {() => (
          <>
            <math-field
              id="math-field"
              ref={mathFieldRef}
              onInput={(event) => handleInput(event)}
              style={{ width: "100%" }}
              className="math-field custom-font"
              math-mode-space="\;"
              key="input"
              math-virtual-keyboard-policy="manual"
            >
              {latex}
            </math-field>
            {!mathUtils.isValidKaTeXEquation(latex) && (
              <div className="math-plugin-invalid-message">
                * Invalid math equations cannot be added
              </div>
            )}

            <div className="after-math-field">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="inline-checkbox"
                  checked={inline}
                  onChange={() => {
                    setInline(!inline);
                  }}
                />
                <label className="form-check-label" htmlFor="inline-checkbox">
                  Inline Equation
                </label>
              </div>

              {latex && (
                <div
                  className="form-check"
                  onClick={() => setShowLatex(!showLatex)}
                >
                  <svg
                    id="toggleArrow"
                    className={`math-plugin-latex-arrow ${
                      showLatex ? "rotated" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={variables.theme}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width={"20px"}
                    height={"10px"}
                  >
                    <polyline points="6 15 12 9 18 15" />
                  </svg>
                  <label className="form-check-label" htmlFor="show-latex">
                    {showLatex ? "Hide Latex" : "Show Latex"}
                  </label>
                </div>
              )}
            </div>

            {latex && showLatex && (
              <div className="math-plugin-latex">
                <div className="math-plugin-latex-label">Latex:</div>
                <input
                  type="text"
                  name=""
                  id="latex"
                  key="latexInput"
                  value={latex}
                  className="form-control"
                  autoComplete="off"
                  onChange={(event) => handleLatexInput(event)}
                />
              </div>
            )}

            {latex && (
              <div className="math-plugin-preview">
                <div className="math-plugin-preview-title">
                  Preview of Math equation:
                </div>
                {inline ? (
                  <span className="preview-of-math-equation"></span>
                ) : (
                  <div className="preview-of-math-equation"></div>
                )}
              </div>
            )}
            <div className="math-footer">
              <div className="math-buttons">
                {currElement && (
                  <div className="math-btn" onClick={deleteNode}>
                    Delete
                  </div>
                )}
                <div className="math-btn" onClick={closeModal}>
                  Cancel
                </div>
                <button
                  className={`math-btn ${
                    !mathUtils.isValidKaTeXEquation(latex) || !latex.length
                      ? "disable-math-save-btn"
                      : ""
                  }`}
                  disabled={
                    !mathUtils.isValidKaTeXEquation(latex) || !latex.length
                  }
                  onClick={addExpression}
                >
                  Save
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      {!variables.prod && (
        <div
          className="math-plugin-dummy"
          id="math-plugin-dummy"
          contentEditable={true}
        ></div>
      )}
    </div>
  );
}

export default App;
