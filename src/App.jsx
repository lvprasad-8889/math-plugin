import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Modal from "./Modal/Modal";
import Root from "./assets/root";

function App() {
  let origin = window.location.origin;
  const [latex, setLatex] = useState("");
  const mathFieldRef = useRef(null);
  const [currElement, setCurrElement] = useState(null);
  const [prod, setProd] = useState(
    origin == "http://localhost:5173" ? false : true
  );
  const [editorId, setEditorId] = "tinyMceEditor_ifr";

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
    setCurrElement(null);
    setIsModalOpen(false);
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
    p.className = "math-equation";
    p.setAttribute("data-katex", latex);
    p.setAttribute("contenteditable", false);

    p.innerHTML = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: true,
    });

    if (prod) {
      innerDoc.body.appendChild(p);
    } else {
      innerDoc.appendChild(p);
    }

    p.addEventListener("click", function (event) {
      event.preventDefault();
      setCurrElement(p);
      event.stopPropagation();
    });

    p.addEventListener("dblclick", function () {
      setCurrElement(p);
      setIsModalOpen(true);
      setLatex(p.getAttribute("data-katex"));
    });

    innerDoc.addEventListener("click", function () {
      const allSelectedElements = innerDoc.querySelectorAll(
        ".math-equation .math-equation-selected"
      );
      allSelectedElements.forEach((el) => {
        el.classList.remove("math-equation-selected");
      });
    });
  };

  const addExpression = () => {
    if (currElement) {
      if (!latex) {
        currElement.remove();
      } else {
        currElement.setAttribute("data-katex", latex);
        addShadowRootToTheDom(currElement);
      }
      setCurrElement(null);
      closeModal();
      return;
    }
    if (!latex) {
      closeModal();
      return;
    }
    closeModal();
    addToTMCE();
  };

  const deleteNode = () => {
    currElement.remove();
    setCurrElement(null);
    closeModal();
  };

  const addShadowRootToTheDom = (element) => {
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
          font-size: 1.5rem;
        }
      `;

      const content = document.createElement("div");
      content.className = "math-content";
      content.innerHTML = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
      });

      shadowRoot.appendChild(head);
      shadowRoot.appendChild(style);
      shadowRoot.appendChild(content);
    } else if (element && element.shadowRoot) {
      element.shadowRoot.children[2].remove();
      const content = document.createElement("div");
      content.className = "math-content";
      content.innerHTML = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
      });
      element.shadowRoot.appendChild(content);
    }
  };

  useEffect(() => {
    let previewElement = document.querySelector(".preview-of-math-equation");
    addShadowRootToTheDom(previewElement);
  }, [latex, isModalOpen]);


  useEffect(() => {
    setTimeout(() => {
      let iframe;
      let innerDoc;
      if (prod) {
        iframe = document.getElementById("tinyMceEditor_ifr");
        innerDoc = iframe.contentDocument || iframe.contentWindow.document;
      } else {
        innerDoc = document.getElementById("dummy");
      }

      let nonConvertedMathEqn = innerDoc.querySelectorAll(".math-equation");

      if (nonConvertedMathEqn) {
        nonConvertedMathEqn.forEach((equation) => {
          let latex = equation.getAttribute("data-katex");
          equation.setAttribute("contenteditable", false);

          if (latex) {
            equation.innerHTML = katex.renderToString(latex, {
              throwOnError: false,
              displayMode: true,
            });
          }

          equation.addEventListener("click", function (event) {
            event.preventDefault();
            setCurrElement(equation);
            event.stopPropagation();
          });

          equation.addEventListener("dblclick", function () {
            setCurrElement(equation);
            setIsModalOpen(true);
            setLatex(equation.getAttribute("data-katex"));
          });
        });

        console.log(
          "done converting every equation in tiny mce...",
          nonConvertedMathEqn
        );
      } else {
        console.log("No equations to convert in tinymce");
      }
    }, 2000);
  }, []);

  return (
    <div className="math-editor">
      <button onClick={openModal}>
        <Root />
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {() => (
          <>
            <math-field
              ref={mathFieldRef}
              onInput={handleInput}
              style={{ width: "100%" }}
              class="math-field"
            >
              {latex}
            </math-field>

            {latex && (
              <div style={{ marginTop: "20px" }}>
                <div className="math-preview-title">
                  Preview of Math equation:
                </div>
                <div className="preview-of-math-equation"></div>
              </div>
            )}
            <div className="math-footer">
              <div className="math-buttons">
                {currElement && (
                  <div className="btn" onClick={deleteNode}>
                    Delete
                  </div>
                )}
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
