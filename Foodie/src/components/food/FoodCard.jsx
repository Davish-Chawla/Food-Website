import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Star, Eye, ShoppingBag, Check } from 'lucide-react';
import QuickViewModal from '../QuickViewModal';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const FoodCard = ({ food, addToCart, cartItems = [], updateQuantity }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const cartItem = cartItems.find(item => item._id === food._id);
  const isInCart = !!cartItem;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(food);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-full"
      >
        <Card className="flex flex-col h-full group relative" hover={true} shadow="md">
          {/* Image Section */}
          <div className="relative h-[220px] overflow-hidden">
            <motion.img
              src={food.image}
              alt={food.name}
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full object-cover"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {food.bestseller && (
                <Badge variant="primary" className="shadow-lg uppercase tracking-wider py-1 px-3">
                  Best Seller
                </Badge>
              )}
              <Badge variant="light" className="shadow-sm uppercase py-1 px-3">
                {food.category}
              </Badge>
            </div>

            {/* Price Tag (Floating) */}
            <div className="absolute bottom-4 right-4 z-10">
               <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-xl border border-white/50">
                  <span className="text-[18px] font-black text-[var(--primary)]">₹{food.price}</span>
               </div>
            </div>

            {/* Hover Overlay */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-20"
                >
                  <Button 
                    variant="white" 
                    size="sm" 
                    icon={Eye} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsQuickViewOpen(true);
                    }}
                  >
                    Quick View
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content Area */}
          <div className="p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-[var(--dark)] line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                {food.name}
              </h3>
              <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-xl">
                <Star size={14} className="fill-orange-400 text-orange-400" />
                <span className="text-sm font-bold text-orange-700">{food.rating || '4.5'}</span>
              </div>
            </div>

            <p className="text-[14px] text-[var(--text-secondary)] mb-6 line-clamp-2 leading-relaxed">
              {food.description}
            </p>

            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[var(--gray-400)] line-through">₹{Math.floor(food.price * 1.15)}</span>
                <span className="text-[13px] font-bold text-green-600">15% OFF</span>
              </div>

              {/* Add to Cart Controls */}
              <div className="flex items-center">
                {isInCart ? (
                  <div className="flex items-center gap-3 bg-[var(--gray-100)] rounded-2xl p-1">
                    <button
                      onClick={() => updateQuantity(food._id, cartItem.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-[var(--dark)] hover:text-[var(--primary)] shadow-sm transition-all"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-[15px] text-[var(--dark)] min-w-[20px] text-center">{cartItem.quantity}</span>
                    <button
                      onClick={() => updateQuantity(food._id, cartItem.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-[var(--dark)] hover:text-[var(--primary)] shadow-sm transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className={`w-11 h-11 !rounded-2xl p-0 ${isAdded ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    onClick={handleAddToCart}
                  >
                    {isAdded ? <Check size={20} /> : <ShoppingBag size={20} />}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick View Modal */}
      <QuickViewModal 
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        food={food}
        addToCart={addToCart}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
      />
    </>
  );
};

export default FoodCard;
