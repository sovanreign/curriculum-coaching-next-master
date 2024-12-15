import React, { useEffect, useState } from "react";

interface AlertProps {
  message: string;
  type: "success" | "error"; // Define types for different alert styles
  onClose: () => void; // Callback to handle closing the alert
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true); // Control visibility for animation

  // Determine styles based on the alert type
  const bgColor = type === "success" ? "bg-green-100" : "bg-orange-100";
  const borderColor =
    type === "success" ? "border-green-500" : "border-orange-500";
  const textColor = type === "success" ? "text-green-700" : "text-orange-700";

  // Auto-close the alert after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000); // Start fade-out after 3 seconds
    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  // Trigger onClose after animation ends
  useEffect(() => {
    if (!visible) {
      const animationTimer = setTimeout(onClose, 500); // Wait for animation to complete
      return () => clearTimeout(animationTimer);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`fixed right-4 top-4 z-50 shadow-lg p-4 border-l-4 rounded-lg cursor-pointer transition-opacity duration-800 ${
        visible ? "opacity-100" : "opacity-0"
      } ${bgColor} ${borderColor} ${textColor}`}
      role="alert"
      onClick={() => setVisible(false)} // Allow manual close
    >
      <p className="font-bold">{type === "success" ? "Success" : "Error"}</p>
      <p>{message}</p>
    </div>
  );
};

export default Alert;
