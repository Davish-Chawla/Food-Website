import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Cart = ({ isOpen, setIsOpen, cartItems, updateQuantity, removeFromCart }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 49 : 0;
  const gst = subtotal * 0.05;
  const total = subtotal + deliveryFee + gst;

  const handleCheckout = () => {
    setIsOpen(false);
    navigate(user ? '/checkout' : '/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative h-full w-full max-w-[400px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--gray-2)] bg-white z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] font-[800] text-[var(--dark-2)] tracking-tight">Your Cart</h2>
                <div className="bg-[var(--primary)] text-white text-[11px] font-[700] px-2 py-0.5 rounded-full shadow-sm">
                  {cartItems.length} items
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--gray-1)] text-[var(--dark-2)] hover:bg-[#FFF0F1] hover:text-[var(--primary)] transition-colors focus:outline-none"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[var(--gray-1)]/50">
              <AnimatePresence mode="popLayout">
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full flex flex-col items-center justify-center text-center px-4 pt-20"
                  >
                    <div className="w-24 h-24 bg-[#FFF0F1] rounded-full flex items-center justify-center mb-6">
                      <ShoppingBag size={40} className="text-[var(--primary)]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[20px] font-[800] text-[var(--dark-2)] mb-2">Your cart is feeling lonely</h3>
                    <p className="text-[14px] text-[var(--text-secondary)] mb-8 max-w-[240px] leading-relaxed">Looks like you haven't added anything to your cart yet.</p>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/menu');
                      }}
                      className="bg-[var(--primary)] text-white font-[600] text-[15px] px-8 py-3 rounded-full shadow-[var(--shadow-red)] hover:bg-[var(--primary-dark)] transition-colors active:scale-95"
                    >
                      Browse Menu
                    </button>
                  </motion.div>
                ) : (
                  cartItems.map((item) => (
                    <motion.div
                      layout
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 bg-white p-3.5 rounded-[16px] shadow-[var(--shadow-sm)] border border-[var(--gray-2)] group relative pr-10"
                    >
                      <div className="w-[72px] h-[72px] shrink-0 rounded-[12px] overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1 justify-between py-0.5">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-[14px] font-[700] text-[var(--dark-2)] line-clamp-1">
                            {item.name}
                          </h3>
                        </div>
                        <div className="flex items-end justify-between mt-2">
                          <span className="text-[15px] font-[800] text-[var(--primary)]">₹{item.price}</span>
                          
                          <div className="flex items-center bg-[var(--gray-1)] rounded-full px-1 py-1 border border-[var(--gray-2)]">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-[var(--dark-2)] shadow-sm hover:text-[var(--primary)] transition-colors"
                            >
                              <Minus size={14} strokeWidth={2.5} />
                            </button>
                            <span className="w-7 text-center font-[700] text-[13px] text-[var(--dark-2)]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-[var(--dark-2)] shadow-sm hover:text-[var(--primary)] transition-colors"
                            >
                              <Plus size={14} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button (absolute) */}
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="absolute top-3 right-3 text-[var(--gray-4)] hover:text-[var(--primary)] transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="bg-white p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-[var(--gray-2)]">
                <div className="space-y-2.5 mb-5">
                  <div className="flex justify-between text-[14px] font-[500] text-[var(--text-secondary)]">
                    <span>Subtotal</span>
                    <span className="text-[var(--dark-2)] font-[600]">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[14px] font-[500] text-[var(--text-secondary)]">
                    <span>Delivery Fee</span>
                    <span className="text-[var(--dark-2)] font-[600]">₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-[14px] font-[500] text-[var(--text-secondary)]">
                    <span>GST (5%)</span>
                    <span className="text-[var(--dark-2)] font-[600]">₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-dashed border-[var(--gray-3)] mt-2">
                    <span className="text-[18px] font-[800] text-[var(--dark-2)]">Total</span>
                    <span className="text-[20px] font-[800] text-[var(--primary)]">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-[700] text-[16px] py-3.5 rounded-full shadow-[var(--shadow-red)] hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95 group"
                >
                  {user ? 'Proceed to Checkout' : 'Login to Order'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Cart;