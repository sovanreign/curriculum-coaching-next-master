import React from "react";

interface DropdownProps {
  data: { value: string; label: string }[];
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean; // New property to disable the dropdown
}

const Dropdown: React.FC<DropdownProps> = ({
  data = [],
  name,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  disabled = false, // Default to false (not disabled)
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={className}
      disabled={disabled} // Apply the disabled property
    >
      {/* Placeholder option */}
      <option value="" disabled>
        {placeholder}
      </option>
      {/* Render data options */}
      {data.map((item, index) => (
        <option key={index} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
