import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, ChevronDown, ShoppingBag, ShieldCheck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import useCart from '../../hooks/useCart';
import Button from '../ui/Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 h-[70px] flex items-center border-b bg-white ${
        isScrolled 
          ? 'border-[var(--gray-200)] shadow-md' 
          : 'border-transparent'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center w-full">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 group">
            <span className="text-[24px] font-black tracking-tighter text-[var(--primary)] uppercase">
              Foodie<span className="text-[var(--dark)]">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative group py-2"
                >
                  <span className={`text-[14px] font-bold transition-colors duration-200 ${
                    isActive ? 'text-[var(--primary)]' : 'text-[var(--dark)] hover:text-[var(--primary)]'
                  }`}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 w-full h-[2px] bg-[var(--primary)] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[var(--dark)] hover:text-[var(--primary)] transition-colors"
            >
              <ShoppingBag size={22} strokeWidth={2.5} />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-[var(--primary)] text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold shadow-lg"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Auth/User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-1.5 py-1.5 rounded-full hover:bg-[var(--gray-100)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--dark)] flex items-center justify-center text-white font-bold text-[13px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={14} className={`text-[var(--gray-600)] transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-[var(--gray-200)] overflow-hidden py-2"
                    >
                      <div className="px-5 py-3 border-b border-[var(--gray-100)] mb-1">
                        <p className="text-[10px] font-bold text-[var(--gray-400)] uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="text-[14px] font-bold text-[var(--dark)] truncate">{user.name}</p>
                      </div>
                      
                      {isAdmin && (
                        <Link to="/Admin" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-[14px] font-bold text-[var(--dark)] hover:text-[var(--primary)] hover:bg-[var(--gray-50)] transition-all">
                          <ShieldCheck size={18} /> Admin Panel
                        </Link>
                      )}
                      <Link to="/my-orders" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-[14px] font-bold text-[var(--dark)] hover:text-[var(--primary)] hover:bg-[var(--gray-50)] transition-all">
                        <ShoppingBag size={18} /> My Orders
                      </Link>
                      <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-[14px] font-bold text-[var(--primary)] hover:bg-red-50 transition-all border-t border-[var(--gray-100)]"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className="text-[14px] font-bold text-[var(--dark)] hover:text-[var(--primary)] transition-colors">
                  Login
                </Link>
                <Button onClick={() => navigate('/signup')} size="sm">
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[var(--dark)]"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-[280px] bg-white z-[101] md:hidden p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-black text-[var(--primary)] uppercase tracking-tighter">FoodieHub</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-[var(--gray-100)] rounded-full text-[var(--dark)]">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[18px] font-bold text-[var(--dark)] hover:text-[var(--primary)]"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {!user && (
                <div className="mt-auto space-y-4">
                  <Button variant="outline" className="w-full" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}>
                    Login
                  </Button>
                  <Button className="w-full" onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}>
                    Sign Up
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
