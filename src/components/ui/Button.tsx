import React from 'react';

type ButtonProps = {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string; // Optional additional styles
  selectedStyles?: string; // Optional styles when selected
  defaultStyles?: string; // Optional styles when not selected
};

const Button: React.FC<ButtonProps> = ({ 
  icon, 
  title, 
  onClick, 
  isSelected = false, 
  className = '', 
  selectedStyles = 'bg-blue-600 text-white', 
  defaultStyles = 'bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white' 
}) => {
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center p-1.5 px-2 text-sm rounded-md transition-colors duration-300 ${
        isSelected ? selectedStyles : defaultStyles
      } ${className}`} // Apply additional className if provided
      aria-label={title}
      style={{ cursor: 'pointer' }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </button>
  );
};

export default Button;
