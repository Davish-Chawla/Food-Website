import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';
import Card from '../ui/Card';

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="p-4 flex gap-4" shadow="sm" hover={false}>
        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-[var(--gray-100)]">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col flex-1 justify-between py-0.5">
          <div className="flex justify-between items-start">
            <h3 className="text-[14px] font-bold text-[var(--dark)] line-clamp-1">{item.name}</h3>
            <button 
              onClick={() => removeFromCart(item._id)} 
              className="text-[var(--gray-400)] hover:text-[var(--primary)] transition-colors p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-black text-[var(--primary)]">₹{item.price}</span>
            <div className="flex items-center gap-3 bg-[var(--bg-light)] rounded-xl px-2 py-1 border border-[var(--gray-200)]">
              <button 
                onClick={() => updateQuantity(item._id, item.quantity - 1)} 
                className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-[var(--dark)] hover:text-[var(--primary)] transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="text-[14px] font-bold text-[var(--dark)] min-w-[12px] text-center">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-[var(--dark)] hover:text-[var(--primary)] transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CartItem;
