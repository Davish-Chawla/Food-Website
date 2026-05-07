import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FoodCard from './FoodCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMenuItems } from '../services/menuService';

const MostOrdered = ({ addToCart, cartItems = [], updateQuantity, syncCartPrices }) => {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const data = await getMenuItems({});
        if (data.success) {
          const items = data.data.filter(food => food.bestseller).slice(0, 3);
          setBestsellers(items);
          if (syncCartPrices) syncCartPrices(data.data);
        }
      } catch (error) {
        console.error("Failed to load bestsellers");
      } finally {
        setLoading(false);
      }
    };
    fetchBestsellers();
  }, []);

  return (
    <section className="py-20 bg-[var(--gray-1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <p className="text-[var(--primary)] font-[700] text-[11px] uppercase tracking-wider mb-2">— MOST ORDERED</p>
            <h2 className="text-[32px] font-[800] text-[var(--dark-2)] tracking-tight">Customer Favorites 🔥</h2>
          </div>
          <Link 
            to="/menu"
            className="flex items-center gap-1.5 text-[var(--primary)] font-[600] text-[14px] group hover:text-[var(--primary-dark)] transition-colors"
          >
            View Full Menu 
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[360px] bg-white rounded-[20px] shadow-[var(--shadow-sm)] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
          >
            {bestsellers.map((food) => (
              <motion.div
                key={food._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                }}
              >
                <FoodCard 
                  food={food} 
                  addToCart={addToCart} 
                  cartItems={cartItems}
                  updateQuantity={updateQuantity}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MostOrdered;
