import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, BadgeCheck } from 'lucide-react';

const testimonials = [
  {
    name: 'Anjali Sharma',
    role: 'Verified Customer',
    initial: 'A',
    text: 'The best food delivery service in the city! The food is always fresh and arrives before the estimated time. Highly recommended!',
    rating: 5
  },
  {
    name: 'Rahul Verma',
    role: 'Verified Customer',
    initial: 'R',
    text: 'I love their healthy options. The salads are always fresh and the packaging is eco-friendly. Great experience every time.',
    rating: 5
  },
  {
    name: 'Priya Kapoor',
    role: 'Verified Customer',
    initial: 'P',
    text: 'FoodieHub has made my life so much easier. Working late is no problem when I can get a delicious hot meal in 20 minutes.',
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-[var(--gray-1)] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[var(--primary)] font-[700] text-[11px] uppercase tracking-wider mb-2">— TESTIMONIALS</p>
          <h2 className="text-[36px] md:text-[40px] font-[800] text-[var(--dark-2)] tracking-tight">What Our Customers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-white p-6 rounded-[20px] shadow-[var(--shadow-sm)] flex flex-col relative group hover:shadow-[var(--shadow-md)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-4 left-4 text-[var(--primary)] opacity-20">
                 <Quote size={40} fill="currentColor" />
              </div>

              <div className="flex gap-1 mb-4 relative z-10 ml-10">
                {[...Array(5)].map((_, index) => (
                  <Star 
                    key={index} 
                    size={16} 
                    fill={index < item.rating ? "var(--accent)" : "none"} 
                    color={index < item.rating ? "var(--accent)" : "var(--gray-3)"} 
                  />
                ))}
              </div>

              <p className="text-[15px] text-[var(--text-secondary)] font-[400] leading-relaxed mb-8 italic relative z-10">
                "{item.text}"
              </p>

              <div className="mt-auto flex items-center gap-3 pt-4 border-t border-[var(--gray-2)]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-[700] text-[16px] shadow-sm">
                  {item.initial}
                </div>
                <div className="flex-1">
                  <h4 className="font-[700] text-[var(--dark-2)] text-[15px] leading-tight">{item.name}</h4>
                  <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 bg-[#E6FFF4] text-[var(--success)] rounded-full text-[10px] font-[700] uppercase tracking-wider">
                    <BadgeCheck size={10} />
                    {item.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
