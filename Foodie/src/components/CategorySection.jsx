import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'All', name: 'All', emoji: '🍽️' },
  { id: 'Pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'Burger', name: 'Burger', emoji: '🍔' },
  { id: 'Pasta', name: 'Pasta', emoji: '🍝' },
  { id: 'Salad', name: 'Salad', emoji: '🥗' },
  { id: 'Dessert', name: 'Dessert', emoji: '🍰' },
];

const CategorySection = ({ activeCategory, setActiveCategory }) => {
  return (
    <section className="py-12 bg-[var(--gray-1)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-[28px] font-[800] text-[var(--dark-2)] tracking-tight">What's on your mind?</h2>
        </div>

        <div className="flex overflow-x-auto pb-6 gap-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 justify-start md:justify-center">
          {categories.map((cat, i) => {
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col md:flex-row items-center gap-2 md:gap-3 px-5 py-3 md:py-3 rounded-[50px] transition-all duration-200 whitespace-nowrap shadow-[var(--shadow-sm)] border border-transparent ${
                  isActive
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-[var(--shadow-red)]'
                    : 'bg-white text-[var(--dark-2)] hover:border-[var(--primary)] hover:shadow-[var(--shadow-md)]'
                }`}
              >
                <span className="text-[28px] drop-shadow-sm">{cat.emoji}</span>
                <span className={`text-[14px] font-[600] ${isActive ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                  {cat.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
