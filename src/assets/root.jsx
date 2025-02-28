import React, { useEffect, useState } from "react";
import "./root.css";
import variables from "../Utils/Variables/CommunityVariables";
import useStore from "../Store/useStore";

const Root = () => {
  // variables.page.editPage || (variables.tkbPageException && insideJmp)
  const { insideJmp } = useStore();
  let [exception, setException] = useState(
    (variables.tkbPageException && insideJmp)
  );
  const [color, setColor] = useState("#747474");

  const onMouseEnter = () => {
    if (!exception) {
      setColor("#333333");
    }
  };

  const onMouseLeave = () => {
    if (!exception) {
      setColor("#747474");
    }
  };

  useEffect(() => {
    
    //  variables.page.editPage || (variables.tkbPageException && insideJmp)
    setException(
      (variables.tkbPageException && insideJmp)
    );
  }, [insideJmp]);

  useEffect(() => {
    setColor(exception ? "#000000" : "#747474");
  }, [exception]);

  return (
    <div
      className={`square-root${exception ? "add-spacing" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <svg
        fill={color}
        width={exception ? "25px" : "30px"}
        height={exception ? "22px" : "30px"}
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
          style={{
            fill: "none",
            stroke: color,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
          }}
        ></line>
        <line
          id="primary-2"
          x1="18"
          y1="12"
          x2="14"
          y2="16"
          style={{
            fill: "none",
            stroke: color,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
          }}
        ></line>
        <path
          id="primary-3"
          d="M3,12H4.43a1,1,0,0,1,.86.49L8,17l2.79-9.29a1,1,0,0,1,1-.71H21"
          style={{
            fill: "none",
            stroke: color,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
          }}
        ></path>
      </svg>
    </div>
  );
};

export default Root;
