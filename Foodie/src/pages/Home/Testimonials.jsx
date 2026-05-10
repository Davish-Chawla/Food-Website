import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, BadgeCheck } from 'lucide-react';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';

const testimonials = [
  {
    name: 'Anjali Sharma',
    role: 'Loyal Customer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop',
    text: 'The best food delivery service in the city! The food is always fresh and arrives before the estimated time. Highly recommended!',
    rating: 5
  },
  {
    name: 'Rahul Verma',
    role: 'Food Enthusiast',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop',
    text: 'I love their healthy options. The salads are always fresh and the packaging is eco-friendly. Great experience every time.',
    rating: 5
  },
  {
    name: 'Priya Kapoor',
    role: 'Frequent Diner',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop',
    text: 'FoodieHub has made my life so much easier. Working late is no problem when I can get a delicious hot meal in 20 minutes.',
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader 
          label="Testimonials"
          title="What Our"
          highlight="Customers Say"
          subtitle="Don't just take our word for it, hear from our satisfied foodies who love our service."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="p-8 h-full flex flex-col group relative" shadow="md">
                <div className="absolute top-6 right-8 text-[var(--primary)] opacity-5 group-hover:opacity-10 transition-opacity">
                   <Quote size={60} fill="currentColor" />
                </div>

                {/* Star Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, index) => (
                    <Star 
                      key={index}
                      size={18} 
                      fill={index < item.rating ? "var(--primary)" : "none"} 
                      color={index < item.rating ? "var(--primary)" : "var(--gray-300)"} 
                    />
                  ))}
                </div>

                <p className="text-[16px] text-[var(--text-secondary)] font-medium leading-relaxed mb-8 flex-grow">
                  "{item.text}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--dark)] text-[15px] leading-tight">{item.name}</h4>
                    <div className="flex items-center gap-1 mt-1 text-[var(--text-secondary)] font-medium text-[12px]">
                      <BadgeCheck size={14} className="text-green-500" />
                      {item.role}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
