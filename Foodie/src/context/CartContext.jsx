import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existingItem = prev.find((cartItem) => cartItem._id === item._id);
      if (existingItem) {
        return prev.map(i => i._id === item._id ? { ...i, price: item.price, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter((item) => item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const syncCartPrices = (latestFoods, activeCategory = 'All', searchQuery = '') => {
    setCartItems(prev => {
      let changed = false;
      const updated = prev.map(cartItem => {
        const latest = latestFoods.find(f => f._id === cartItem._id);
        if (latest && latest.price !== cartItem.price) {
          changed = true;
          return { ...cartItem, price: latest.price };
        }
        return cartItem;
      });

      if (!searchQuery) {
        const final = updated.filter(cartItem => {
          const isFromCurrentCategory = activeCategory === 'All' || cartItem.category === activeCategory;
          const stillExists = latestFoods.some(f => f._id === cartItem._id);
          if (isFromCurrentCategory && !stillExists) {
            changed = true;
            return false;
          }
          return true;
        });
        return changed ? final : prev;
      }
      return changed ? updated : prev;
    });
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      isCartOpen, 
      setIsCartOpen, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      syncCartPrices,
      total,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
