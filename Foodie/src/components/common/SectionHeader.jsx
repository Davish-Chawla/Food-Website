import React from 'react';

const SectionHeader = ({ label, title, highlight, subtitle, align = 'center', className = '' }) => {
  const alignmentClasses = {
    center: 'text-center items-center',
    left: 'text-left items-start'
  };

  return (
    <div className={`flex flex-col mb-12 ${alignmentClasses[align]} ${className}`}>
      {label && (
        <span className="text-[var(--primary)] text-xs font-bold uppercase tracking-[0.2em] mb-4">
          — {label}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-[800] text-[var(--dark)] leading-tight">
        {title} {highlight && <span className="text-[var(--primary)]">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="text-[var(--text-secondary)] mt-4 max-w-2xl text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
