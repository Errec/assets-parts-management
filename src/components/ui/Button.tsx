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
            className={`flex items-center p-2 text-white rounded-md ${
                isSelected ? 'bg-dark-blue-600 cursor-default' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            aria-label={title}
            disabled={isSelected}
            style={{ cursor: isSelected ? 'default' : 'pointer' }}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {title}
        </button>
    );
};

export default Button;
