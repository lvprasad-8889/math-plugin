import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./ContextMenu.css";
import useStore from "../Store/useStore";

// Make ContextMenu forwardRef so you can trigger it from outside
const ContextMenu = forwardRef((props, ref) => {
  let { triggerContextMenu } = useStore();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({...triggerContextMenu});

  useImperativeHandle(ref, () => ({
    trigger(x, y) {
      const menuWidth = 180;
      const menuHeight = 140;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let posX = x;
      let posY = y;

      if (x + menuWidth > screenWidth) posX = screenWidth - menuWidth;
      if (y + menuHeight > screenHeight) posY = screenHeight - menuHeight;

      setPosition({ x: posX, y: posY });
      setVisible(true);
    },
    hide() {
      setVisible(false);
    },
  }));

  useEffect(() => {
    const handleClick = () => setVisible(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {

  }, [triggerContextMenu.x, triggerContextMenu.y])

  return visible ? (
    <div
      className="context-menu"
      style={{ top: position.y, left: position.x, position: "absolute" }}
    >
      <ul>
        <li>
          <i className="fas fa-pen"></i>
          <span>Edit</span>
        </li>
        <li>
          <i className="fas fa-eye"></i>
          <span>Toggle Display</span>
        </li>
        <li className="delete">
          <i className="fas fa-trash"></i>
          <span>Delete</span>
        </li>
      </ul>
    </div>
  ) : null;
});

export default ContextMenu;
