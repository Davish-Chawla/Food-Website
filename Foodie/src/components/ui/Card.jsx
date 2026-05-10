import React from 'react';

const Card = ({ children, className = '', hover = true, shadow = 'md' }) => {
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <div className={`
      rounded-[24px] border border-[var(--gray-200)] overflow-hidden
      ${!className.includes('bg-') ? 'bg-white' : ''}
      ${shadowClasses[shadow]}
      ${hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;
