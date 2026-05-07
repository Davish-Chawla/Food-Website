import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Utensils, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Delivery in under 30 minutes to your doorstep.',
    colorClass: 'text-[var(--primary)]',
    bgClass: 'bg-[#FFF0F1]',
    borderClass: 'group-hover:border-[var(--primary)]'
  },
  {
    icon: Utensils,
    title: 'Quality Food',
    desc: 'Made with 100% fresh and organic ingredients.',
    colorClass: 'text-[#2ED573]',
    bgClass: 'bg-[#E6FFF4]',
    borderClass: 'group-hover:border-[#2ED573]'
  },
  {
    icon: Clock,
    title: '24/7 Service',
    desc: 'Ordering food was never this easy and fast.',
    colorClass: 'text-[#4A90E2]',
    bgClass: 'bg-[#E6F0FF]',
    borderClass: 'group-hover:border-[#4A90E2]'
  },
  {
    icon: ShieldCheck,
    title: '100% Hygienic',
    desc: 'Strict quality control and safety standards.',
    colorClass: 'text-[#A855F7]',
    bgClass: 'bg-[#F5E6FF]',
    borderClass: 'group-hover:border-[#A855F7]'
  }
];

const WhyUs = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-[0.03]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent)] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-[0.03]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[var(--primary)] font-[700] text-[11px] uppercase tracking-wider mb-2">— WHY CHOOSE US</p>
          <h2 className="text-[36px] md:text-[40px] font-[800] text-[var(--dark-2)] tracking-tight">
            Our <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">Secret</span> of Success
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`group bg-white p-7 rounded-[20px] shadow-[var(--shadow-sm)] border-t-[3px] border-transparent hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] transition-all duration-300 relative overflow-hidden flex flex-col ${feature.borderClass}`}
            >
              <div className={`w-14 h-14 ${feature.bgClass} ${feature.colorClass} rounded-full flex items-center justify-center mb-6`}>
                <feature.icon size={26} strokeWidth={2.5} />
              </div>
              
              <h3 className="text-[18px] font-[700] text-[var(--dark-2)] mb-3">{feature.title}</h3>
              <p className="text-[14px] text-[var(--text-secondary)] font-[400] leading-relaxed mb-6 flex-grow">{feature.desc}</p>
              
              <Link to="/about" className="flex items-center gap-1.5 text-[var(--primary)] font-[600] text-[13px] group-hover:text-[var(--primary-dark)] transition-colors mt-auto w-fit">
                Learn More <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
