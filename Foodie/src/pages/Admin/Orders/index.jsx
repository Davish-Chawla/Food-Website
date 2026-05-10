import React, { useEffect, useState, useRef } from 'react';
import { getAdminOrders, updateOrderStatus } from '../../../services/adminService';
import toast from 'react-hot-toast';
import { ChevronDown, X, MapPin, Package, Receipt, Clock, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDropdown from '../../../components/CustomDropdown';
import Card from '../../../components/ui/Card';
import SectionHeader from '../../../components/common/SectionHeader';
import Button from '../../../components/ui/Button';
import Loader from '../../../components/ui/Loader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const lastOrderDateRef = useRef(null);

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      else setRefreshing(true);
      const data = await getAdminOrders({ status: filter, limit: 50 });
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
  }, [filter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateOrderStatus(id, newStatus);
      if (res.success) {
        toast.success(`Status updated to ${newStatus.replace(/_/g, ' ')} ✓`);
        setOrders(orders.map(o => o._id === id ? res.data : o));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const statusColors = {
    placed: 'bg-orange-50 text-orange-600 border-orange-100',
    confirmed: 'bg-blue-50 text-blue-600 border-blue-100',
    preparing: 'bg-amber-50 text-amber-600 border-amber-100',
    out_for_delivery: 'bg-purple-50 text-purple-600 border-purple-100',
    delivered: 'bg-green-50 text-green-600 border-green-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <SectionHeader 
          title="Order"
          highlight="Management"
          align="left"
          className="mb-0"
        />
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => fetchOrders(false)}
            disabled={refreshing}
            className={`flex items-center gap-2 px-6 py-3 bg-white border border-[var(--gray-200)] rounded-2xl text-[var(--dark)] font-bold text-[14px] shadow-sm hover:shadow-md transition-all ${refreshing ? 'opacity-50 cursor-not-allowed' : 'hover:border-[var(--primary)] active:scale-95'}`}
          >
            <RefreshCcw size={18} className={`${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <CustomDropdown
            value={filter}
            onChange={(val) => setFilter(val)}
            options={[
              { label: 'All Statuses', value: 'All' },
              { label: 'Placed', value: 'placed' },
              { label: 'Confirmed', value: 'confirmed' },
              { label: 'Preparing', value: 'preparing' },
              { label: 'Out for Delivery', value: 'out_for_delivery' },
              { label: 'Delivered', value: 'delivered' },
              { label: 'Cancelled', value: 'cancelled' }
            ]}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      <Card className="overflow-hidden" shadow="sm">
        <div className="overflow-x-auto pb-40">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b border-[var(--gray-100)] text-[11px] text-[var(--gray-400)] font-black uppercase tracking-[0.2em] bg-[var(--bg-light)]">
                <th className="p-5 font-black">Order #</th>
                <th className="p-5 font-black">Customer</th>
                <th className="p-5 font-black text-center">Items</th>
                <th className="p-5 font-black">Total</th>
                <th className="p-5 font-black">Payment</th>
                <th className="p-5 font-black text-center">Status</th>
                <th className="p-5 font-black">Date</th>
                <th className="p-5 font-black text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-20">
                    <Loader message="Fetching orders..." />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-20 text-[var(--text-secondary)] font-bold">No orders found.</td></tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={order._id} className="border-b border-[var(--gray-100)] last:border-0 hover:bg-[var(--bg-light)] transition-colors relative">
                    <td className="p-5 font-black text-[var(--dark)] text-[15px] flex items-center gap-3">
                      {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                        <span className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full animate-pulse shadow-[0_0_8px_var(--primary)] shrink-0" />
                      )}
                      #{order.orderNumber || 'N/A'}
                    </td>
                    <td 
                      className="p-5 cursor-pointer hover:bg-white rounded-2xl transition-all group"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <p className="font-bold text-[15px] text-[var(--primary)] group-hover:underline">
                        {order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName || ''}
                      </p>
                      <p className="text-[12px] text-[var(--text-secondary)] font-medium">{order.deliveryAddress?.email || order.user?.email || ''}</p>
                    </td>
                    <td className="p-5 text-center font-bold text-[var(--text-secondary)] text-[15px]">{order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0}</td>
                    <td className="p-5 font-black text-[var(--dark)] text-[15px]">₹{order.total?.toLocaleString() || 0}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {order.paymentMethod || 'COD'} • {order.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[order.orderStatus] || statusColors.placed}`}>
                        {String(order.orderStatus || 'placed').replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-5 text-[13px] text-[var(--text-secondary)] font-bold">
                      {order.placedAt ? new Date(order.placedAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                    </td>
                    <td className="p-5 text-center">
                      <CustomDropdown
                        value={order.orderStatus || 'placed'}
                        onChange={(val) => handleStatusChange(order._id, val)}
                        options={[
                          { label: 'Placed', value: 'placed' },
                          { label: 'Confirmed', value: 'confirmed' },
                          { label: 'Preparing', value: 'preparing' },
                          { label: 'Out for Delivery', value: 'out_for_delivery' },
                          { label: 'Delivered', value: 'delivered' },
                          { label: 'Cancelled', value: 'cancelled' }
                        ]}
                        className="w-44 mx-auto"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden border border-[var(--gray-200)]"
            >
              <div className="px-8 py-6 border-b border-[var(--gray-100)] flex justify-between items-center bg-[var(--bg-light)]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white">
                    <Receipt size={20} />
                  </div>
                  <h3 className="text-xl font-black text-[var(--dark)] tracking-tight">
                    Order Details <span className="text-sm font-bold text-[var(--text-secondary)] ml-2">#{selectedOrder.orderNumber}</span>
                  </h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:scale-110 transition-transform">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-10 max-h-[70vh] overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="bg-[var(--bg-light)] p-8 rounded-[32px] border border-[var(--gray-100)]">
                    <h4 className="text-[11px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <MapPin size={16} className="text-[var(--primary)]" /> Customer Info
                    </h4>
                    <p className="font-black text-lg text-[var(--dark)] mb-2">{selectedOrder.deliveryAddress?.firstName} {selectedOrder.deliveryAddress?.lastName}</p>
                    <p className="text-[14px] text-[var(--text-secondary)] font-medium mb-1">{selectedOrder.deliveryAddress?.email}</p>
                    <p className="text-[14px] text-[var(--text-secondary)] font-medium mb-4">{selectedOrder.deliveryAddress?.phone}</p>
                    <div className="text-[13px] text-[var(--text-secondary)] font-bold leading-relaxed">
                      <p>{selectedOrder.deliveryAddress?.houseNo}, {selectedOrder.deliveryAddress?.area}</p>
                      <p>{selectedOrder.deliveryAddress?.city} - {selectedOrder.deliveryAddress?.pincode}</p>
                    </div>
                  </div>
                  <div className="bg-[var(--bg-light)] p-8 rounded-[32px] border border-[var(--gray-100)]">
                    <h4 className="text-[11px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <Clock size={16} className="text-[var(--primary)]" /> Payment Details
                    </h4>
                    <div className="space-y-4 text-[14px]">
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--gray-400)] font-black uppercase text-[11px] tracking-widest">Method</span>
                        <span className="font-black text-[var(--dark)] uppercase">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--gray-400)] font-black uppercase text-[11px] tracking-widest">Status</span>
                        <span className={`font-black uppercase ${selectedOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>{selectedOrder.paymentStatus}</span>
                      </div>
                      <div className="h-[1px] bg-[var(--gray-200)] my-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--dark)] font-black">Total Paid</span>
                        <span className="text-2xl font-black text-[var(--primary)]">₹{selectedOrder.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em] mb-6 flex items-center gap-2 px-2">
                    <Package size={16} className="text-[var(--primary)]" /> Items Summary
                  </h4>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-white border border-[var(--gray-100)] p-5 rounded-2xl hover:border-[var(--primary)] transition-colors">
                        <div className="flex items-center gap-5">
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                          <div>
                            <p className="font-bold text-[15px] text-[var(--dark)]">{item.name}</p>
                            <p className="text-[12px] text-[var(--text-secondary)] font-black uppercase tracking-widest mt-1">₹{item.price} × {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-black text-[16px] text-[var(--dark)]">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-8 py-6 border-t border-[var(--gray-100)] bg-[var(--bg-light)]/50 flex justify-end">
                <Button variant="dark" onClick={() => setSelectedOrder(null)}>
                  Close Details
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
