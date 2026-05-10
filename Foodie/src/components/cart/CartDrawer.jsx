import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import useCart from '../../hooks/useCart';
import CartItem from './CartItem';
import Button from '../ui/Button';

const CartDrawer = () => {
  const { user } = useContext(AuthContext);
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    updateQuantity, 
    removeFromCart,
    total,
    gst,
    deliveryFee,
    grandTotal,
    cartCount
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate(user ? '/checkout' : '/login');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative h-full w-full max-w-[420px] bg-[var(--bg-light)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-[var(--gray-200)] z-10">
              <div className="flex items-center gap-4">
                <div className="bg-[var(--primary)]/10 p-2.5 rounded-2xl">
                  <ShoppingBag size={24} className="text-[var(--primary)]" />
                </div>
                <div>
                  <h2 className="text-[20px] font-black text-[var(--dark)] tracking-tight">Your Order</h2>
                  <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">{cartCount} Items Selected</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-light)] text-[var(--dark)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              <AnimatePresence mode="popLayout">
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center px-4"
                  >
                    <div className="w-32 h-32 bg-white rounded-[40px] flex items-center justify-center mb-8 shadow-xl border border-[var(--gray-100)]">
                      <ShoppingBag size={56} className="text-[var(--primary)] opacity-10" strokeWidth={1} />
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--dark)] mb-3 tracking-tight">Your cart is empty</h3>
                    <p className="text-[15px] text-[var(--text-secondary)] mb-10 max-w-[280px] leading-relaxed font-medium">
                      Looks like you haven't added anything to your cart yet.
                    </p>
                    <Button
                      onClick={() => { setIsCartOpen(false); navigate('/menu'); }}
                      size="lg"
                    >
                      Explore Our Menu
                    </Button>
                  </motion.div>
                ) : (
                  cartItems.map((item) => (
                    <CartItem 
                      key={item._id}
                      item={item}
                      updateQuantity={updateQuantity}
                      removeFromCart={removeFromCart}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="bg-white p-8 rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-[var(--gray-100)]">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[15px] font-medium text-[var(--text-secondary)]">
                    <span>Subtotal</span>
                    <span className="text-[var(--dark)] font-bold">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[15px] font-medium text-[var(--text-secondary)]">
                    <span>Delivery Fee</span>
                    <span className="text-green-600 font-bold">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[15px] font-medium text-[var(--text-secondary)]">
                    <span>GST (5%)</span>
                    <span className="text-[var(--dark)] font-bold">₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="h-[1px] bg-[var(--gray-100)] my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-[var(--dark)]">Total Amount</span>
                    <span className="text-3xl font-black text-[var(--primary)] tracking-tighter">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  className="w-full h-16 !rounded-2xl group text-lg"
                  icon={ArrowRight}
                >
                  {user ? 'Proceed to Checkout' : 'Login to Place Order'}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
