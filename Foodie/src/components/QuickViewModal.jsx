import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, ShoppingBag, Check, Plus, Minus, ShieldCheck, Truck } from 'lucide-react';

const QuickViewModal = ({ isOpen, onClose, food, addToCart, cartItems, updateQuantity }) => {
  if (!food) return null;

  const cartItem = cartItems.find(item => item._id === food._id);
  const isInCart = !!cartItem;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border border-[var(--gray-200)] hover:bg-[var(--primary)] hover:text-white transition-all group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform" />
            </button>

            {/* Left: Image Section */}
            <div className="w-full md:w-1/2 relative bg-[var(--gray-50)]">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              {food.bestseller && (
                <div className="absolute top-8 left-8 bg-[var(--primary)] text-white text-[12px] font-black px-4 py-1.5 rounded-full shadow-2xl uppercase tracking-[0.2em]">
                  Bestseller
                </div>
              )}
            </div>

            {/* Right: Content Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                {/* Title & Category */}
                <div>
                  <span className="text-[var(--primary)] font-black text-xs uppercase tracking-[0.4em] mb-3 block">
                    {food.category}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-[var(--secondary)] tracking-tighter leading-tight mb-4">
                    {food.name}
                  </h2>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                      <Star size={18} fill="#D97706" color="#D97706" />
                      <span className="font-black text-[var(--secondary)] text-[15px]">{food.rating || '4.8'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--gray-600)] font-bold text-[15px]">
                      <Clock size={18} className="text-[var(--primary)]" />
                      25-35 mins
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-lg text-[var(--gray-600)] font-medium leading-relaxed">
                  {food.description || "Experience the perfect blend of fresh ingredients and authentic flavors, crafted with passion by our master chefs."}
                </p>

                {/* Benefits / USPs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[var(--gray-50)] rounded-2xl border border-[var(--gray-200)]">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                      <Truck size={20} />
                    </div>
                    <span className="text-[13px] font-black text-[var(--secondary)] uppercase tracking-tight">Express Delivery</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[var(--gray-50)] rounded-2xl border border-[var(--gray-200)]">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="text-[13px] font-black text-[var(--secondary)] uppercase tracking-tight">Quality Insured</span>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="pt-8 border-t border-[var(--gray-100)]">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <span className="text-[var(--gray-500)] font-black text-xs uppercase tracking-[0.2em] mb-1 block">Total Price</span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-black text-[var(--secondary)]">₹{food.price}</span>
                        <span className="text-xl text-[var(--gray-400)] line-through font-bold">₹{Math.floor(food.price * 1.15)}</span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    {isInCart && (
                      <div className="flex items-center gap-5 bg-[var(--gray-100)] rounded-2xl px-3 py-2">
                        <button
                          onClick={() => updateQuantity(food._id, cartItem.quantity - 1)}
                          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[var(--secondary)] hover:text-[var(--primary)] shadow-sm transition-colors"
                        >
                          <Minus size={20} />
                        </button>
                        <span className="font-black text-[18px] text-[var(--secondary)] min-w-[20px] text-center">{cartItem.quantity}</span>
                        <button
                          onClick={() => updateQuantity(food._id, cartItem.quantity + 1)}
                          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[var(--secondary)] hover:text-[var(--primary)] shadow-sm transition-colors"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (!isInCart) addToCart(food);
                      else onClose();
                    }}
                    className={`w-full h-18 text-lg font-black uppercase tracking-widest rounded-3xl transition-all duration-500 flex items-center justify-center gap-3 group relative overflow-hidden ${
                      isInCart 
                        ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200' 
                        : 'bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/30 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                    {isInCart ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                        >
                          <Check size={16} strokeWidth={3} />
                        </motion.div>
                        <span>In Your Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={22} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                        <span>Add to Selection</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
