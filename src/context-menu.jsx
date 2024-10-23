import React, { useState, useEffect, useRef } from "react";
import "./ContextMenu.css";

const ContextMenu = ({
  equationIndex,
  children,
  takeActionFromContextMenu,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef(null);
  const [index, setIndex] = useState(equationIndex);

  const handleRightClick = (event) => {
    event.preventDefault();

    // Get the bounding rectangle of the element
    const rect = event.target.getBoundingClientRect();
    const menuWidth = contextMenuRef.current?.offsetWidth || 150; // Default menu width if it's not rendered yet
    const menuHeight = contextMenuRef.current?.offsetHeight || 100; // Default height

    // Get viewport dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate position for the context menu, making sure it doesn't go offscreen
    const xPosition =
      rect.right + menuWidth > windowWidth ? rect.left - menuWidth : rect.right;
    const yPosition =
      rect.top + menuHeight > windowHeight
        ? windowHeight - menuHeight
        : rect.top;

    setMenuPosition({
      x: xPosition,
      y: yPosition,
    });

    setShowMenu(true);
  };

  const handleClickOutside = (event) => {
    // Hide menu if click is outside of the context menu
    if (
      contextMenuRef.current &&
      !contextMenuRef.current.contains(event.target)
    ) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    // Add event listener for click outside
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="context-menu-container" onContextMenu={handleRightClick}>
      {children}

      {showMenu && (
        <ul
          className="context-menu"
          style={{ top: `${30}px`, left: `${menuPosition.x}px` }}
          ref={contextMenuRef}
        >
          <li
            className="menu-item"
            onClick={() => {
              setShowMenu(false);
              takeActionFromContextMenu("edit", index);
            }}
          >
            Edit
          </li>
          <li
            className="menu-item"
            onClick={() => {
              setShowMenu(false);
              takeActionFromContextMenu("duplicate", index);
            }}
          >
            Duplicate
          </li>
          <li
            className="menu-item delete"
            onClick={() => {
              setShowMenu(false);
              takeActionFromContextMenu("delete", index);
            }}
          >
            Delete
          </li>
        </ul>
      )}
    </div>
  );
};

export default ContextMenu;
