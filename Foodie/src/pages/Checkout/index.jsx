import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Wallet, MapPin, CheckCircle2, ArrowRight, Eye, EyeOff, Lock, ShoppingBag, Receipt, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { placeOrder } from '../../services/orderService';
import toast from 'react-hot-toast';
import useCart from '../../hooks/useCart';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/common/SectionHeader';

import Loader from '../../components/ui/Loader';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, total: subtotal, deliveryFee, gst, grandTotal: total } = useCart();
  
  // Delivery Address State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);

  // Errors & Loading State
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Formatting helpers
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    let formatted = val;
    if (val.length > 0) {
      formatted = val.match(/.{1,4}/g).join(' ').substr(0, 19);
    }
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setExpiry(val);
  };

  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').substr(0, 4);
    setCvv(val);
  };

  const validate = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "Required";
    if (!lastName.trim()) newErrors.lastName = "Required";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Valid email required";
    if (!phone.trim() || phone.replace(/\D/g, '').length !== 10) newErrors.phone = "10 digit phone required";
    if (!houseNo.trim()) newErrors.houseNo = "Required";
    if (!area.trim()) newErrors.area = "Required";
    if (!city.trim()) newErrors.city = "Required";
    if (!pincode.trim() || pincode.replace(/\D/g, '').length !== 6) newErrors.pincode = "6 digit pincode required";

    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = "16 digits required";
      if (expiry.length !== 5) newErrors.expiry = "MM/YY required";
      if (cvv.length < 3) newErrors.cvv = "3 digits required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please complete all required fields');
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.getElementsByName(firstError)[0];
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        items: cartItems,
        deliveryAddress: { firstName, lastName, email, phone, houseNo, area, city, pincode },
        paymentMethod
      };
      
      const res = await placeOrder(orderData);
      if (res.success) {
        clearCart();
        setOrderSuccess(res.order);
        toast.success('Order placed successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24 px-4 flex items-center justify-center overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white rounded-[48px] shadow-2xl p-10 md:p-16 text-center border border-[var(--gray-200)] relative z-10"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-24 h-24 bg-green-50 text-green-500 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-sm border border-green-100"
          >
            <CheckCircle2 size={56} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--dark)] mb-4 tracking-tight">Order <span className="text-[var(--primary)]">Confirmed</span></h1>
          <p className="text-[var(--text-secondary)] text-lg font-medium mb-12">Your culinary journey has begun. We'll notify you when it's out!</p>
          
          <div className="bg-[var(--bg-light)] rounded-[32px] p-8 mb-12 text-left border border-[var(--gray-200)]">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em] mb-2">Order Reference</p>
                <p className="font-black text-[var(--dark)] text-xl">#{orderSuccess.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em] mb-2">Total Paid</p>
                <p className="font-black text-[var(--primary)] text-2xl">₹{orderSuccess.total.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button onClick={() => navigate('/my-orders')} size="lg">
              View History
            </Button>
            <Button variant="dark" onClick={() => navigate('/')} size="lg">
              Return Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputClass = (error) => `w-full px-5 py-4 bg-[var(--bg-light)] rounded-2xl border-2 transition-all outline-none font-medium text-[15px] ${error ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-[var(--primary)] focus:bg-white'}`;

  return (
    <div className="min-h-screen bg-[var(--bg-light)] pt-[100px] pb-24 relative">
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex items-center justify-center"
          >
            <Loader message="Processing your order..." />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader 
            label="Final Step"
            title="Complete"
            highlight="Purchase"
            align="left"
            className="mb-0"
          />
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-[var(--gray-200)] shadow-sm">
            <ShieldCheck className="text-green-500" size={20} />
            <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">Secure Checkout</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Main Form */}
          <div className="lg:col-span-8 space-y-8">
            {/* Delivery Details */}
            <Card className="p-8 md:p-12 relative overflow-hidden" shadow="sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-[var(--bg-light)] rounded-2xl flex items-center justify-center text-[var(--primary)] shadow-sm border border-[var(--gray-100)]">
                  <MapPin size={24} />
                </div>
                <h2 className="text-2xl font-black text-[var(--dark)]">Shipping <span className="text-[var(--primary)]">Address</span></h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[11px] font-black text-[var(--gray-400)] uppercase tracking-widest mb-3 px-1">First Name</label>
                  <input name="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass(errors.firstName)} placeholder="John" />
                  {errors.firstName && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[var(--gray-400)] uppercase tracking-widest mb-3 px-1">Last Name</label>
                  <input name="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass(errors.lastName)} placeholder="Doe" />
                  {errors.lastName && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[11px] font-black text-[var(--gray-400)] uppercase tracking-widest mb-3 px-1">Email</label>
                  <input name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass(errors.email)} placeholder="john@example.com" />
                  {errors.email && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[var(--gray-400)] uppercase tracking-widest mb-3 px-1">Phone</label>
                  <input name="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').substr(0, 10))} className={inputClass(errors.phone)} placeholder="9876543210" />
                  {errors.phone && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-[var(--gray-400)] uppercase tracking-widest mb-3 px-1">Building/House Details</label>
                  <input name="houseNo" type="text" value={houseNo} onChange={e => setHouseNo(e.target.value)} className={inputClass(errors.houseNo)} placeholder="A-101, Luxury Heights" />
                  {errors.houseNo && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.houseNo}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[var(--gray-400)] uppercase tracking-widest mb-3 px-1">Street/Area</label>
                  <input name="area" type="text" value={area} onChange={e => setArea(e.target.value)} className={inputClass(errors.area)} placeholder="Main Park Avenue" />
                  {errors.area && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.area}</p>}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-[var(--gray-400)] uppercase tracking-widest mb-3 px-1">City</label>
                    <input name="city" type="text" value={city} onChange={e => setCity(e.target.value)} className={inputClass(errors.city)} placeholder="Chandigarh" />
                    {errors.city && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-[var(--gray-400)] uppercase tracking-widest mb-3 px-1">Pincode</label>
                    <input name="pincode" type="text" value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, '').substr(0, 6))} className={inputClass(errors.pincode)} placeholder="160001" />
                    {errors.pincode && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.pincode}</p>}
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Options */}
            <Card className="p-8 md:p-12 relative overflow-hidden" shadow="sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-[var(--bg-light)] rounded-2xl flex items-center justify-center text-[var(--primary)] shadow-sm border border-[var(--gray-100)]">
                  <CreditCard size={24} />
                </div>
                <h2 className="text-2xl font-black text-[var(--dark)]">Payment <span className="text-[var(--primary)]">Method</span></h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-6 rounded-3xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'card' ? 'border-[var(--primary)] bg-[var(--bg-light)] shadow-inner' : 'border-[var(--gray-100)] bg-white hover:border-[var(--gray-200)]'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'card' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-light)] text-[var(--gray-500)]'}`}>
                    <CreditCard size={22} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-[var(--dark)] text-lg leading-tight">Card</p>
                    <p className="text-[11px] text-[var(--gray-400)] font-bold uppercase tracking-wider">Fast & Secure</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-6 rounded-3xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'cod' ? 'border-[var(--primary)] bg-[var(--bg-light)] shadow-inner' : 'border-[var(--gray-100)] bg-white hover:border-[var(--gray-200)]'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-light)] text-[var(--gray-500)]'}`}>
                    <Wallet size={22} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-[var(--dark)] text-lg leading-tight">Cash</p>
                    <p className="text-[11px] text-[var(--gray-400)] font-bold uppercase tracking-wider">Pay at Door</p>
                  </div>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {paymentMethod === 'card' ? (
                  <motion.div 
                    key="card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 p-8 bg-[var(--bg-light)] rounded-3xl border border-[var(--gray-200)]"
                  >
                    <div>
                      <label className="block text-[11px] font-black text-[var(--gray-400)] uppercase tracking-widest mb-3 px-1">Card Number</label>
                      <input name="cardNumber" type="text" value={cardNumber} onChange={handleCardNumberChange} className={`w-full px-5 py-4 bg-white rounded-2xl border-2 transition-all outline-none font-medium text-[15px] ${errors.cardNumber ? 'border-red-400' : 'border-transparent focus:border-[var(--primary)]'}`} placeholder="0000 0000 0000 0000" />
                      {errors.cardNumber && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-black text-[var(--gray-400)] uppercase tracking-widest mb-3 px-1">Expiry</label>
                        <input name="expiry" type="text" value={expiry} onChange={handleExpiryChange} className={`w-full px-5 py-4 bg-white rounded-2xl border-2 transition-all outline-none font-medium text-[15px] ${errors.expiry ? 'border-red-400' : 'border-transparent focus:border-[var(--primary)]'}`} placeholder="MM/YY" maxLength={5} />
                        {errors.expiry && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.expiry}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-[var(--gray-400)] uppercase tracking-widest mb-3 px-1">CVV</label>
                        <div className="relative">
                          <input name="cvv" type={showCvv ? "text" : "password"} value={cvv} onChange={handleCvvChange} className={`w-full px-5 py-4 bg-white rounded-2xl border-2 transition-all outline-none font-medium text-[15px] pr-14 ${errors.cvv ? 'border-red-400' : 'border-transparent focus:border-[var(--primary)]'}`} placeholder="123" maxLength={4} />
                          <button type="button" onClick={() => setShowCvv(!showCvv)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)] hover:text-[var(--primary)] p-2">
                            {showCvv ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.cvv && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.cvv}</p>}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="cod"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-orange-50 rounded-3xl border border-orange-100 flex gap-6 items-center"
                  >
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                      <Lock size={28} />
                    </div>
                    <div>
                      <p className="font-black text-orange-900 text-lg">Zero-Risk Payment</p>
                      <p className="text-[14px] text-orange-700 font-medium leading-relaxed">Verify your order before paying. 100% Satisfaction Guaranteed.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-[100px] bg-[var(--dark)] rounded-[40px] text-white p-10 shadow-2xl relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--primary)] opacity-[0.05] rounded-full blur-[80px] -translate-y-1/4 translate-x-1/4" />
              
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[var(--primary)]">
                  <Receipt size={20} />
                </div>
                <h3 className="text-xl font-black tracking-tight text-white uppercase">Order Summary</h3>
              </div>

              <div className="space-y-6 mb-10 max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
                {cartItems.map(item => (
                  <div key={item._id} className="flex gap-4 items-center group">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[14px] line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest mt-1">Qty {item.quantity}</p>
                    </div>
                    <p className="font-black text-[15px] text-[var(--primary)]">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-white/10 mb-8">
                <div className="flex justify-between text-[13px] font-bold text-white/40 uppercase tracking-[0.2em]">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[13px] font-bold text-white/40 uppercase tracking-[0.2em]">
                  <span>Delivery</span>
                  <span className="text-white">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-[13px] font-bold text-white/40 uppercase tracking-[0.2em]">
                  <span>GST (5%)</span>
                  <span className="text-white">₹{gst.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-dashed border-white/20 mb-10">
                <span className="text-xl font-black">Total</span>
                <span className="text-3xl font-black text-[var(--primary)] tracking-tighter">₹{total.toLocaleString()}</span>
              </div>

              <Button
                onClick={handleSubmit}
                loading={isProcessing}
                disabled={cartItems.length === 0}
                className="w-full h-16 text-lg"
                icon={ArrowRight}
              >
                Place Order
              </Button>

              <p className="text-center text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mt-8">
                Secure 256-bit SSL Payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
