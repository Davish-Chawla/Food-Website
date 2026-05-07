import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu, X, ChevronDown, ShoppingBag, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ cartItems, setIsCartOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useContext(AuthContext);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Cart bounce animation trigger
  useEffect(() => {
    if (totalItems > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white border-b border-[var(--gray-2)] h-[70px] flex items-center ${
        isScrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.08)]' : ''
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 group">
            <span className="text-[22px] font-extrabold tracking-tight flex items-center">
              <span className="bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent text-3xl">F</span>
              <span className="text-[var(--dark)]">oodieHub</span>
            </span>
            <span className="text-[22px] -rotate-12 group-hover:rotate-0 transition-transform duration-300 ml-1">🍕</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative group py-2 flex flex-col items-center"
                >
                  <span className={`text-[15px] font-[500] transition-colors duration-200 ${
                    isActive ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--primary)]'
                  }`}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1.5 w-[4px] h-[4px] rounded-full bg-[var(--primary)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-5">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 rounded-full bg-[var(--gray-1)] border border-[var(--gray-2)] flex items-center justify-center text-[var(--dark-2)] hover:text-[var(--primary)] hover:border-[var(--primary-light)] transition-all"
            >
              <ShoppingCart size={20} strokeWidth={2.5} />
              {totalItems > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 bg-[var(--primary)] text-white rounded-full min-w-[20px] h-[20px] px-1.5 flex items-center justify-center text-[11px] font-bold shadow-sm ${cartBounce ? 'animate-pulse-badge' : ''}`}>
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 group focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFA502] to-[#FF7E00] flex items-center justify-center text-white font-bold text-[16px] shadow-sm shadow-orange-200 group-hover:shadow-md transition-shadow">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={14} className={`text-[var(--text-secondary)] transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-[16px] shadow-[var(--shadow-lg)] border border-[var(--gray-2)] overflow-hidden py-2"
                    >
                      <div className="px-5 py-3 border-b border-[var(--gray-2)] mb-1 bg-[var(--gray-1)]/50">
                        <p className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-0.5">Signed in as</p>
                        <p className="text-[14px] font-bold text-[var(--dark)] truncate">{user.name}</p>
                      </div>
                      
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="w-full flex items-center gap-3 px-5 py-2.5 text-[14px] font-[500] text-[var(--text-primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors"
                        >
                          <ShieldCheck size={18} className="text-[var(--text-secondary)]" />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <Link
                        to="/my-orders"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-[14px] font-[500] text-[var(--text-primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors border-b border-[var(--gray-2)] mb-1"
                      >
                        <ShoppingBag size={18} className="text-[var(--text-secondary)]" />
                        My Orders
                      </Link>
                      
                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-[14px] font-[600] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors"
                      >
                        <LogOut size={18} className="text-[var(--text-secondary)]" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full border-[1.5px] border-[var(--primary)] text-[var(--primary)] font-semibold text-[14px] hover:bg-[var(--primary)] hover:text-white transition-all duration-200 active:scale-95"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-semibold text-[14px] hover:shadow-[var(--shadow-red)] hover:scale-[1.03] transition-all duration-300 active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-[var(--dark-2)] bg-[var(--gray-1)] rounded-full focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[70px] left-0 w-full md:hidden bg-white border-b border-[var(--gray-2)] shadow-[var(--shadow-md)] overflow-hidden"
          >
            <div className="flex flex-col py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-6 py-4 text-[16px] font-[600] ${
                    location.pathname === link.path ? 'text-[var(--primary)] bg-[var(--primary)]/5 border-l-4 border-[var(--primary)]' : 'text-[var(--text-primary)] border-l-4 border-transparent'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <div className="p-6 grid grid-cols-2 gap-4 border-t border-[var(--gray-2)] mt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-full border-[1.5px] border-[var(--primary)] text-[var(--primary)] font-semibold text-[15px]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-semibold text-[15px] shadow-[var(--shadow-red)]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;