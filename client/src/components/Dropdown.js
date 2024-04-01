import React, { useEffect, useRef } from "react";

function Dropdown({ setIsOpen, children }) {
  const dropdownRef = useRef(null);
  const handleMousedown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleMousedown);

    return () => {
      document.removeEventListener("mousedown", handleMousedown);
    };
  }, []);

  return <div ref={dropdownRef}>{children}</div>;
}

export default Dropdown;
