import React, { useEffect, useRef } from "react";
import Mathlive from "mathlive"; // Import the default MathLive module

const MathField = ({ value, onChange, options = {} }) => {
  const mathFieldRef = useRef(null);

  useEffect(() => {
    // Initialize MathField using MathLive object
    const mathField = MathLive.makeMathField(mathFieldRef.current, {
      ...(onChange && { onContentDidChange: (mf) => onChange(mf.getValue()) }),
      ...options,
    });

    // Set initial value
    if (value) {
      mathField.setValue(value);
    }

    return () => {
      // Clean up MathField instance
      mathField.$dispose();
    };
  }, [value, onChange, options]);

  return <div ref={mathFieldRef} />;
};

export default MathField;
