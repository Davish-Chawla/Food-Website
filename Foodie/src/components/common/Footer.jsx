import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-[var(--dark)] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-[0.05]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--primary)] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-[0.05]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/" className="inline-block">
              <span className="text-[28px] font-black tracking-tighter text-[var(--primary)] uppercase">
                Foodie<span className="text-white">Hub</span>
              </span>
            </Link>
            <p className="text-[var(--gray-400)] text-[15px] font-medium leading-relaxed max-w-[300px]">
              Bringing the city's finest flavors to your doorstep. Experience premium food delivery like never before.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-[var(--primary)] transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[18px] font-bold text-white mb-8 relative inline-block">
              Company
              <div className="absolute -bottom-2 left-0 w-8 h-[2px] bg-[var(--primary)]" />
            </h4>
            <ul className="space-y-4">
              {['Home', 'Menu', 'About Us', 'Contact', 'Terms & Conditions'].map((link) => (
                <li key={link}>
                  <Link 
                    to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(/ & /g, '-').replace(/ /g, '')}`} 
                    className="text-[var(--gray-400)] hover:text-white font-semibold text-[15px] transition-all flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[18px] font-bold text-white mb-8 relative inline-block">
              Contact Us
              <div className="absolute -bottom-2 left-0 w-8 h-[2px] bg-[var(--primary)]" />
            </h4>
            <ul className="space-y-6">
              {[
                { icon: MapPin, text: 'Rajpura, Patiala, Punjab, India' },
                { icon: Phone, text: '+91 98765 43210' },
                { icon: Mail, text: 'hello@foodiehub.com' }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300">
                    <item.icon size={18} />
                  </div>
                  <span className="text-[var(--gray-400)] font-medium text-[14px] leading-snug pt-1 group-hover:text-white transition-colors">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[18px] font-bold text-white mb-8 relative inline-block">
              Stay Updated
              <div className="absolute -bottom-2 left-0 w-8 h-[2px] bg-[var(--primary)]" />
            </h4>
            <p className="text-[var(--gray-400)] mb-6 font-medium text-[14px]">Subscribe for exclusive deals and food news.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-5 pr-14 outline-none focus:border-[var(--primary)] focus:bg-white/10 transition-all font-medium text-[14px] text-white"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center hover:bg-[var(--primary-dark)] transition-all">
                <Send size={18} className="text-white" />
              </button>
            </div>
            <div className="mt-8 flex items-center gap-4">
               <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10 opacity-60 hover:opacity-100 transition-opacity cursor-pointer" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-10 opacity-60 hover:opacity-100 transition-opacity cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[var(--gray-500)] font-semibold text-[14px]">
            © {new Date().getFullYear()} <span className="text-white">FOODIEHUB</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[var(--gray-500)] hover:text-white transition-colors text-sm font-bold">Privacy Policy</a>
            <a href="#" className="text-[var(--gray-500)] hover:text-white transition-colors text-sm font-bold">Cookies</a>
            <div className="w-[1px] h-4 bg-white/5 hidden md:block"></div>
            <p className="text-[var(--gray-500)] font-bold text-[14px] flex items-center gap-2">
              Made with <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[var(--primary)]">❤️</motion.span> in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
