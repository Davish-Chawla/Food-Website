import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronRight } from 'lucide-react';
import { getCategories } from '../../services/menuService';
import FoodGrid from '../../components/food/FoodGrid';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([{ id: 'All', name: 'All' }]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setIsLoading(true);
        const res = await getCategories();
        if (res.success) {
          const dynamicCats = res.data.map(cat => ({
            id: cat,
            name: cat
          }));
          setCategories([{ id: 'All', name: 'All' }, ...dynamicCats]);
        }
      } catch (error) {
        console.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="pt-[100px] min-h-screen bg-[var(--bg-light)] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-[100px] space-y-8">
              <Card className="p-8" shadow="sm">
                <SectionHeader 
                  title="Our"
                  highlight="Menu"
                  align="left"
                  className="mb-8"
                />
                
                {/* Search Box */}
                <div className="relative group mb-8">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-[var(--bg-light)] rounded-2xl border-2 border-transparent focus:border-[var(--primary)] focus:bg-white transition-all font-medium text-[15px] outline-none shadow-sm"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2 mb-4">
                    <h3 className="text-[14px] font-black text-[var(--dark)] uppercase tracking-[0.2em]">Categories</h3>
                    <Filter size={16} className="text-[var(--gray-400)]" />
                  </div>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center justify-between w-full px-6 py-4 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all duration-300 ${
                          activeCategory === cat.id
                            ? 'bg-[var(--dark)] text-white shadow-xl translate-x-2'
                            : 'bg-white text-[var(--text-secondary)] hover:bg-[var(--bg-light)] hover:text-[var(--primary)]'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {activeCategory === cat.id ? (
                          <div className="w-2 h-2 bg-[var(--primary)] rounded-full shadow-[0_0_10px_var(--primary)]" />
                        ) : (
                          <ChevronRight size={16} className="opacity-20" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </aside>

          {/* Mobile Filter Bar */}
          <div className="lg:hidden sticky top-[70px] z-30 bg-[var(--bg-light)]/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-[var(--gray-200)]">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl border border-[var(--gray-200)] flex items-center justify-center text-[var(--dark)] shadow-sm"
              >
                <Filter size={20} />
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${
                    activeCategory === cat.id
                      ? 'bg-[var(--dark)] text-white border-[var(--dark)]'
                      : 'bg-white text-[var(--text-secondary)] border-[var(--gray-200)]'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1">
            {isLoading ? (
              <div className="py-20">
                <Loader message="Discovering delicious flavors..." />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory + searchQuery}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <FoodGrid 
                    category={activeCategory} 
                    searchQuery={searchQuery}
                    carousel={false}
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </main>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-white z-[101] lg:hidden p-8 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-[var(--dark)] uppercase tracking-tighter">Filters</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2.5 bg-[var(--bg-light)] rounded-2xl text-[var(--dark)]">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-10">
                <div>
                  <h3 className="text-[12px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em] mb-4">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" size={18} />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-4 bg-[var(--bg-light)] rounded-2xl border-none font-medium text-[15px] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-[12px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em] mb-4">Categories</h3>
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl font-bold text-[16px] transition-all ${
                          activeCategory === cat.id
                            ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20'
                            : 'bg-[var(--bg-light)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{cat.emoji}</span>
                          <span>{cat.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
