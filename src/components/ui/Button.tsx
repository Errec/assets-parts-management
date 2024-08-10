import React from 'react';

type ButtonProps = {
    icon: React.ReactNode;
    title: string;
    onClick?: () => void;
    isSelected?: boolean;
    disabled?: boolean; // Added this line
};

const Button: React.FC<ButtonProps> = ({ icon, title, onClick, isSelected, disabled }) => {
    return (
        <button 
            onClick={onClick} 
            className={`flex items-center p-2 text-white rounded-md ${
                isSelected || disabled ? 'bg-dark-blue-600 cursor-default' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            aria-label={title}
            disabled={isSelected || disabled}
            style={{ cursor: isSelected || disabled ? 'default' : 'pointer' }}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {title}
        </button>
    );
};

export default Button;
