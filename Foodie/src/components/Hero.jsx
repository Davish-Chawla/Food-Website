import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

// Simple counter hook for stats
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end); // ensure exact end
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  
  return count;
};

const Hero = () => {
  const dishesCount = useCountUp(500);
  
  return (
    <section className="relative min-h-screen pt-[120px] pb-16 overflow-hidden bg-white flex items-center">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-[var(--primary)] rounded-full blur-3xl opacity-[0.03]" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-[var(--accent)] rounded-full blur-3xl opacity-[0.03]" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Column (55%) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF0F1] rounded-full text-[var(--primary)] font-semibold text-[13px] mb-6">
              <span className="text-[16px]">🚀</span>
              Fast Delivery in 30 mins
            </div>
            
            {/* Main Headline */}
            <h1 className="text-[44px] md:text-[52px] font-[800] text-[var(--dark-2)] leading-[1.15] mb-6 tracking-tight">
              Delicious Food,<br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] ml-2 lg:ml-0">
                Delivered Fresh
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-[16px] text-[var(--text-secondary)] mb-10 max-w-[420px] font-[400] leading-relaxed">
              Experience the finest flavors delivered straight to your doorstep. 
              Quality ingredients, expert chefs, and lightning-fast delivery.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12 justify-center lg:justify-start">
              <Link to="/menu" className="flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-[600] rounded-full h-[52px] px-8 shadow-[var(--shadow-red)] hover:scale-[1.03] transition-transform duration-300 active:scale-95 group">
                Order Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/menu" className="flex items-center justify-center border-2 border-[var(--gray-3)] text-[var(--dark-2)] font-[600] rounded-full h-[52px] px-8 hover:bg-[var(--dark-2)] hover:border-[var(--dark-2)] hover:text-white transition-all duration-300 active:scale-95">
                View Menu
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-8 justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <div className="text-[28px] font-[800] text-[var(--dark-2)] leading-none mb-1">{dishesCount}+</div>
                <div className="text-[13px] text-[var(--text-secondary)] font-[500]">Dishes</div>
              </div>
              <div className="w-[1px] h-[40px] bg-[var(--gray-3)]"></div>
              <div className="text-center lg:text-left">
                <div className="text-[28px] font-[800] text-[var(--dark-2)] leading-none mb-1">4.8<span className="text-[var(--accent)] text-[22px]">★</span></div>
                <div className="text-[13px] text-[var(--text-secondary)] font-[500]">Rating</div>
              </div>
              <div className="w-[1px] h-[40px] bg-[var(--gray-3)]"></div>
              <div className="text-center lg:text-left">
                <div className="text-[28px] font-[800] text-[var(--dark-2)] leading-none mb-1">30 <span className="text-[18px]">min</span></div>
                <div className="text-[13px] text-[var(--text-secondary)] font-[500]">Delivery</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column (45%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-[45%] relative mt-12 lg:mt-0"
          >
            {/* Background Blob behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-square bg-[var(--primary)] rounded-full blur-[80px] opacity-10 z-0"></div>
            
            <div className="relative z-10 w-full max-w-[500px] mx-auto aspect-square">
              {/* Main Image */}
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
                alt="Delicious Food" 
                className="w-full h-full object-cover rounded-[24px] shadow-[var(--shadow-lg)]"
              />

              {/* Floating Card 1: High Rated */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-6 top-12 bg-white p-3 pr-5 rounded-[16px] shadow-[var(--shadow-md)] flex items-center gap-3 border border-[var(--gray-2)]"
              >
                <div className="w-10 h-10 bg-[#FFF0F1] rounded-full flex items-center justify-center text-[var(--primary)]">
                  <Star size={20} fill="currentColor" />
                </div>
                <div>
                  <div className="text-[14px] font-[700] text-[var(--dark-2)] leading-tight">High Rated</div>
                  <div className="text-[12px] text-[var(--text-secondary)] font-[500]">Top 1% Dishes</div>
                </div>
              </motion.div>

              {/* Floating Card 2: Fast Service */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-6 bottom-16 bg-white p-3 pr-5 rounded-[16px] shadow-[var(--shadow-md)] flex items-center gap-3 border border-[var(--gray-2)]"
              >
                <div className="w-10 h-10 bg-[#E6FFF4] rounded-full flex items-center justify-center text-[var(--success)]">
                  <span className="text-[20px]">🛵</span>
                </div>
                <div>
                  <div className="text-[14px] font-[700] text-[var(--dark-2)] leading-tight">Fast Service</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></div>
                    <div className="text-[12px] text-[var(--text-secondary)] font-[500]">Delivery in 30 min</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;