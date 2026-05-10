import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { total } = context;
  const gst = total * 0.05;
  const deliveryFee = total > 0 ? 49 : 0;
  const grandTotal = total + gst + deliveryFee;

  return { 
    ...context, 
    gst, 
    deliveryFee, 
    grandTotal 
  };
};

export default useCart;
