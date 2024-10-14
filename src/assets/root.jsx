import React from "react";

const Root = () => {
  return (
    <div className="square-root">
      <svg
        fill="#000000"
        width="30px"
        height="30px"
        viewBox="0 0 24 24"
        id="square-root-of-x"
        xmlns="http://www.w3.org/2000/svg"
        className="icon flat-line"
      >
        <line
          id="primary"
          x1="14"
          y1="12"
          x2="18"
          y2="16"
          style={{fill: "none", stroke: "rgb(0, 0, 0)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2}}
        ></line>
        <line
          id="primary-2"
          x1="18"
          y1="12"
          x2="14"
          y2="16"
          style={{fill: "none", stroke: "rgb(0, 0, 0)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2}}
        ></line>
        <path
          id="primary-3"
          d="M3,12H4.43a1,1,0,0,1,.86.49L8,17l2.79-9.29a1,1,0,0,1,1-.71H21"
          style={{fill: "none", stroke: "rgb(0, 0, 0)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2}}
        ></path>
      </svg>
    </div>
  );
};

export default Root;
