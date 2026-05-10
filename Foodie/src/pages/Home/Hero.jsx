import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, ShoppingBag, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

// Simple counter component for stats
const StatCounter = ({ end, label, icon: Icon, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white px-6 py-4 rounded-2xl flex flex-col items-center justify-center min-w-[140px] shadow-sm border border-[var(--gray-200)]"
    >
      <div className="bg-[var(--primary)]/10 p-2 rounded-full mb-2">
        <Icon size={20} className="text-[var(--primary)]" />
      </div>
      <div className="text-2xl font-bold text-[var(--dark)]">
        {count}{suffix}
      </div>
      <div className="text-[12px] text-[var(--text-secondary)] font-medium uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 bg-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[var(--bg-light)] -skew-x-12 transform origin-top-right z-0" />
      
      {/* Animated Food Particles (Floating) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0 
            }}
            animate={{ 
              y: [0, -40, 0],
              x: [0, 20, 0],
              opacity: [0, 0.4, 0],
              rotate: [0, 45, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity, 
              delay: i * 2 
            }}
            className="absolute text-3xl z-0"
          >
            {['🍕', '🍔', '🥗', '🍱', '🍦', '🍩'][i]}
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Section - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            {/* Main Content Card */}
            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-[var(--gray-100)] relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--primary)] opacity-5 blur-3xl" />
              
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
                className="relative z-10"
              >
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-light)] border border-[var(--gray-200)] rounded-full text-[var(--primary)] font-bold text-[13px] mb-8 shadow-sm"
                >
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex h-2.5 w-2.5 rounded-full bg-[var(--primary)]" 
                  />
                  Fastest Delivery in Town
                </motion.div>
                
                <motion.h1 
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="text-[44px] md:text-[60px] font-extrabold leading-[1.1] mb-6 tracking-tight text-[var(--dark)]"
                >
                  Delicious Food,<br />
                  <span className="text-[var(--primary)]">
                    Delivered Fresh
                  </span>
                </motion.h1>
                
                <motion.p 
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="text-[18px] text-[var(--text-secondary)] mb-10 max-w-[480px] font-medium leading-relaxed"
                >
                  Experience the finest flavors from your favorite restaurants, 
                  prepared by expert chefs and delivered to your doorstep in minutes.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-wrap gap-4 mb-12"
                >
                  <Button onClick={() => navigate('/menu')} size="lg" icon={ShoppingBag}>
                    Order Now
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/menu')} size="lg">
                    View Menu
                  </Button>
                </motion.div>

                {/* Stats Row */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-wrap gap-4 mt-8"
                >
                  <StatCounter end={500} label="Restaurants" icon={ShoppingBag} suffix="+" />
                  <StatCounter end={4.8} label="Rating" icon={Star} suffix="" />
                  <StatCounter end={30} label="Delivery" icon={Clock} suffix=" min" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Section - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full lg:w-1/2 relative"
          >
            {/* Rotating Gradient Border Container */}
            <div className="relative p-3 rounded-[48px] overflow-hidden group">
              {/* Rotating background layer (Framer Motion) */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] via-orange-400 to-[var(--primary)] scale-150 opacity-40 blur-xl" 
              />
              
              {/* Image itself */}
              <div className="relative z-10 bg-white rounded-[40px] overflow-hidden p-1.5 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
                  alt="Delicious Food" 
                  className="w-full aspect-[4/5] lg:aspect-square object-cover rounded-[38px] transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Fast Delivery Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
                transition={{ 
                  opacity: { delay: 1, duration: 0.5 },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -right-4 -bottom-4 bg-white p-5 rounded-[24px] shadow-2xl z-20 flex items-center gap-4 border border-[var(--gray-100)]"
              >
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
                  <Truck size={28} className="animate-bounce" />
                </div>
                <div>
                  <div className="text-[16px] font-bold text-[var(--dark)]">Fast Delivery</div>
                  <div className="text-[13px] text-[var(--text-secondary)]">Guaranteed 30 min</div>
                </div>
              </motion.div>
              
              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--primary)] rounded-full opacity-10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--primary)] rounded-full opacity-10 blur-3xl" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
