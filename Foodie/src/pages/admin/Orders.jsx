import React, { useEffect, useState, useRef } from 'react';
import { getAdminOrders, updateOrderStatus } from '../../services/adminService';
import toast from 'react-hot-toast';
import { ChevronDown, X, MapPin, Package } from 'lucide-react';
import CustomDropdown from '../../components/CustomDropdown';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const lastOrderDateRef = useRef(null);

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await getAdminOrders({ status: filter, limit: 50 });
      if (data.success) {
        const fetchedOrders = data.data;
        
        if (!showLoading && lastOrderDateRef.current && fetchedOrders.length > 0) {
          const newOrders = fetchedOrders.filter(o => new Date(o.placedAt) > lastOrderDateRef.current);
          if (newOrders.length > 0) {
            const persons = new Set(newOrders.map(o => o.user?._id)).size;
            toast.success(`${newOrders.length} new order(s) arrived from ${persons} person(s)!`, {
              icon: '🔔',
              duration: 5000,
            });
          }
        }

        if (fetchedOrders.length > 0) {
          lastOrderDateRef.current = new Date(Math.max(...fetchedOrders.map(o => new Date(o.placedAt))));
        }

        setOrders(fetchedOrders);
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
    const interval = setInterval(() => fetchOrders(false), 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateOrderStatus(id, newStatus);
      if (res.success) {
        toast.success(`Status updated to ${newStatus.replace(/_/g, ' ')} ✓`);
        // Update local state with the returned order to reflect any other changes (like paymentStatus)
        setOrders(orders.map(o => o._id === id ? res.data : o));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const statusColors = {
    placed: 'bg-[#FFF3E0] text-[#E67E22]', // Orange
    confirmed: 'bg-[#FFF3E0] text-[#E67E22]',
    preparing: 'bg-[#E3F2FD] text-[#3498DB]', // Blue
    out_for_delivery: 'bg-[#F4ECF7] text-[#9B59B6]', // Purple
    delivered: 'bg-[#EAFDF3] text-[#2ED573]', // Green
    cancelled: 'bg-[#FFF0F1] text-[var(--primary)]', // Red
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-[32px] font-[800] text-[var(--dark-2)] tracking-tight">All Orders</h1>
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

      <div className="bg-white rounded-[20px] shadow-[var(--shadow-sm)] border border-[var(--gray-2)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b border-[var(--gray-3)] text-[13px] text-[var(--text-secondary)] uppercase tracking-wide bg-[var(--gray-1)]">
                <th className="p-4 font-[700]">Order #</th>
                <th className="p-4 font-[700]">Customer Name</th>
                <th className="p-4 font-[700] text-center">Items</th>
                <th className="p-4 font-[700]">Total</th>
                <th className="p-4 font-[700]">Payment</th>
                <th className="p-4 font-[700] text-center">Status</th>
                <th className="p-4 font-[700]">Date</th>
                <th className="p-4 font-[700] text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-8 text-[var(--primary)] font-[700]">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-8 text-[var(--text-secondary)] font-[600]">No orders found.</td></tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={order._id} className={`border-b border-[var(--gray-2)] last:border-0 hover:bg-[var(--gray-2)] transition-colors ${idx % 2 === 1 ? 'bg-[var(--gray-1)]' : 'bg-white'}`}>
                    <td className="p-4 font-[800] text-[var(--dark-2)] text-[14px]">{order.orderNumber}</td>
                    <td 
                      className="p-4 cursor-pointer hover:bg-[var(--gray-3)] rounded-lg transition-colors group"
                      onClick={() => setSelectedOrder(order)}
                      title="Click to view full details"
                    >
                      <p className="font-[700] text-[14px] text-[var(--primary)] group-hover:underline">{order.user?.name}</p>
                      <p className="text-[12px] text-[var(--text-secondary)] font-[500]">{order.user?.email}</p>
                    </td>
                    <td className="p-4 text-center font-[700] text-[var(--text-secondary)] text-[15px]">{order.items.reduce((acc, item) => acc + item.quantity, 0)}</td>
                    <td className="p-4 font-[800] text-[var(--primary)] text-[15px]">₹{order.total.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-[800] uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-[#EAFDF3] text-[var(--success)]' : 'bg-[#FFF3E0] text-[#E67E22]'}`}>
                        {order.paymentMethod} - {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-[700] uppercase tracking-wider ${statusColors[order.orderStatus] || statusColors.placed}`}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-[13px] text-[var(--text-secondary)] font-[600]">
                      {new Date(order.placedAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <CustomDropdown
                        value={order.orderStatus}
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
      </div>

      {/* Customer / Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[var(--gray-2)] flex justify-between items-center bg-[var(--gray-1)]">
              <h3 className="text-[20px] font-[800] text-[var(--dark-2)] flex items-center gap-2">
                Order Details <span className="text-[14px] font-[600] text-[var(--text-secondary)]">#{selectedOrder.orderNumber}</span>
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-[var(--gray-3)] rounded-full transition-colors">
                <X size={20} className="text-[var(--dark-2)]" />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[var(--gray-1)] p-4 rounded-[16px]">
                  <h4 className="font-[700] text-[14px] text-[var(--text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-[var(--primary)]" /> Customer Info
                  </h4>
                  <p className="font-[800] text-[16px] text-[var(--dark-2)] mb-1">{selectedOrder.deliveryAddress?.firstName} {selectedOrder.deliveryAddress?.lastName}</p>
                  <p className="text-[14px] text-[var(--text-secondary)] mb-1">{selectedOrder.deliveryAddress?.email}</p>
                  <p className="text-[14px] text-[var(--text-secondary)] mb-1">{selectedOrder.deliveryAddress?.phone}</p>
                  <p className="text-[14px] text-[var(--text-secondary)]">{selectedOrder.deliveryAddress?.houseNo}, {selectedOrder.deliveryAddress?.area}, {selectedOrder.deliveryAddress?.city} - {selectedOrder.deliveryAddress?.pincode}</p>
                </div>
                <div className="bg-[var(--gray-1)] p-4 rounded-[16px]">
                  <h4 className="font-[700] text-[14px] text-[var(--text-secondary)] uppercase tracking-wider mb-3">Payment Info</h4>
                  <div className="space-y-2 text-[14px]">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Method:</span>
                      <span className="font-[800] uppercase text-[var(--dark-2)]">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Status:</span>
                      <span className={`font-[800] uppercase ${selectedOrder.paymentStatus === 'paid' ? 'text-[var(--success)]' : 'text-[#E67E22]'}`}>{selectedOrder.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Total Amount:</span>
                      <span className="font-[800] text-[var(--primary)]">₹{selectedOrder.total.toLocaleString()}</span>
                    </div>
                    {selectedOrder.paymentMethod === 'card' && (
                      <div className="mt-2 pt-2 border-t border-[var(--gray-3)] text-[12px] text-[var(--text-secondary)] italic">
                        Payment came for order no: {selectedOrder.orderNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-[700] text-[14px] text-[var(--text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Package size={16} className="text-[var(--primary)]" /> Order Items
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-white border border-[var(--gray-2)] p-3 rounded-[12px]">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-[8px] object-cover bg-[var(--gray-1)]" />
                        <div>
                          <p className="font-[700] text-[14px] text-[var(--dark-2)]">{item.name}</p>
                          <p className="text-[12px] text-[var(--text-secondary)] font-[600]">₹{item.price} x {item.quantity} piece(s)</p>
                        </div>
                      </div>
                      <p className="font-[800] text-[15px] text-[var(--dark-2)]">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[var(--gray-2)] bg-[var(--gray-1)] flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="bg-white border border-[var(--gray-3)] text-[var(--dark-2)] px-6 py-2.5 rounded-full font-[700] text-[14px] hover:border-[var(--dark-2)] transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
