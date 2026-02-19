
import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'light';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-hover focus:ring-primary text-white',
    secondary: 'bg-secondary hover:bg-purple-700 focus:ring-secondary text-white',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
    light: 'bg-neutral-200 hover:bg-neutral-300 focus:ring-neutral-400 text-neutral-800'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
