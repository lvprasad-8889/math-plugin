import React from "react";

const Modal = ({ onClose, onInsert }) => {
  const symbols = [
    { label: "Square Root", symbol: "\\sqrt{}" },
    { label: "Integral", symbol: "\\int" },
    { label: "Derivative", symbol: "\\frac{d}{dx}" },
    { label: "Summation", symbol: "\\sum" },
    { label: "Pi", symbol: "\\pi" },
  ];

  return (
    <div className="modal-background">
      <div className="modal">
        <h2>Select a Math Symbol</h2>
        <ul>
          {symbols.map((item) => (
            <li key={item.label}>
              <button onClick={() => onInsert(item.symbol)}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
