import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import "//unpkg.com/mathlive";
import "./App.css";

function App() {
  const [latex, setLatex] = useState(""); // State to store LaTeX input

  // Handler for input changes in the MathfieldElement
  const handleInput = (evt) => {
    setLatex(evt.target.value); // Update LaTeX input as user types
  };


  return (
    <div className="App">
      <h2>Math Editor</h2>
      
      {/* Mathlive Input Field */}
      <math-field 
        onInput={handleInput} 
        style={{width: "100%"}}
      >
        {latex}
      </math-field>

      {/* Button to show rendered expression (optional) */}
      <div style={{ marginTop: '20px' }}>
        <h3>Rendered Math Expression:</h3>
        
        {/* Render the LaTeX expression using react-katex */}
        <BlockMath>{latex}</BlockMath>
      </div>
    </div>
  );
}

export default App;
