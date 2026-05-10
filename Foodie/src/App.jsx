import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';

// Pages
import Home from './pages/Home';
import MenuPage from './pages/Menu';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import CheckoutPage from './pages/Checkout';
import OrdersPage from './pages/Orders';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import TermsPage from './pages/Terms';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Admin Pages
import AdminLayout from './pages/Admin/layout/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import AdminOrders from './pages/Admin/Orders';
import MenuManagement from './pages/Admin/Menu';
import Customers from './pages/Admin/Customers';
import AdminMessages from './pages/Admin/Messages';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-white">
            <Routes>
              {/* Admin Routes */}
              <Route path="/Admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="menu" element={<MenuManagement />} />
                <Route path="customers" element={<Customers />} />
                <Route path="messages" element={<AdminMessages />} />
              </Route>

              {/* Public Routes */}
              <Route path="*" element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/my-orders" element={<OrdersPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/aboutus" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/terms-conditions" element={<TermsPage />} />
                  </Routes>
                  <CartDrawer />
                  <Footer />
                </>
              } />
            </Routes>
          </div>
          <Toaster position="top-right" />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;