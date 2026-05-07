import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1E2330] text-white pt-24 pb-8 overflow-hidden relative border-t-[4px] border-[var(--primary)]">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-[0.05]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent)] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 opacity-[0.05]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-1 group w-fit">
              <span className="text-[26px] font-[800] tracking-tight flex items-center">
                <span className="bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent text-[34px]">F</span>
                <span className="text-white">oodieHub</span>
              </span>
              <span className="text-[26px] -rotate-12 group-hover:rotate-0 transition-transform duration-300 ml-1">🍕</span>
            </Link>
            <p className="text-[#ADB5BD] text-[15px] font-[400] leading-relaxed max-w-[280px]">
              Bringing the city's finest flavors to your doorstep. Fresh, fast, and always delicious.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-[#ADB5BD] hover:text-white hover:bg-[var(--primary)] transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon size={18} strokeWidth={2.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[18px] font-[700] text-white mb-6">
               Company
            </h4>
            <ul className="space-y-3.5">
              {['Home', 'Menu', 'About Us', 'Contact', 'Terms & Conditions'].map((link) => (
                <li key={link}>
                  <Link 
                    to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(/ & /g, '-').replace(/ /g, '')}`} 
                    className="text-[#ADB5BD] hover:text-[var(--primary-light)] font-[500] text-[15px] flex items-center gap-2 transition-all group w-fit"
                  >
                    <ArrowRight size={14} className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="-ml-5 group-hover:ml-0 transition-all duration-300">{link}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[18px] font-[700] text-white mb-6">
               Contact Us
            </h4>
            <ul className="space-y-5">
              {[
                { icon: MapPin, text: 'Rajpura, Patiala, Punjab, India' },
                { icon: Phone, text: '+91 98765 43210' },
                { icon: Mail, text: 'hello@foodiehub.com' }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3.5 group">
                  <div className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center shrink-0 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300`}>
                    <item.icon size={16} strokeWidth={2.5} />
                  </div>
                  <span className="text-[#ADB5BD] font-[400] text-[14px] leading-snug pt-2 group-hover:text-white transition-colors">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[18px] font-[700] text-white mb-6">
               Newsletter
            </h4>
            <p className="text-[#ADB5BD] mb-5 font-[400] text-[14px] leading-relaxed">Subscribe to get latest deals and news.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-5 pr-12 outline-none focus:border-[var(--primary)] focus:bg-white/10 transition-all font-[400] text-[14px] text-white placeholder:text-[#6C757D]"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-[var(--primary)] rounded-full flex items-center justify-center hover:bg-[var(--primary-dark)] hover:scale-105 transition-all">
                <ArrowRight size={18} strokeWidth={2.5} className="text-white" />
              </button>
            </div>
            <div className="mt-8 flex items-center gap-3">
               <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-9 hover:opacity-80 transition-opacity cursor-pointer" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-9 hover:opacity-80 transition-opacity cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#6C757D] font-[400] text-[14px]">
            © {new Date().getFullYear()} FoodieHub. All rights reserved. 
          </p>
          <p className="text-[#6C757D] font-[400] text-[14px] flex items-center gap-1">
            Made with <span className="text-[var(--primary)]">❤️</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;