import React, { useEffect } from "react";
import "./Modal.css";

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

  if (!isOpen) return null;

  return (
    <div
      className={`math-modal-overlay ${
        keyboardVisible ? "keyboard-visible" : ""
      }`}
      onClick={onClose}
    >
      <div className="math-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="math-modal-header">
          <div className="math-title">Math Formula</div>
          <button className="math-modal-close-btn" onClick={onClose}>
            <div className="math-close-btn">&times;</div>
          </button>
        </div>
        {children({ openModal: () => {}, closeModal: onClose })}
      </div>
    </div>
  );
};

export default Modal;
