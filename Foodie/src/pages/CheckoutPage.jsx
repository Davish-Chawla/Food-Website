import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, MapPin, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/orderService';
import toast from 'react-hot-toast';

const CheckoutPage = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();
  
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
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'cod'
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);

  // Errors & Loading State
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 49 : 0;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + gst;

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
      if (expiry.length !== 5 || parseInt(expiry.split('/')[0]) > 12 || parseInt(expiry.split('/')[0]) < 1) newErrors.expiry = "Valid MM/YY required";
      if (cvv.length < 3) newErrors.cvv = "3-4 digits required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
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
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[var(--gray-1)] pt-32 pb-24 px-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-white rounded-[24px] shadow-[var(--shadow-lg)] p-8 md:p-12 text-center border border-[var(--gray-2)]"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="w-24 h-24 bg-[#E6FFF4] text-[var(--success)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"
          >
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-[32px] md:text-[36px] font-[800] text-[var(--dark-2)] tracking-tight mb-3">Order Placed Successfully!</h1>
          <p className="text-[var(--text-secondary)] text-[16px] mb-8 font-[400]">Thank you for your order. We're preparing it now.</p>
          
          <div className="bg-[var(--gray-1)] rounded-[16px] p-6 mb-8 text-left border border-[var(--gray-2)]">
            <div className="flex justify-between border-b border-[var(--gray-3)] pb-4 mb-4">
              <span className="text-[var(--text-secondary)] font-[500] text-[14px]">Order Number</span>
              <span className="font-[700] text-[var(--dark-2)]">#{orderSuccess.orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--gray-3)] pb-4 mb-4">
              <span className="text-[var(--text-secondary)] font-[500] text-[14px]">Estimated Delivery</span>
              <span className="font-[700] text-[var(--primary)]">{orderSuccess.estimatedDelivery}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--gray-3)] pb-4 mb-4">
              <span className="text-[var(--text-secondary)] font-[500] text-[14px]">Items</span>
              <span className="font-[700] text-[var(--dark-2)]">{orderSuccess.items.length} items</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[var(--text-secondary)] font-[500] text-[14px]">Total Paid</span>
              <span className="font-[800] text-[var(--success)] text-[22px]">₹{orderSuccess.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/my-orders" className="flex items-center justify-center bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-[600] text-[15px] px-8 py-3.5 rounded-full shadow-[var(--shadow-red)] hover:scale-[1.02] transition-transform active:scale-95">
              View My Orders
            </Link>
            <Link to="/" className="flex items-center justify-center border-2 border-[var(--gray-3)] text-[var(--dark-2)] font-[600] text-[15px] px-8 py-3.5 rounded-full hover:bg-[var(--dark-2)] hover:border-[var(--dark-2)] hover:text-white transition-all active:scale-95">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputClass = (error) => `w-full px-4 py-3 bg-[var(--gray-1)] border-[1.5px] rounded-[12px] focus:outline-none transition-all font-[500] text-[var(--dark-2)] placeholder:text-[#ADB5BD] ${error ? 'border-red-400 focus:border-red-500 bg-[#FFF0F1]' : 'border-transparent focus:border-[var(--primary)] hover:bg-[var(--gray-2)]'}`;

  return (
    <div className="min-h-screen bg-[var(--gray-1)] pt-[100px] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-[36px] font-[800] text-[var(--dark-2)] tracking-tight">Checkout</h1>
          <p className="text-[var(--text-secondary)] font-[500] mt-1">Complete your order details below.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Form Content */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Delivery Address Section */}
              <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-[var(--shadow-sm)] border border-[var(--gray-2)]">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--gray-2)]">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0F1] flex items-center justify-center text-[var(--primary)]">
                    <MapPin size={20} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-[20px] font-[800] text-[var(--dark-2)]">Delivery Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[13px] font-[700] text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">First Name</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass(errors.firstName)} placeholder="John" />
                    {errors.firstName && <p className="text-[var(--primary)] text-[12px] font-[600] mt-1.5">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-[13px] font-[700] text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Last Name</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass(errors.lastName)} placeholder="Doe" />
                    {errors.lastName && <p className="text-[var(--primary)] text-[12px] font-[600] mt-1.5">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[13px] font-[700] text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass(errors.email)} placeholder="john@example.com" />
                    {errors.email && <p className="text-[var(--primary)] text-[12px] font-[600] mt-1.5">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-[13px] font-[700] text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Phone Number</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').substr(0, 10))} className={inputClass(errors.phone)} placeholder="9876543210" />
                    {errors.phone && <p className="text-[var(--primary)] text-[12px] font-[600] mt-1.5">{errors.phone}</p>}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-[13px] font-[700] text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">House/Flat No. & Building</label>
                  <input type="text" value={houseNo} onChange={e => setHouseNo(e.target.value)} className={inputClass(errors.houseNo)} placeholder="A-101, Skyline Apartments" />
                  {errors.houseNo && <p className="text-[var(--primary)] text-[12px] font-[600] mt-1.5">{errors.houseNo}</p>}
                </div>

                <div className="mb-5">
                  <label className="block text-[13px] font-[700] text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Area / Street</label>
                  <input type="text" value={area} onChange={e => setArea(e.target.value)} className={inputClass(errors.area)} placeholder="Main Street, Downtown" />
                  {errors.area && <p className="text-[var(--primary)] text-[12px] font-[600] mt-1.5">{errors.area}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-[700] text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">City</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} className={inputClass(errors.city)} placeholder="Mumbai" />
                    {errors.city && <p className="text-[var(--primary)] text-[12px] font-[600] mt-1.5">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-[13px] font-[700] text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Pincode</label>
                    <input type="text" value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, '').substr(0, 6))} className={inputClass(errors.pincode)} placeholder="400001" />
                    {errors.pincode && <p className="text-[var(--primary)] text-[12px] font-[600] mt-1.5">{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-[var(--shadow-sm)] border border-[var(--gray-2)]">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--gray-2)]">
                  <div className="w-10 h-10 rounded-full bg-[#E6F0FF] flex items-center justify-center text-[#4A90E2]">
                    <Wallet size={20} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-[20px] font-[800] text-[var(--dark-2)]">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-[16px] border-[2px] flex items-center gap-3 transition-all ${paymentMethod === 'card' ? 'border-[var(--primary)] bg-[#FFF0F1] text-[var(--primary)] shadow-[var(--shadow-sm)]' : 'border-[var(--gray-2)] text-[var(--text-secondary)] hover:border-[var(--gray-3)] hover:bg-[var(--gray-1)]'}`}
                  >
                    <CreditCard size={22} strokeWidth={2} />
                    <span className="font-[700] text-[15px]">Card Payment</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-[16px] border-[2px] flex items-center gap-3 transition-all ${paymentMethod === 'cod' ? 'border-[var(--primary)] bg-[#FFF0F1] text-[var(--primary)] shadow-[var(--shadow-sm)]' : 'border-[var(--gray-2)] text-[var(--text-secondary)] hover:border-[var(--gray-3)] hover:bg-[var(--gray-1)]'}`}
                  >
                    <span className="text-[22px]">💵</span>
                    <span className="font-[700] text-[15px]">Cash on Delivery</span>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-5 overflow-hidden">
                    <div>
                      <label className="block text-[13px] font-[700] text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Card Number</label>
                      <input 
                        type="text" 
                        value={cardNumber} 
                        onChange={handleCardNumberChange} 
                        className={inputClass(errors.cardNumber)} 
                        placeholder="0000 0000 0000 0000" 
                      />
                      {errors.cardNumber && <p className="text-[var(--primary)] text-[12px] font-[600] mt-1.5">{errors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[13px] font-[700] text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Expiry Date</label>
                        <input 
                          type="text" 
                          value={expiry} 
                          onChange={handleExpiryChange} 
                          className={inputClass(errors.expiry)} 
                          placeholder="MM/YY" 
                        />
                        {errors.expiry && <p className="text-[var(--primary)] text-[12px] font-[600] mt-1.5">{errors.expiry}</p>}
                      </div>
                      <div>
                        <label className="block text-[13px] font-[700] text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">CVV</label>
                        <div className="relative">
                          <input 
                            type={showCvv ? "text" : "password"} 
                            value={cvv} 
                            onChange={handleCvvChange} 
                            className={inputClass(errors.cvv)} 
                            placeholder="123" 
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowCvv(!showCvv)} 
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] hover:text-[var(--dark-2)] transition-colors focus:outline-none"
                          >
                            {showCvv ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.cvv && <p className="text-[var(--primary)] text-[12px] font-[600] mt-1.5">{errors.cvv}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-[100px] bg-white rounded-[24px] shadow-[var(--shadow-md)] border border-[var(--gray-2)] overflow-hidden">
              <div className="p-6 border-b border-[var(--gray-2)] bg-[var(--gray-1)]">
                <h3 className="text-[20px] font-[800] text-[var(--dark-2)]">Order Summary</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-[12px] overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-[700] text-[14px] text-[var(--dark-2)] line-clamp-1">{item.name}</h4>
                        <p className="text-[var(--text-secondary)] text-[12px] font-[600] mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-[800] text-[var(--primary)] text-[15px]">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-[var(--gray-2)] mb-6">
                  <div className="flex justify-between text-[14px] font-[500] text-[var(--text-secondary)]">
                    <span>Subtotal</span>
                    <span className="font-[600] text-[var(--dark-2)]">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[14px] font-[500] text-[var(--text-secondary)]">
                    <span>Delivery Fee</span>
                    <span className="font-[600] text-[var(--dark-2)]">₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-[14px] font-[500] text-[var(--text-secondary)]">
                    <span>GST (5%)</span>
                    <span className="font-[600] text-[var(--dark-2)]">₹{gst.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-5 border-t border-dashed border-[var(--gray-3)] mb-6">
                  <span className="text-[18px] font-[800] text-[var(--dark-2)]">Total</span>
                  <span className="text-[24px] font-[800] text-[var(--primary)]">₹{total.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white text-[16px] font-[700] rounded-full shadow-[var(--shadow-red)] hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 group"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
