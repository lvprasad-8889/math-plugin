import React, { useEffect, useRef, useState } from "react";
import "./App.css";

import "mathlive";
import Root from "./assets/root";
import Modal from "./Modal/Modal";

import useStore from "./Store/useStore";

import variables from "./Utils/Variables/CommunityVariables";
import mathUtils from "./Utils/MathUtils";
import externalAppMutations from "./Utils/Mutations/ExternalAppMutations";

function App() {
  const { invokeMathPopUp, elementNeedToBeEdited, closeMathPlugin } =
    useStore();

  const mathFieldRef = useRef(null);

  const [currElement, setCurrElement] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVirtualKeyboardVisible, setVirtualKeyboardVisible] = useState(false);

  const [latex, setLatex] = useState("");

  // on clicking save button, this function will be executed
  const addExpression = () => {
    if (!mathUtils.isValidKaTeXEquation(latex) || !latex.trim()) {
      closeModal();
      return;
    }

    if (currElement) {
      if (!latex.trim()) {
        currElement.remove();
      } else {
        currElement.setAttribute("data-katex", latex);
        mathUtils.addShadowRootToTheDom(currElement, false, latex);
      }
      setCurrElement(null);
      closeModal();
      return;
    }
    addToTMCE();
    closeModal();
  };

  const addToTMCE = async () => {
    let element = document.createElement("p");
    element.setAttribute("data-katex", latex);

    mathUtils.setAttributeForMathElement(element);
    mathUtils.addShadowRootToTheDom(element, false, latex);
    mathUtils.addEventsForMathElement(element);
    mathUtils.addToTextArea(element);
    mathUtils.addNewLineAfterMathEqn();
  };

  const closeModal = () => {
    setCurrElement(null);
    setIsModalOpen(false);
    closeMathPlugin();
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

  const openModal = () => {
    setLatex("");
    setIsModalOpen(true);
    setCurrElement(null);
  };

  // we make sure shadow root is applied to preview
  // enabling user to add space in the mathlive editor
  useEffect(() => {
    if (isModalOpen) {
      let previewElement = document.querySelector(".preview-of-math-equation");
      if (previewElement) {
        mathUtils.addShadowRootToTheDom(previewElement, false, latex);
      }
    }

    if (mathFieldRef.current && isModalOpen) {
      const mathfield = mathFieldRef.current;
      focusMathField();
      const handleKeyDown = async (event) => {
        if (event.code === "Space") {
          mathfield.insert("\\;");
        } else if (event.shiftKey && event.key === "Enter") {
          setLatex(latex + "\\\\");
          event.preventDefault();
        }
      };
      mathfield.addEventListener("keydown", handleKeyDown);

      return () => {
        mathfield.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [latex, isModalOpen]);

  // for observing whether keyboard is visible or not
  useEffect(() => {
    let observer = externalAppMutations.mutationForVirtualKeyboard(
      isModalOpen,
      setVirtualKeyboardVisible
    );
    return () => {
      observer.disconnect();
    };
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
        setLatex(elementNeedToBeEdited.getAttribute("data-katex"));
      }
    }
  }, [invokeMathPopUp]);

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
              ref={mathFieldRef}
              onInput={handleInput}
              style={{ width: "100%" }}
              class="math-field custom-font"
              math-mode-space="\;"
            >
              {latex}
            </math-field>
            {!mathUtils.isValidKaTeXEquation(latex) && (
              <div className="math-plugin-invalid-message">
                * Inavlid math equations cannot be added
              </div>
            )}

            {latex && (
              <div className="math-plugin-preview">
                <div className="math-plugin-preview-title">
                  Preview of Math equation:
                </div>
                <div className="preview-of-math-equation"></div>
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
                      ? "disable-math-btn"
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
