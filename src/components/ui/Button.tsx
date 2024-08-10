import React from 'react';

type ButtonProps = {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  isSelected?: boolean;
};

const Button: React.FC<ButtonProps> = ({ icon, title, onClick, isSelected }) => {
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center p-1.5 px-2 text-sm rounded-md ${
        isSelected 
          ? 'bg-blue-600 text-white' 
          : 'bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white'
      }`}
      aria-label={title}
      style={{ cursor: 'pointer' }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </button>
  );
};

export default Button;
