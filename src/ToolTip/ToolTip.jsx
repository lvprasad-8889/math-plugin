import "./Tooltip.css";

const Tooltip = ({ text, children }) => {
  return (
    <div className="math-plugin-tooltip-container">
      {children}
      <div className="math-plugin-tooltip-text">{text}</div>
    </div>
  );
};

export default Tooltip;
