"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeText?: string;
  submitText?: string;
  title: string;
  onSubmit?: () => void; // Optional submit handler for forms
  children?: React.ReactNode; // Allows passing any content into the modal
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  closeText,
  submitText,
  onSubmit,
  children,
}) => {
  useEffect(() => {
    // Disable scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      // Clean up by enabling scroll when component unmounts
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
      <div
        className="bg-white shadow-lg rounded-lg"
        style={{
          maxWidth: "90%", // Maximum width (90% of the screen width)
          maxHeight: "95vh", // Maximum height (90% of the screen height)
          width: "fit-content", // Dynamically adjusts to content width
          minWidth: "300px", // Minimum width for usability
        }}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">{title}</h2>
        </div>

        {/* Scrollable Modal Body */}
        <div
          className="px-6 py-4 overflow-y-auto"
          style={{
            maxHeight: "calc(90vh - 120px)", // Subtract header/footer height
          }}
        >
          {children}
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="bg-gray-500 mr-2 px-4 py-2 rounded-lg text-white"
          >
            {closeText ?? "Close"}
          </button>

          {onSubmit && (
            <button
              onClick={onSubmit}
              className="bg-primary-500 px-4 py-2 rounded-lg text-white"
            >
              {submitText ?? "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
