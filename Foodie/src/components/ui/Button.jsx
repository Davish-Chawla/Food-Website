import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary',  // primary | outline | ghost | dark
  size = 'md',          // sm | md | lg
  loading = false,
  className = '',
  icon: Icon,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--primary)] text-white shadow-[var(--shadow-red)] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
    outline: 'border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white',
    ghost: 'text-[var(--primary)] hover:bg-[var(--gray-100)]',
    dark: 'bg-[var(--dark)] text-white hover:bg-black',
    white: 'bg-white text-[var(--dark)] shadow-md hover:shadow-lg'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon && <Icon className={`${children ? 'mr-2' : ''} size-5`} />}
      {children}
    </button>
  );
};

export default Button;
