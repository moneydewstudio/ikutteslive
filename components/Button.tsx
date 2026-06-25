import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'lime' | 'purple' | 'outline' | 'ghost' | 'black';
  fullWidth?: boolean;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  withArrow?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false, 
  size = 'md',
  withArrow = false,
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none disabled:opacity-70 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-brand-black text-white hover:bg-gray-800 border border-transparent",
    black: "bg-brand-black text-white hover:bg-gray-800 border border-transparent",
    lime: "bg-brand-lime text-black border border-black hover:bg-opacity-90",
    purple: "bg-brand-purple text-black border border-black hover:bg-opacity-90",
    outline: "bg-transparent text-black border border-black hover:bg-black hover:text-white",
    ghost: "bg-transparent text-gray-600 hover:text-black hover:bg-gray-100"
  };

  const sizes = {
    sm: "px-md py-sm text-sm",
    md: "px-lg py-md text-base",
    lg: "px-2xl py-lg text-xl"
  };

  return (
    <button 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
      {withArrow && !isLoading && (
        <ArrowUpRight className="ml-2 w-5 h-5" />
      )}
    </button>
  );
};

export default React.memo(Button);