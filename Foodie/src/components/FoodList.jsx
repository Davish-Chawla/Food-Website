import React, { useEffect, useState } from 'react';
import FoodCard from './FoodCard';
import { motion } from 'framer-motion';
import { getMenuItems } from '../services/menuService';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FoodList = ({ addToCart, category = 'All', searchQuery = '', cartItems = [], updateQuantity, syncCartPrices, limit }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchFoods = async (showLoading = true) => {
      if (showLoading) setLoading(true);
      setError(null);
      try {
        const data = await getMenuItems({ category: category !== 'All' ? category : undefined, search: searchQuery });
        if (data.success && isMounted) {
          setFoods(data.data);
          if (syncCartPrices) syncCartPrices(data.data, category, searchQuery);
        } else if (isMounted) {
          setError("Failed to load menu");
        }
      } catch (err) {
        if (isMounted) setError("Failed to fetch menu items.");
      } finally {
        if (showLoading && isMounted) setLoading(false);
      }
    };
    
    fetchFoods(true);
    
    const interval = setInterval(() => fetchFoods(false), 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [category, searchQuery]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-[20px] p-4 border border-[var(--gray-2)] shadow-[var(--shadow-sm)] animate-pulse flex flex-col h-full">
            <div className="w-full h-[200px] bg-[var(--gray-2)] rounded-[12px] mb-4"></div>
            <div className="w-3/4 h-5 bg-[var(--gray-2)] rounded-full mb-2"></div>
            <div className="w-full h-4 bg-[var(--gray-2)] rounded-full mb-2"></div>
            <div className="w-2/3 h-4 bg-[var(--gray-2)] rounded-full mt-1"></div>
            <div className="mt-auto pt-6 flex justify-between items-center">
              <div className="w-16 h-6 bg-[var(--gray-2)] rounded-full"></div>
              <div className="w-9 h-9 bg-[var(--gray-2)] rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-[var(--primary)] font-[600] py-10">{error}</div>;
  }

  if (foods.length === 0) {
    return <div className="text-center text-[var(--text-secondary)] font-[600] py-10">No items found.</div>;
  }

  const displayedFoods = limit ? foods.slice(0, limit) : foods;
  const hasMore = limit && foods.length > limit;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedFoods.map((food, index) => (
        <motion.div
          key={food._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="h-full"
        >
          <FoodCard 
            food={food} 
            addToCart={addToCart} 
            cartItems={cartItems}
            updateQuantity={updateQuantity}
          />
        </motion.div>
      ))}
      
      {hasMore && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 5 * 0.1 }}
          className="h-full"
        >
          <Link 
            to="/menu" 
            className="flex flex-col items-center justify-center h-full min-h-[300px] bg-white rounded-[24px] border-2 border-dashed border-[var(--gray-3)] hover:border-[var(--primary)] hover:bg-[#FFF0F1] transition-all group p-8 text-center"
          >
            <div className="w-16 h-16 bg-[var(--gray-1)] rounded-full flex items-center justify-center mb-4 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-[20px] font-[800] text-[var(--dark-2)] mb-2">Discover More</h3>
            <p className="text-[14px] text-[var(--text-secondary)] font-[500] mb-6">Explore our full menu with {foods.length - limit} more delicious items!</p>
            <span className="text-[var(--primary)] font-[700] text-[15px] flex items-center gap-1">
              View Full Menu <ArrowRight size={16} />
            </span>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default FoodList;