import React, { useState, useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import "./App.css";
import Modal from "./modal";
import Katex from "katex";
import Root from "./assets/root";

function App() {
  const [latex, setLatex] = useState("");

  const mathFieldRef = useRef(null);

  useEffect(() => {
    if (mathFieldRef.current) {
      mathFieldRef.current.focus();
    }
  }, []);

  const focusMathField = () => {
    setTimeout(() => {
      if (mathFieldRef.current) {
        mathFieldRef.current.focus();
      }
    }, 100);
  };

  const handleInput = (evt) => {
    setLatex(evt.target.value.trim());
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    focusMathField();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addToTMCE = () => {
    let iframe = document.getElementById("tinyMceEditor_ifr");
    let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    let p = document.createElement("p");
    p.textContent = latex;
    p.className = "math-expression-converted";
    p.setAttribute("data-katex", latex);
    innerDoc.body.appendChild(p);
    var elements = innerDoc.querySelectorAll(".math-expression-converted");
    elements.forEach(function (element) {
      // Get the LaTeX string from the data attribute
      var latex = element.getAttribute("data-katex");
      if (latex) {
        // Clear the existing content
        element.innerHTML = "";
        try {
          // Render the LaTeX string into HTML
          Katex.render(latex, element, {
            throwOnError: false,
            displayMode: true, // Force display mode
          });
        } catch (error) {
          console.error("Error rendering KaTeX expression:", error);
        }
      }
    });
  };

  const addExpression = () => {
    if (!latex) {
      closeModal();
      return;
    }
    try {
      Katex.renderToString(latex, {
        throwOnError: true,
      });
    } catch (error) {
      alert("Math expression is invalid, please check once.");
      return;
    }

    closeModal();
    addToTMCE();
  };

  async function setUp() {
    let iframe = document.getElementById("tinyMceEditor_ifr");
    let innerDoc = iframe.contentDocument || iframe.contentWindow.document;

    async function loadCSS(href, callback) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = callback;
      await innerDoc.head.appendChild(link);
      await document.head.appendChild(link);
    }

    async function loadScript(src, callback) {
      var script = document.createElement("script");
      script.defer = true;
      script.src = src;
      script.onload = callback;
      await innerDoc.head.appendChild(script);
      await document.head.appendChild(script);
    }

    await loadCSS(
      "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/auto-render.min.js"
    );

    return innerDoc;
  }

  useEffect(() => {
    setUp();
  }, []);

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

                <BlockMath>{latex}</BlockMath>
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

      <div className="dummy" id="dummy" contentEditable={true}></div>
    </div>
  );
}

export default App;
