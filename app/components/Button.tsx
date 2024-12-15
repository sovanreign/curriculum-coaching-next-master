import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "outline"; // Added "outline" variant
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  buttonLoadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
  buttonLoadingText = "",
}) => {
  const baseStyles =
    "flex justify-center items-center px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all";

  const variantStyles = {
    primary:
      "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    // Outline styles
    outline:
      "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed";

  const combinedStyles = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${disabled || isLoading ? disabledStyles : ""} 
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={combinedStyles}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div
            className="border-2 border-white mr-2 border-t-transparent rounded-full w-4 h-4 animate-spin"
            role="status"
            aria-live="polite"
          ></div>
          {buttonLoadingText}...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
