import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getMenuItems } from '../../services/menuService';
import useCart from '../../hooks/useCart';
import FoodCard from './FoodCard';
import Button from '../ui/Button';

const FoodGrid = ({ category = 'All', searchQuery = '', limit, carousel = true }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const { addToCart, cartItems, updateQuantity, syncCartPrices } = useCart();

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
    return () => {
      isMounted = false;
    };
  }, [category, searchQuery]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[var(--bg-light)] rounded-[24px] h-[400px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) return <div className="text-center text-[var(--primary)] font-bold py-10">{error}</div>;
  if (foods.length === 0) return <div className="text-center text-[var(--text-secondary)] font-bold py-10">No items found.</div>;

  const displayedFoods = limit ? foods.slice(0, limit) : foods;
  const hasMore = limit && foods.length > limit;

  return (
    <div className="relative group/carousel">
      {/* Navigation Arrows */}
      {carousel && foods.length > 3 && (
        <>
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white border border-[var(--gray-200)] flex items-center justify-center text-[var(--dark)] shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-[var(--primary)] hover:text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white border border-[var(--gray-200)] flex items-center justify-center text-[var(--dark)] shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-[var(--primary)] hover:text-white"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Grid/Carousel Container */}
      <div 
        ref={scrollRef}
        className={`
          ${carousel ? 'flex overflow-x-auto scrollbar-hide gap-8 pb-10 snap-x snap-mandatory' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'}
        `}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayedFoods.map((food, index) => (
          <div
            key={food._id}
            className={`${carousel ? 'min-w-[300px] md:min-w-[340px] snap-start' : 'w-full'}`}
          >
            <FoodCard 
              food={food} 
              addToCart={addToCart} 
              cartItems={cartItems}
              updateQuantity={updateQuantity}
            />
          </div>
        ))}
        
        {hasMore && (
          <div className={`${carousel ? 'min-w-[300px] md:min-w-[340px] snap-start' : 'w-full'} h-full`}>
            <Link 
              to="/menu" 
              className="flex flex-col items-center justify-center h-full min-h-[420px] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-[24px] shadow-xl hover:shadow-2xl transition-all group p-10 text-center relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-md group-hover:scale-110 transition-transform">
                <Plus size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-4">Discover More</h3>
              <p className="text-white/80 font-medium mb-10 leading-relaxed">
                Explore our full menu with {foods.length - limit} more delicious items!
              </p>
              <span className="bg-white text-[var(--primary)] px-8 py-3.5 rounded-2xl font-bold text-[15px] flex items-center gap-2 shadow-lg group-hover:bg-[var(--dark)] group-hover:text-white transition-colors">
                View Full Menu <ArrowRight size={20} />
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* Pagination Dots (Visual only) */}
      {carousel && (
        <div className="flex justify-center gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? 'w-8 bg-[var(--primary)]' : 'w-2 bg-[var(--gray-300)]'}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodGrid;
