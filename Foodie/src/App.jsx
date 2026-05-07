import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FoodList from './components/FoodList';
import Cart from './components/Cart';
import Footer from './components/Footer';
import MostOrdered from './components/MostOrdered';
import WhyUs from './components/WhyUs';
import Testimonials from './components/Testimonials';
import ScrollToTop from './components/ScrollToTop';

// Pages
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CheckoutPage from './pages/CheckoutPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import TermsPage from './pages/TermsPage';
import OrdersPage from './pages/OrdersPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import MenuManagement from './pages/admin/MenuManagement';
import Customers from './pages/admin/Customers';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

function AppContent() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existingItem = prev.find((cartItem) => cartItem._id === item._id);
      if (existingItem) {
        return prev.map(i => i._id === item._id ? { ...i, price: item.price, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const syncCartPrices = (latestFoods, activeCategory = 'All', searchQuery = '') => {
    setCartItems(prev => {
      let changed = false;
      
      // 1. Update prices for items still present
      const updated = prev.map(cartItem => {
        const latest = latestFoods.find(f => f._id === cartItem._id);
        if (latest && latest.price !== cartItem.price) {
          changed = true;
          return { ...cartItem, price: latest.price };
        }
        return cartItem;
      });

      // 2. Remove items that are no longer available (deleted or unavailable)
      // We only do this if we are not searching (to avoid removing items just because they don't match a search)
      if (!searchQuery) {
        const final = updated.filter(cartItem => {
          // If the item matches the category we just fetched but isn't in the list, it's gone
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

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <>
      <div className="min-h-screen bg-[#F8F9FA]">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="customers" element={<Customers />} />
          </Route>

          {/* Public / Customer Routes */}
          <Route path="*" element={
            <>
              <Navbar cartItems={cartItems} setIsCartOpen={setIsCartOpen} />
              <Routes>
                <Route path="/signup" element={<PageWrapper><SignUp /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                <Route path="/" element={
                  <PageWrapper>
                    <Hero />
                    <MostOrdered addToCart={addToCart} cartItems={cartItems} updateQuantity={updateQuantity} syncCartPrices={syncCartPrices} />
                    <WhyUs />
                    <div id="food-list" className="bg-[var(--gray-1)] py-24">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                          <p className="text-[var(--primary)] font-bold text-[11px] uppercase tracking-wider mb-4">— OUR MENU</p>
                          <h2 className="text-[32px] font-[800] text-[var(--dark-2)]">Delicious <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">Selections</span></h2>
                        </div>
                        <FoodList addToCart={addToCart} category="All" cartItems={cartItems} updateQuantity={updateQuantity} syncCartPrices={syncCartPrices} limit={5} />
                      </div>
                    </div>
                    <Testimonials />
                  </PageWrapper>
                } />
                <Route path="/menu" element={<PageWrapper><MenuPage addToCart={addToCart} cartItems={cartItems} updateQuantity={updateQuantity} syncCartPrices={syncCartPrices} /></PageWrapper>} />
                <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
                <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
                <Route path="/terms" element={<PageWrapper><TermsPage /></PageWrapper>} />
                <Route path="/my-orders" element={<PageWrapper><OrdersPage /></PageWrapper>} />
                <Route path="/checkout" element={<PageWrapper><CheckoutPage cartItems={cartItems} clearCart={clearCart} /></PageWrapper>} />
              </Routes>
              
              <Cart
                isOpen={isCartOpen}
                setIsOpen={setIsCartOpen}
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
              <Footer />
            </>
          } />
        </Routes>
      </div>
      <Toaster position="top-right" />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;