import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Star, Clock, Check } from 'lucide-react';

const FoodCard = ({ food, addToCart, cartItems = [], updateQuantity }) => {
  const [isAdded, setIsAdded] = useState(false);
  
  const cartItem = cartItems.find(item => item._id === food._id);
  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    addToCart(food);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="premium-card group h-full flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Top-left Badge */}
        {food.bestseller && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[var(--accent)] to-[#FF8C00] text-white text-[11px] font-[700] px-2.5 py-0.5 rounded-full shadow-sm tracking-wider">
            BESTSELLER
          </div>
        )}

        {/* Top-right FSSAI Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1 rounded-[6px] shadow-sm">
          <div className={`w-[14px] h-[14px] rounded-[3px] border-[1.5px] ${food.veg ? 'border-[#2ED573]' : 'border-[#A0522D]'} flex items-center justify-center`}>
            <div className={`w-[6px] h-[6px] rounded-full ${food.veg ? 'bg-[#2ED573]' : 'bg-[#A0522D]'}`}></div>
          </div>
        </div>

        {/* Bottom-right Prep Time */}
        <div className="absolute bottom-3 right-3 bg-white px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm text-[11px] font-[600] text-[var(--dark-2)]">
          <Clock size={12} className="text-[var(--text-secondary)]" />
          <span>{food.prepTime || '20 min'}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Row 1: Title & Rating */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[16px] font-[700] text-[var(--dark-2)] line-clamp-1">
            {food.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            <Star size={12} fill="var(--accent)" color="var(--accent)" />
            <span className="text-[13px] font-[600] text-[var(--dark-2)]">{food.rating || '4.5'}</span>
          </div>
        </div>

        {/* Row 2: Description */}
        <p className="text-[13px] text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
          {food.description}
        </p>

        {/* Row 3: Price & Action */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-[20px] font-[700] text-[var(--primary)]">₹{food.price}</span>
          
          <div className="flex items-center">
            {isInCart ? (
              <div className="flex items-center gap-3 bg-[var(--gray-1)] rounded-full px-2 py-1 border border-[var(--gray-2)]">
                <button
                  onClick={() => updateQuantity(food._id, cartItem.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors active:scale-95"
                >
                  <Minus size={16} />
                </button>
                <span className="font-[600] text-[14px] text-[var(--dark-2)] min-w-[12px] text-center">{cartItem.quantity}</span>
                <button
                  onClick={() => updateQuantity(food._id, cartItem.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors active:scale-95"
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                  isAdded 
                    ? 'bg-[var(--success)] text-white' 
                    : 'bg-[var(--dark-2)] text-white hover:bg-gradient-to-r hover:from-[var(--primary)] hover:to-[var(--primary-light)] hover:scale-110 hover:shadow-[var(--shadow-red)] active:scale-95'
                }`}
              >
                {isAdded ? <Check size={18} strokeWidth={3} /> : <Plus size={20} strokeWidth={2.5} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;