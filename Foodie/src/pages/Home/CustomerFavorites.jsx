import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FoodCard from '../../components/food/FoodCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMenuItems } from '../../services/menuService';
import SectionHeader from '../../components/common/SectionHeader';
import useCart from '../../hooks/useCart';

const CustomerFavorites = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems, updateQuantity, syncCartPrices } = useCart();

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
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <SectionHeader 
            label="Most Ordered"
            title="Customer"
            highlight="Favorites 🔥"
            align="left"
            className="mb-0"
          />
          <Link 
            to="/menu"
            className="flex items-center gap-2 text-[var(--primary)] font-bold text-[15px] group bg-[var(--bg-light)] px-6 py-3 rounded-2xl hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-sm"
          >
            Explore Full Menu 
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[400px] bg-[var(--bg-light)] rounded-[24px] animate-pulse shadow-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bestsellers.map((food, i) => (
              <motion.div
                key={food._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <FoodCard 
                  food={food} 
                  addToCart={addToCart} 
                  cartItems={cartItems}
                  updateQuantity={updateQuantity}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerFavorites;
