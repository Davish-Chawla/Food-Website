import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Utensils, ChefHat, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Delivery in under 30 minutes to your doorstep.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Utensils,
    title: 'Quality Food',
    desc: 'Made with 100% fresh and organic ingredients.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: ChefHat,
    title: 'Expert Chefs',
    desc: 'Prepared by world-class culinary professionals.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    desc: 'Strict quality control and safety standards.',
    color: 'bg-red-100 text-red-600',
  }
];

const WhyUs = () => {
  return (
    <section className="py-24 bg-[var(--bg-light)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader 
          label="Why Choose Us"
          title="Our Secret of"
          highlight="Success"
          subtitle="We provide the best quality food and fastest delivery service in the city, ensuring a delightful experience every time."
        />

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="p-10 flex flex-col items-center text-center h-full hover:border-[var(--primary)] transition-colors duration-500">
                {/* Feature Icon */}
                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-8 shadow-sm`}>
                  <feature.icon size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-[var(--dark)] mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-[15px] text-[var(--text-secondary)] font-normal leading-relaxed mb-8 flex-grow">
                  {feature.desc}
                </p>
                
                <Link 
                  to="/about" 
                  className="group inline-flex items-center text-sm font-bold text-[var(--primary)] uppercase tracking-widest"
                >
                  Learn More
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
