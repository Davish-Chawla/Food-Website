import React, { useState, useEffect } from 'react';
import FoodList from '../components/FoodList';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { getCategories } from '../services/menuService';

const emojiMap = {
  'Pizza': '🍕',
  'Burger': '🍔',
  'Pasta': '🍝',
  'Salad': '🥗',
  'Dessert': '🍰',
  'Chicken': '🍗',
  'Beverage': '🥤',
  'Sides': '🍟'
};

const MenuPage = ({ foods = [], addToCart, cartItems = [], updateQuantity, syncCartPrices }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([{ id: 'All', name: 'All', emoji: '🍽️' }]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res.success) {
          const dynamicCats = res.data.map(cat => ({
            id: cat,
            name: cat,
            emoji: emojiMap[cat] || '🍽️'
          }));
          setCategories([{ id: 'All', name: 'All', emoji: '🍽️' }, ...dynamicCats]);
        }
      } catch (error) {
        console.error("Failed to load categories");
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="pt-[100px] min-h-screen bg-[var(--gray-1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
           <p className="text-[var(--primary)] font-[700] text-[11px] uppercase tracking-wider mb-2">— OUR SELECTION</p>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[36px] md:text-[48px] font-[800] text-[var(--dark-2)] tracking-tight mb-4"
          >
            Explore Our <span className="text-[var(--primary)]">Menu</span>
          </motion.h1>
          <p className="text-[var(--text-secondary)] text-[16px] max-w-2xl mx-auto font-[400] leading-relaxed">
            Choose from a wide variety of cuisines made with fresh ingredients and love.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 md:p-6 rounded-[24px] shadow-[var(--shadow-sm)] mb-12 flex flex-col lg:flex-row gap-5 items-center border border-[var(--gray-2)]">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ADB5BD]" size={20} />
            <input
              type="text"
              placeholder="Search for your favorite dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-[var(--gray-1)] rounded-full border-[1.5px] border-transparent focus:border-[var(--primary)] focus:bg-white transition-all font-[400] text-[15px] text-[var(--dark-2)] placeholder:text-[#ADB5BD] outline-none"
            />
          </div>
          
          <div className="flex overflow-x-auto gap-3 no-scrollbar w-full lg:w-auto pb-2 lg:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-[600] text-[14px] whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-[var(--shadow-red)]'
                    : 'bg-white text-[var(--text-secondary)] border border-[var(--gray-2)] hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-sm'
                }`}
              >
                <span className="text-[16px]">{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Food List */}
        <FoodList 
          foods={foods}
          addToCart={addToCart} 
          category={activeCategory} 
          searchQuery={searchQuery}
          cartItems={cartItems}
          updateQuantity={updateQuantity}
          syncCartPrices={syncCartPrices}
        />
      </div>
    </div>
  );
};

export default MenuPage;
