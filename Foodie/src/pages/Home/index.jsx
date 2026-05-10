import React from 'react';
import { motion } from 'framer-motion';
import Hero from './Hero';
import CustomerFavorites from './CustomerFavorites';
import WhyUs from './WhyUs';
import Testimonials from './Testimonials';
import SectionHeader from '../../components/common/SectionHeader';
import FoodGrid from '../../components/food/FoodGrid';

const Home = () => {
  return (
    <div className="bg-white">
      {/* 1. Hero Section (White Bg) */}
      <Hero />

      {/* 2. Customer Favorites (White Bg as requested) */}
      <CustomerFavorites />

      {/* 3. Why Us Section (Light Gray Bg #F8F9FA) */}
      <WhyUs />

      {/* 4. Menu Preview Section (White Bg - Alternating) */}
      <section id="food-list" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            label="Our Menu"
            title="Delicious"
            highlight="Selections"
            subtitle="Explore our curated selection of top-rated dishes, prepared fresh and delivered to you."
          />
          <FoodGrid limit={8} carousel={true} />
        </div>
      </section>

      {/* 5. Testimonials Section (Light Gray Bg - Alternating) */}
      <div className="bg-[var(--bg-light)]">
        <Testimonials />
      </div>
    </div>
  );
};

export default Home;
