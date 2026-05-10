import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-[var(--primary)] text-white',
    secondary: 'bg-[var(--gray-100)] text-[var(--text-secondary)]',
    success: 'bg-[var(--success)] text-white',
    outline: 'border border-[var(--primary)] text-[var(--primary)]',
    light: 'bg-[var(--bg-light)] text-[var(--primary)] font-bold'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
