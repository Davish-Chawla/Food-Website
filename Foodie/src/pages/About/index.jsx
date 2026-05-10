import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Target, Heart, Award, ChevronRight, Play } from 'lucide-react';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AboutPage = () => {
  const navigate = useNavigate();
  const stats = [
    { label: 'Happy Customers', value: '50k+', icon: Users, color: 'bg-blue-50 text-blue-500' },
    { label: 'Expert Chefs', value: '150+', icon: Award, color: 'bg-orange-50 text-orange-500' },
    { label: 'Best Quality', value: '100%', icon: Heart, color: 'bg-red-50 text-red-500' },
    { label: 'Success Story', value: '10 Years', icon: Target, color: 'bg-green-50 text-green-500' },
  ];

  const team = [
    { name: 'Alex Johnson', role: 'Head Chef', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200&h=200' },
    { name: 'Sarah Miller', role: 'Operations', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200' },
    { name: 'David Chen', role: 'Quality Control', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200' },
  ];

  return (
    <div className="pt-[120px] pb-24 bg-[var(--bg-light)] overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <SectionHeader 
                label="The FoodieHub Story"
                title="Crafting Culinary"
                highlight="Excellence"
                align="left"
                subtitle="Since 2026, we've been on a mission to redefine food delivery through passion, quality, and innovation."
              />
              <div className="space-y-6 text-[17px] text-[var(--text-secondary)] font-medium leading-relaxed">
                <p>
                  What started as a small kitchen experiment in Rajpura has evolved into India's most trusted premium food destination. We believe food is more than just sustenance—it's an experience that brings people together.
                </p>
                <p>
                  Every meal we deliver is a testament to our commitment to quality. We partner only with the finest kitchens and use state-of-the-art technology to ensure your food arrives exactly as the chef intended.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button size="lg" icon={ChevronRight}>Explore Our Menu</Button>
                <button className="flex items-center gap-3 px-8 py-4 bg-white rounded-2xl font-black text-[14px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all border border-[var(--gray-200)]">
                  <div className="w-8 h-8 bg-red-50 text-[var(--primary)] rounded-full flex items-center justify-center">
                    <Play size={14} fill="currentColor" />
                  </div>
                  Our Video
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-[60px] overflow-hidden shadow-2xl z-10 border-[12px] border-white">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800" 
                  alt="Our Kitchen" 
                  className="w-full h-[500px] object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--primary)] rounded-full blur-[80px] opacity-20" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-20" />
              <div className="absolute top-1/2 -right-6 w-32 h-32 bg-white rounded-3xl shadow-2xl z-20 flex flex-col items-center justify-center -rotate-12">
                <span className="text-3xl font-black text-[var(--primary)]">10+</span>
                <span className="text-[10px] font-black uppercase text-[var(--gray-400)] tracking-widest">Awards</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                  <stat.icon size={28} />
                </div>
                <h4 className="text-3xl font-black text-[var(--dark)] mb-2 tracking-tighter">{stat.value}</h4>
                <p className="text-[12px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader 
            label="Meet the Team"
            title="Our Professional"
            highlight="Culinary Experts"
            subtitle="The talented individuals who bring magic to every plate."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            {team.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group text-center"
              >
                <div className="relative w-48 h-48 mx-auto mb-8">
                  <div className="absolute inset-0 bg-[var(--primary)] rounded-[40px] rotate-6 group-hover:rotate-12 transition-transform opacity-10" />
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="absolute inset-0 w-full h-full object-cover rounded-[40px] shadow-xl border-4 border-white"
                  />
                </div>
                <h4 className="text-xl font-black text-[var(--dark)] mb-1">{member.name}</h4>
                <p className="text-[12px] font-black text-[var(--primary)] uppercase tracking-widest">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <Card className="max-w-5xl mx-auto p-12 lg:p-20 !bg-[var(--dark)] relative overflow-hidden text-center" shadow="lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] rounded-full blur-[100px] opacity-10 -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 space-y-8">
            <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tighter max-w-2xl mx-auto">
              Ready to Experience the Best Food in Town?
            </h3>
            <p className="text-white/60 font-medium text-lg max-w-xl mx-auto">
              Join thousands of happy foodies and discover why FoodieHub is the #1 choice for premium delivery.
            </p>
            <div className="flex justify-center pt-4">
              <Button onClick={() => navigate('/menu')} size="lg" className="h-16 px-12 text-lg">See Menu</Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default AboutPage;
