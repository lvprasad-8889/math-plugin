import React, { useState, useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import "./App.css";
import Modal from "./modal";
import Katex from "katex";
import Root from "./assets/root";

function App() {
  const [latex, setLatex] = useState("");
  const mathFieldRef = useRef(null);
  const previewRef = useRef(null);
  const [currElement, setCurrElement] = useState(null);
  const [prod, setProd] = useState(true);

  const focusMathField = () => {
    setTimeout(() => {
      if (mathFieldRef.current) {
        mathFieldRef.current.focus();
      }
    }, 100);
  };

  const handleInput = (evt) => {
    let val = evt.target.value.trim();
    setLatex(val);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setLatex("");
    setIsModalOpen(true);
    focusMathField();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateExpression = (element) => {
    const latex = element.getAttribute("data-katex");

    if (latex) {
      try {
        Katex.render(latex, element, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (error) {
        console.error("Error rendering KaTeX:", error);
      }
    }
  };

  const addToTMCE = () => {
    let iframe;
    let innerDoc;
    if (prod) {
      iframe = document.getElementById("tinyMceEditor_ifr");
      innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    } else {
      innerDoc = document.getElementById("dummy");
    }
    let p = document.createElement("p");
    p.textContent = latex;
    p.className = "math-expression";
    p.setAttribute("data-katex", latex);
    p.setAttribute("contenteditable", false);

    innerDoc.appendChild(p);

    updateExpression(p);

    p.addEventListener("click", function (event) {
      const allElements = innerDoc.querySelectorAll(
        ".math-expression .katex-html .base"
      );
      allElements.forEach((el) => {
        el.classList.remove("math-expression-selected");
      });

      const selectedElement = p.querySelectorAll(".katex-html .base");

      selectedElement.forEach((el) => {
        el.classList.add("math-expression-selected");
      });

      event.stopPropagation();
    });

    p.addEventListener("dblclick", function () {
      let latex = p.getAttribute("data-katex");
      setCurrElement(p);
      setIsModalOpen(true);
      setLatex(latex);
    });

    innerDoc.addEventListener("keydown", function (e) {
      const selectedElement = innerDoc.querySelector(
        ".math-expression .math-expression-selected"
      );

      // If Backspace is pressed and a math expression is selected, remove only the selected one
      if (e.key === "Delete") {
        if (selectedElement) {
          e.preventDefault(); // Prevent default backspace behavior

          // Remove only the selected math expression
          selectedElement.closest(".math-expression").remove();
        } else {
          // Check if the cursor is directly after any KaTeX expression
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          const prevElement = range.startContainer.previousSibling;

          if (
            prevElement &&
            prevElement.classList &&
            prevElement.classList.contains("math-expression")
          ) {
            e.preventDefault(); // Prevent default backspace behavior
            prevElement.remove(); // Remove only the math expression directly before the cursor
          }
        }
      }
    });

    // Remove selection on clicking outside of the math-expression
    innerDoc.addEventListener("click", function () {
      const allSelectedElements = innerDoc.querySelectorAll(
        ".math-expression .math-expression-selected"
      );
      allSelectedElements.forEach((el) => {
        el.classList.remove("math-expression-selected");
      });
    });
  };

  const addExpression = () => {
    if (!latex) {
      closeModal();
      return;
    }
    if (currElement) {
      try {
        // Render the LaTeX inside the element
        Katex.render(latex, currElement, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (error) {
        console.error("Error rendering KaTeX:", error);
      }
      setCurrElement(null);
      closeModal();
      return;
    }
    closeModal();
    addToTMCE();
  };

  useEffect(() => {
    let iframe;
    let innerDoc;
    if (prod) {
      iframe = document.getElementById("tinyMceEditor_ifr");
      innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    } else {
      innerDoc = document.getElementById("dummy");
    }
    const elements = innerDoc.querySelectorAll(".math-expression");

    elements.forEach((element) => {
      updateExpression(element);
    });
  }, []);

  useEffect(() => {
    if (previewRef.current) {
      if (latex) {
        try {
          Katex.render(latex, previewRef.current, {
            throwOnError: false,
            displayMode: true,
          });
        } catch (error) {
          console.error("Error rendering KaTeX:", error);
        }
      }
    }
  }, [latex]);

  return (
    <div className="math-editor">
      <button onClick={openModal}>
        <Root />
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {() => (
          <>
            <h2 className="math-header">Math Editor</h2>

            <math-field
              ref={mathFieldRef}
              onInput={handleInput}
              style={{ width: "100%" }}
              className="math-field"
            >
              {latex}
            </math-field>

            {latex && (
              <div style={{ marginTop: "20px" }}>
                <h3>Preview of Math Expression:</h3>
                <p ref={previewRef}></p>
              </div>
            )}
            <div className="math-footer">
              <div className="math-buttons">
                <div className="btn" onClick={closeModal}>
                  Cancel
                </div>
                <div className="btn" onClick={addExpression}>
                  Save
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>

      {!prod && <div className="dummy" id="dummy" contentEditable={true}></div>}
    </div>
  );
}

export default App;
