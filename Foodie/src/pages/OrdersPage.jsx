import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, MapPin, Clock, ArrowRight, Navigation, X, CheckCircle } from 'lucide-react';
import { getMyOrders } from '../services/orderService';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (trackingOrder) {
      const updatedOrder = orders.find(o => o._id === trackingOrder._id);
      if (updatedOrder && updatedOrder.orderStatus !== trackingOrder.orderStatus) {
        setTrackingOrder(updatedOrder);
      }
    }
  }, [orders, trackingOrder]);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        if (data.success && isMounted) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Failed to load orders");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--gray-1)] pt-[100px] pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-10 w-48 bg-[var(--gray-2)] rounded-[12px] animate-pulse mb-8"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-[24px] h-48 animate-pulse shadow-[var(--shadow-sm)] border border-[var(--gray-2)]"></div>
          ))}
        </div>
      </div>
    );
  }

  const statusColors = {
    placed: 'bg-[#FFF3E0] text-[#E67E22]', // Orange
    confirmed: 'bg-[#FFF3E0] text-[#E67E22]',
    preparing: 'bg-[#E3F2FD] text-[#3498DB]', // Blue
    out_for_delivery: 'bg-[#F4ECF7] text-[#9B59B6]', // Purple
    delivered: 'bg-[#EAFDF3] text-[#2ED573]', // Green
    cancelled: 'bg-[#FFF0F1] text-[var(--primary)]', // Red
  };

  return (
    <div className="min-h-screen bg-[var(--gray-1)] pt-[100px] pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-[36px] font-[800] text-[var(--dark-2)] tracking-tight mb-2">My Orders</h1>
        <p className="text-[var(--text-secondary)] font-[500] mb-10 text-[16px]">Track and manage your past orders.</p>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-[24px] shadow-[var(--shadow-sm)] text-center border border-[var(--gray-2)]">
            <div className="w-24 h-24 bg-[#FFF0F1] rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm">🍕</div>
            <h2 className="text-[24px] font-[800] text-[var(--dark-2)] mb-3">No orders yet!</h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto text-[15px] leading-relaxed">Looks like you haven't placed any orders yet. Explore our delicious menu and start ordering.</p>
            <Link to="/menu" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white px-8 py-3.5 rounded-full font-[700] text-[16px] shadow-[var(--shadow-red)] hover:scale-[1.02] active:scale-95 transition-all group">
              Browse Menu <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 md:p-8 rounded-[24px] shadow-[var(--shadow-sm)] border border-[var(--gray-2)] hover:shadow-[var(--shadow-md)] transition-shadow group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-[var(--gray-2)] pb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[18px] font-[800] text-[var(--dark-2)]">Order #{order.orderNumber}</span>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-[700] uppercase tracking-wider ${statusColors[order.orderStatus] || statusColors.placed}`}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-[var(--text-secondary)] font-[500]">
                      <Clock size={14} />
                      {new Date(order.placedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-left md:text-right">
                      <p className="text-[12px] font-[700] text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Total Amount</p>
                      <p className="text-[22px] font-[800] text-[var(--primary)]">₹{order.total.toLocaleString()}</p>
                    </div>
                    {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                      <button 
                        onClick={() => setTrackingOrder(order)}
                        className="hidden md:flex items-center gap-2 bg-white border-2 border-[var(--primary)] text-[var(--primary)] px-5 py-2.5 rounded-full font-[700] text-[14px] hover:bg-[var(--primary)] hover:text-white transition-colors"
                      >
                        <Navigation size={16} /> Track Order
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-[700] text-[16px] text-[var(--dark-2)] mb-4 flex items-center gap-2"><Package size={18} className="text-[var(--primary)]"/> Order Items</h4>
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-[12px] bg-[var(--gray-1)] overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <p className="font-[700] text-[var(--dark-2)] text-[14px] line-clamp-1">{item.name}</p>
                            <p className="text-[13px] text-[var(--text-secondary)] font-[500]">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-[800] text-[15px] text-[var(--dark-2)] pt-0.5">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[var(--gray-1)] p-6 rounded-[16px] border border-[var(--gray-2)]">
                    <h4 className="font-[700] text-[16px] text-[var(--dark-2)] mb-4 flex items-center gap-2"><MapPin size={18} className="text-[var(--primary)]"/> Delivery Details</h4>
                    <div className="text-[14px] text-[var(--text-secondary)] space-y-1.5 font-[400] leading-relaxed">
                      <p className="font-[700] text-[var(--dark-2)] text-[15px]">{order.deliveryAddress.firstName} {order.deliveryAddress.lastName}</p>
                      <p>{order.deliveryAddress.phone}</p>
                      <p>{order.deliveryAddress.houseNo}, {order.deliveryAddress.area}</p>
                      <p>{order.deliveryAddress.city} - {order.deliveryAddress.pincode}</p>
                    </div>
                    <div className="mt-5 pt-5 border-t border-[var(--gray-3)]">
                      <p className="text-[14px]">
                        <span className="font-[600] text-[var(--text-secondary)]">Payment Method: </span> 
                        <span className="font-[800] text-[var(--dark-2)] uppercase">{order.paymentMethod}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Track Button */}
                {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                  <div className="mt-6 md:hidden">
                    <button 
                      onClick={() => setTrackingOrder(order)}
                      className="w-full flex justify-center items-center gap-2 bg-white border-2 border-[var(--primary)] text-[var(--primary)] px-5 py-3 rounded-full font-[700] text-[15px] hover:bg-[var(--primary)] hover:text-white transition-colors shadow-sm"
                    >
                      <Navigation size={18} /> Track Order
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-[var(--gray-2)] flex justify-between items-center bg-[var(--gray-1)]">
                <h3 className="text-[20px] font-[800] text-[var(--dark-2)] flex items-center gap-2">
                  <Navigation size={20} className="text-[var(--primary)]" /> Track Order <span className="text-[14px] font-[600] text-[var(--text-secondary)]">#{trackingOrder.orderNumber}</span>
                </h3>
                <button onClick={() => setTrackingOrder(null)} className="p-2 hover:bg-[var(--gray-3)] rounded-full transition-colors">
                  <X size={20} className="text-[var(--dark-2)]" />
                </button>
              </div>

              <div className="p-6">
                {(() => {
                  const placedTime = new Date(trackingOrder.placedAt).getTime();
                  const targetTime = placedTime + 30 * 60 * 1000; // 30 mins
                  const timeLeft = Math.max(0, targetTime - currentTime.getTime());
                  const mins = Math.floor(timeLeft / 60000);
                  const secs = Math.floor((timeLeft % 60000) / 1000);
                  
                  const isDelivered = trackingOrder.orderStatus === 'delivered';
                  
                  const statuses = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
                  const currentIndex = statuses.indexOf(trackingOrder.orderStatus);

                  return (
                    <>
                      <div className="mb-8 text-center">
                        {isDelivered ? (
                          <div className="inline-flex flex-col items-center gap-2 text-[var(--success)]">
                            <CheckCircle size={48} strokeWidth={2.5} />
                            <p className="font-[800] text-[20px]">Order Delivered!</p>
                          </div>
                        ) : (
                          <div className="bg-[var(--gray-1)] rounded-2xl p-4 inline-block min-w-[200px]">
                            <p className="text-[13px] font-[700] text-[var(--text-secondary)] uppercase tracking-wider mb-1">Estimated Delivery In</p>
                            <p className="font-[800] text-[36px] text-[var(--primary)] leading-none tabular-nums">
                              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="relative pt-2 pb-6 pl-4">
                        <div className="absolute left-[27px] top-4 bottom-8 w-0.5 bg-[var(--gray-2)]"></div>
                        
                        {statuses.map((status, index) => {
                          const isActive = index <= currentIndex;
                          const isLast = index === currentIndex;
                          
                          const titles = {
                            placed: "Order Placed",
                            confirmed: "Order Confirmed",
                            preparing: "Preparing Food",
                            out_for_delivery: "Out for Delivery",
                            delivered: "Delivered"
                          };

                          const descriptions = {
                            placed: "We have received your order.",
                            confirmed: "Restaurant has confirmed your order.",
                            preparing: "Your food is being prepared.",
                            out_for_delivery: "Delivery partner is on the way.",
                            delivered: "Enjoy your meal!"
                          };

                          return (
                            <div key={status} className="relative flex items-start gap-4 mb-6 last:mb-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-colors ${
                                isActive ? 'bg-[var(--primary)] text-white shadow-[var(--shadow-red)]' : 'bg-white border-2 border-[var(--gray-3)] text-[var(--gray-4)]'
                              }`}>
                                {isActive && <CheckCircle size={16} strokeWidth={3} />}
                              </div>
                              <div className="pt-1.5">
                                <p className={`font-[800] text-[16px] ${isActive ? 'text-[var(--dark-2)]' : 'text-[var(--gray-4)]'}`}>
                                  {titles[status]}
                                </p>
                                <p className={`text-[13px] mt-0.5 font-[500] ${isLast ? 'text-[var(--text-secondary)]' : 'text-transparent'}`}>
                                  {descriptions[status]}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
