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
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Sidebar - Fixed on Desktop, Horizontal on Mobile */}
          <aside className="w-full md:w-[280px] shrink-0">
            <div className="md:sticky md:top-[120px] space-y-8">
              
              {/* Header Info - Visible on all screens, but styled for sidebar */}
              <div className="hidden md:block">
                <p className="text-[var(--primary)] font-[700] text-[11px] uppercase tracking-wider mb-2">— OUR SELECTION</p>
                <h1 className="text-[32px] font-[800] text-[var(--dark-2)] leading-tight mb-4">
                  Explore <br />Our <span className="text-[var(--primary)]">Menu</span>
                </h1>
                <p className="text-[var(--text-secondary)] text-[14px] font-[400] leading-relaxed">
                  Choose from a wide variety of cuisines made with fresh ingredients.
                </p>
              </div>

              {/* Mobile Header - Visible only on mobile */}
              <div className="md:hidden text-center mb-8">
                <p className="text-[var(--primary)] font-[700] text-[11px] uppercase tracking-wider mb-2">— OUR SELECTION</p>
                <h1 className="text-[36px] font-[800] text-[var(--dark-2)] mb-2">Explore Our <span className="text-[var(--primary)]">Menu</span></h1>
              </div>

              {/* Search Bar */}
              <div className="bg-white p-2 rounded-[20px] shadow-[var(--shadow-sm)] border border-[var(--gray-2)]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD]" size={18} />
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[var(--gray-1)] rounded-[16px] border-[1.5px] border-transparent focus:border-[var(--primary)] focus:bg-white transition-all font-[400] text-[14px] outline-none"
                  />
                </div>
              </div>

              {/* Categories Filter */}
              <div className="space-y-4">
                <h3 className="hidden md:block text-[16px] font-[700] text-[var(--dark-2)] px-2">Categories</h3>
                <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-2 pb-4 md:pb-0 no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-3 px-5 py-3 rounded-[16px] font-[600] text-[14px] whitespace-nowrap transition-all duration-300 w-full text-left ${
                        activeCategory === cat.id
                          ? 'bg-[var(--primary)] text-white shadow-[var(--shadow-red)] translate-x-1'
                          : 'bg-white text-[var(--text-secondary)] border border-[var(--gray-2)] hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-sm'
                      }`}
                    >
                      <span className="text-[18px]">{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="min-h-[600px]">
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
          </main>

        </div>
      </div>
    </div>
  );
};

export default MenuPage;
