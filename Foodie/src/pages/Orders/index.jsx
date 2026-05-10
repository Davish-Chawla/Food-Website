import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, MapPin, Clock, ArrowRight, Navigation, X, CheckCircle2, Receipt } from 'lucide-react';
import { getMyOrders } from '../../services/orderService';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/common/SectionHeader';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const statusColors = {
    placed: 'bg-orange-50 text-orange-600 border-orange-100',
    confirmed: 'bg-blue-50 text-blue-600 border-blue-100',
    preparing: 'bg-amber-50 text-amber-600 border-amber-100',
    out_for_delivery: 'bg-purple-50 text-purple-600 border-purple-100',
    delivered: 'bg-green-50 text-green-600 border-green-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-light)] pt-[100px] pb-20 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="h-12 w-64 bg-[var(--gray-200)] rounded-2xl animate-pulse mb-8" />
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-8 rounded-[32px] h-64 animate-pulse border border-[var(--gray-200)] shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-light)] pt-[100px] pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader 
            label="Order History"
            title="Track Your"
            highlight="Delights"
            align="left"
            className="mb-0"
          />
          <p className="text-[var(--text-secondary)] font-bold text-lg">{orders.length} Past Orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="p-16 text-center" shadow="lg">
            <div className="w-24 h-24 bg-[var(--bg-light)] rounded-[32px] flex items-center justify-center mx-auto mb-8 text-4xl shadow-sm border border-[var(--gray-100)]">
              🍔
            </div>
            <h2 className="text-3xl font-black text-[var(--dark)] mb-4">No orders yet!</h2>
            <p className="text-[var(--text-secondary)] mb-10 max-w-md mx-auto font-medium text-lg">
              Looks like you haven't tasted our premium selections yet. Your next favorite meal is just a click away.
            </p>
            <Button onClick={() => navigate('/menu')} size="lg" icon={ArrowRight}>
              Browse Our Menu
            </Button>
          </Card>
        ) : (
          <div className="space-y-8">
            {orders.map((order, index) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden" shadow="sm">
                  {/* Order Header */}
                  <div className="p-8 border-b border-[var(--gray-100)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[var(--bg-light)]/50">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[var(--primary)] shadow-sm border border-[var(--gray-100)]">
                        <Receipt size={24} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <span className="text-xl font-black text-[var(--dark)] tracking-tight">Order #{order.orderNumber}</span>
                          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[order.orderStatus] || statusColors.placed}`}>
                            {order.orderStatus.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] font-bold">
                          <Clock size={14} />
                          {new Date(order.placedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em] mb-1">Grand Total</p>
                        <p className="text-2xl font-black text-[var(--primary)]">₹{order.total.toLocaleString()}</p>
                      </div>
                      {['placed', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.orderStatus) && (
                        <Button onClick={() => setTrackingOrder(order)} size="sm" icon={Navigation}>
                          Track
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Items List */}
                    <div className="lg:col-span-7 space-y-6">
                      <h4 className="text-[13px] font-black text-[var(--dark)] flex items-center gap-3 uppercase tracking-[0.2em] mb-6">
                        <Package size={18} className="text-[var(--primary)]" /> Items Ordered
                      </h4>
                      <div className="grid gap-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-light)]/50 border border-[var(--gray-100)] hover:bg-white transition-colors">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                            <div className="flex-1">
                              <p className="font-bold text-[var(--dark)] text-[15px]">{item.name}</p>
                              <p className="text-[12px] text-[var(--text-secondary)] font-bold">Quantity: {item.quantity}</p>
                            </div>
                            <span className="font-black text-[var(--dark)]">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="lg:col-span-5">
                      <div className="p-8 rounded-[32px] bg-[var(--dark)] text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] opacity-[0.05] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <h4 className="text-[12px] font-black text-white/50 flex items-center gap-3 uppercase tracking-[0.2em] mb-6">
                          <MapPin size={18} className="text-[var(--primary)]" /> Delivery Info
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-lg font-black">{order.deliveryAddress.firstName} {order.deliveryAddress.lastName}</p>
                            <p className="text-white/70 font-medium">{order.deliveryAddress.phone}</p>
                          </div>
                          <div className="text-white/60 text-[14px] font-medium leading-relaxed">
                            <p>{order.deliveryAddress.houseNo}, {order.deliveryAddress.area}</p>
                            <p>{order.deliveryAddress.city} - {order.deliveryAddress.pincode}</p>
                          </div>
                          <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-center">
                            <span className="text-[12px] font-bold text-white/40 uppercase tracking-widest">Method</span>
                            <span className="font-black text-[var(--primary)] uppercase text-[14px]">{order.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTrackingOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-md shadow-2xl relative z-10 overflow-hidden border border-[var(--gray-200)]"
            >
              <div className="p-8 border-b border-[var(--gray-100)] flex justify-between items-center bg-[var(--bg-light)]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white">
                    <Navigation size={20} />
                  </div>
                  <h3 className="text-xl font-black text-[var(--dark)] tracking-tight">Track Order</h3>
                </div>
                <button onClick={() => setTrackingOrder(null)} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:scale-110 transition-transform">
                  <X size={20} />
                </button>
              </div>

              <div className="p-10">
                {(() => {
                  const placedTime = new Date(trackingOrder.placedAt).getTime();
                  const targetTime = placedTime + 30 * 60 * 1000;
                  const timeLeft = Math.max(0, targetTime - currentTime.getTime());
                  const mins = Math.floor(timeLeft / 60000);
                  const secs = Math.floor((timeLeft % 60000) / 1000);
                  const isDelivered = trackingOrder.orderStatus === 'delivered';
                  
                  const statuses = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
                  const currentIndex = statuses.indexOf(trackingOrder.orderStatus);

                  return (
                    <>
                      <div className="mb-12 text-center">
                        {isDelivered ? (
                          <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="inline-flex flex-col items-center gap-3 text-green-500"
                          >
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center shadow-inner">
                              <CheckCircle2 size={48} strokeWidth={2.5} />
                            </div>
                            <p className="font-black text-2xl tracking-tight">Delivered Successfully!</p>
                          </motion.div>
                        ) : (
                          <div className="bg-[var(--bg-light)] rounded-3xl p-8 border border-[var(--gray-100)] shadow-inner">
                            <p className="text-[11px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em] mb-3">Estimated Arrival</p>
                            <p className="font-black text-5xl text-[var(--primary)] tracking-tighter tabular-nums">
                              {String(mins).padStart(2, '0')}<span className="text-[var(--dark)]/20">:</span>{String(secs).padStart(2, '0')}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="relative pl-10">
                        <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-[var(--gray-100)]" />
                        {statuses.map((status, index) => {
                          const isActive = index <= currentIndex;
                          const isCurrent = index === currentIndex;
                          const labels = { placed: "Order Placed", confirmed: "Confirmed", preparing: "Preparing", out_for_delivery: "Out for Delivery", delivered: "Delivered" };

                          return (
                            <div key={status} className="relative mb-8 last:mb-0">
                              <div className={`absolute -left-[31px] top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 z-10 border-4 border-white ${
                                isActive ? 'bg-[var(--primary)] shadow-[0_0_15px_rgba(255,82,82,0.4)] scale-110' : 'bg-[var(--gray-200)]'
                              }`}>
                                {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                              <div className="transition-all duration-300">
                                <p className={`font-black text-[15px] ${isActive ? 'text-[var(--dark)]' : 'text-[var(--gray-300)]'}`}>
                                  {labels[status]}
                                </p>
                                {isCurrent && (
                                  <motion.p 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-[12px] font-bold text-[var(--primary)] mt-1"
                                  >
                                    Active Now
                                  </motion.p>
                                )}
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
