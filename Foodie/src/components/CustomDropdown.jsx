import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomDropdown = ({ options, value, onChange, placeholder = 'Select option', label, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options.find(opt => opt.label === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && <label className="block text-[14px] font-[700] text-[var(--dark-2)] mb-1">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-white border border-[var(--gray-3)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all text-left ${isOpen ? 'ring-2 ring-[var(--primary)] border-[var(--primary)] shadow-sm' : 'hover:border-[var(--gray-4)]'}`}
      >
        <span className={`text-[15px] font-[600] ${selectedOption ? 'text-[var(--dark-2)]' : 'text-[#ADB5BD]'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={18} className={`text-[var(--text-secondary)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-[110] w-full bg-white border border-[var(--gray-2)] rounded-2xl shadow-xl overflow-hidden mt-1"
          >
            <div className="max-h-[240px] overflow-y-auto no-scrollbar py-2">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[14px] font-[600] transition-colors flex items-center justify-between ${value === option.value ? 'bg-[#FFF0F1] text-[var(--primary)]' : 'text-[var(--dark-2)] hover:bg-[var(--gray-1)]'}`}
                >
                  <span>{option.label}</span>
                  {option.isSpecial && <span className="text-[var(--primary)] text-[12px] font-[800]">+ Add New</span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
