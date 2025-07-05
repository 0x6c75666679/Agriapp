import React from "react";

const Modal = ({ isOpen, onClose, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default Modal; 