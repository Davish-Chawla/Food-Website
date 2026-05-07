import React from 'react';
import { motion } from 'framer-motion';
import { Users, Utensils, Star, Clock, CheckCircle2 } from 'lucide-react';

const stats = [
  { label: 'Happy Customers', value: '10,000+', icon: '👥', color: 'text-blue-500' },
  { label: 'Menu Items', value: '500+', icon: '🍽️', color: 'text-[#FF4757]' },
  { label: 'Average Rating', value: '4.8★', icon: '⭐', color: 'text-orange-500' },
  { label: 'Avg Delivery', value: '30 min', icon: '🕐', color: 'text-green-500' },
];

const AboutPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-24 min-h-screen bg-[#F8F9FA]"
    >
      {/* Hero Banner */}
      <section className="relative py-32 bg-gradient-to-br from-[#2F3542] to-[#1e222b] overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full">
           <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[120%] bg-[#FF4757]/10 rounded-full blur-[120px] rotate-45" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-[#FF4757] font-black text-xs uppercase tracking-[0.2em] mb-4">— OUR MISSION</p>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
              Our Mission is to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4757] to-[#FFA502]">
                Serve Your City Fresh Daily
              </span>
            </h1>
            <p className="text-[#747D8C] text-xl leading-relaxed font-medium mb-10">
              Founded in 2020, FoodieHub has grown from a small kitchen to the city's 
              most loved food delivery service. We believe in quality, taste, and speed.
            </p>
            <div className="flex gap-4">
               <div className="px-8 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-white font-bold">
                 Since 2020
               </div>
               <div className="px-8 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-white font-bold">
                 100+ Cities
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-center border border-gray-100 hover:scale-[1.05] transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform inline-block">
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-[#2F3542] mb-1">{stat.value}</div>
                <div className="text-[#747D8C] font-extrabold text-xs uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-[#FF4757] to-[#FFA502] rounded-[3.5rem] blur-2xl opacity-20" />
              <img 
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3" 
                alt="Chef cooking" 
                className="rounded-[3rem] shadow-2xl relative z-10 w-full object-cover h-[500px]"
              />
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-2xl z-20 hidden md:block border border-gray-100">
                <p className="text-4xl font-black text-[#FF4757]">100%</p>
                <p className="text-[#2F3542] font-extrabold text-sm uppercase">Pure Quality</p>
              </div>
            </motion.div>
            
            <div className="space-y-8">
              <div className="inline-block px-4 py-1 bg-[#FF4757]/10 text-[#FF4757] rounded-full text-xs font-black tracking-widest uppercase">
                 Our Story
              </div>
              <h2 className="text-5xl font-black text-[#2F3542] leading-tight">Every Dish Tells <br /> a <span className="text-[#FF4757]">Story</span></h2>
              <p className="text-[#747D8C] text-lg leading-relaxed font-medium">
                At FoodieHub, we don't just deliver food; we deliver experiences. Our chefs 
                hand-pick fresh ingredients every morning from local farms to ensure 
                that every bite you take is packed with flavor and nutrition.
              </p>
              <div className="space-y-4 pt-4">
                {[
                  '100% Fresh & Organic Ingredients',
                  'Fast & Contactless Delivery',
                  'Hygiene & Safety Certified'
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={24} />
                    </div>
                    <p className="text-lg font-black text-[#2F3542]">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default AboutPage;
