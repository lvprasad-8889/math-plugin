import React, { useEffect } from "react";
import Root from "../assets/root";

import useStore from "../Store/useStore";
import Tooltip from "../ToolTip/ToolTip";

import variables from "../Utils/Variables/CommunityVariables";
import mathUtils from "../Utils/MathUtils";

const InternalApp = () => {
  const { openMathPlugin, hasMathPluginRole } = useStore();

  const internalMathButtonClicked = () => {
    openMathPlugin();
  };

  useEffect(() => {
    try {
      if (hasMathPluginRole && variables.prod && tinymce && tinymce.activeEditor) {
        setTimeout(() => {
          tinymce.activeEditor.getBody().innerHTML =
            tinymce.activeEditor.getBody().innerHTML;
        }, 100);
      }
      if (!hasMathPluginRole) {
        if (variables.prod && tinymce && tinymce.activeEditor) {
          activeEditor.getBody().innerHTML =
            tinymce.activeEditor.getBody().innerHTML;
        }
        let innerDoc = mathUtils.getInnerDoc();
        if (innerDoc) {
          innerDoc
            .querySelectorAll(".math-equation")
            .forEach(async (element) => {
              mathUtils.removeDraggedMathEquations(innerDoc);
              mathUtils.setAttributeForMathElement(element);
              mathUtils.addShadowRootToTheDom(element, true);
            });
        }
      }
    } catch (err) {}
  }, [hasMathPluginRole]);

  return (
    (hasMathPluginRole || !variables.prod) && (
      <div onClick={internalMathButtonClicked}>
        <Tooltip text="Insert math">
          <Root></Root>
        </Tooltip>
      </div>
    )
  );
};

export default InternalApp;
