import React from 'react';

type ButtonProps = {
    icon: React.ReactNode;
    title: string;
    onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ icon, title, onClick }) => {
    return (
        <button 
            onClick={onClick} 
            className="flex items-center p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            aria-label={`${title} company button`}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {title}
        </button>
    );
};

export default Button;