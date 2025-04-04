import React, { useEffect } from "react";
import "./Modal.css";
import variables from "../Utils/Variables/CommunityVariables";

const Modal = ({ isOpen, onClose, keyboardVisible, children }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-size", variables.fontSize);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className={`math-modal-overlay ${
        keyboardVisible ? "keyboard-visible" : ""
      }`}
      onClick={(e) => {
        if (e.target.classList.contains("math-modal-overlay")) {
          return;
        }
        onClose();
      }}
    >
      <div className="math-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="math-modal-header">
          <div className="math-modal-title">Math Formula</div>
          <button className="math-close-btn" onClick={onClose}>
          </button>
        </div>
        {children({ openModal: () => {}, closeModal: onClose })}
      </div>
    </div>
  );
};

export default Modal;
