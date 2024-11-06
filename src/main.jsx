import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("tiny_mce_math_plugin")).render(<App />);


setTimeout(() => {
    const createdMathButton = document.getElementById("tiny_mce_math_plugin");
    const toolbarContainer = document.querySelector("#mceu_0-button");

    toolbarContainer.insertAdjacentElement("beforebegin", createdMathButton);

    document.querySelector("#mceu_0").style.display = "flex";
  }, 1500);