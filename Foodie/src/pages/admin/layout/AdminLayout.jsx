import React, { useContext, useEffect, useRef } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { getAdminOrders } from '../../../services/adminService';
import toast from 'react-hot-toast';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, LogOut, Bell, X, Mail } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../components/ui/Loader';

const AdminLayout = () => {
  const { user, logout, isAdmin, loading } = useContext(AuthContext);
  const location = useLocation();
  const lastOrderTimeRef = useRef(Date.now());
  const activeToastsRef = useRef(new Set());

  useEffect(() => {
    if (!isAdmin) return;

    const checkNewOrders = async () => {
      try {
        const res = await getAdminOrders({ limit: 10 });
        if (res.success && res.data.length > 0) {
          const newOrders = res.data.filter(order => new Date(order.placedAt).getTime() > lastOrderTimeRef.current);
          
          if (newOrders.length > 0) {
            newOrders.forEach(order => {
              if (activeToastsRef.current.has(order._id)) return;
              activeToastsRef.current.add(order._id);

              toast.custom((t) => (
                <motion.div
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-[32px] pointer-events-auto flex border-2 border-[var(--primary)] overflow-hidden`}
                >
                  <div className="flex-1 w-0 p-6">
                    <div className="flex items-start">
                      <div className="shrink-0 pt-0.5">
                        <div className="w-12 h-12 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white shadow-lg animate-bounce">
                          <Bell size={24} />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-black text-[var(--dark)] uppercase tracking-widest">New Order Arrived!</p>
                        <p className="mt-1 text-lg font-black text-[var(--primary)]">#{order.orderNumber}</p>
                        <p className="mt-1 text-sm font-bold text-[var(--text-secondary)]">From: {order.user?.name || 'Customer'}</p>
                        <div className="mt-4 flex gap-2">
                          <Link 
                            to="/Admin/orders" 
                            onClick={() => toast.dismiss(t.id)}
                            className="px-4 py-2 bg-[var(--dark)] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[var(--primary)] transition-colors"
                          >
                            View Order
                          </Link>
                          <button
                            onClick={() => {
                              toast.dismiss(t.id);
                              activeToastsRef.current.delete(order._id);
                            }}
                            className="px-4 py-2 bg-[var(--bg-light)] text-[var(--dark)] text-[11px] font-black uppercase tracking-widest rounded-xl"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ), { duration: Infinity, position: 'top-right' });
            });
            lastOrderTimeRef.current = Math.max(...newOrders.map(o => new Date(o.placedAt).getTime()));
          }
        }
      } catch (error) {
        console.error("Order check failed", error);
      }
    };

    const interval = setInterval(checkNewOrders, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [isAdmin]);
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-light)]">
      <Loader message="Securing administrative environment..." />
    </div>
  );

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Menu', path: '/admin/menu', icon: <UtensilsCrossed size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Messages', path: '/admin/messages', icon: <Mail size={20} /> }
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg-light)]">
      {/* Sidebar */}
      <div className="w-[280px] bg-[var(--dark)] text-white flex flex-col fixed h-full z-20 shadow-2xl">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-1 group w-fit">
            <span className="text-[26px] font-black tracking-tighter uppercase">
              Foodie<span className="text-[var(--primary)]">Hub</span>
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/20 translate-x-1' 
                    : 'text-[var(--gray-400)] hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-bold text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5 bg-white/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center text-white font-black text-lg shadow-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[15px] text-white truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[12px] text-[var(--gray-500)] font-medium truncate">{user?.email || 'admin@foodiehub.com'}</p>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="w-full !border-white/10 !text-white hover:!bg-white/10"
            icon={LogOut}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-[280px] p-10 overflow-y-auto min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
