import React, { useContext } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout, isAdmin, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[var(--gray-1)]">Loading...</div>;

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Menu', path: '/admin/menu', icon: <UtensilsCrossed size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> }
  ];

  return (
    <div className="flex min-h-screen bg-[var(--gray-1)]">
      {/* Sidebar */}
      <div className="w-[280px] bg-[var(--dark)] text-white flex flex-col fixed h-full z-20 shadow-[var(--shadow-lg)]">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-1 group w-fit">
            <span className="text-[24px] font-[800] tracking-tight flex items-center">
              <span className="bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent text-[32px]">F</span>
              <span className="text-white">oodieHub</span>
            </span>
            <span className="text-[24px] -rotate-12 group-hover:rotate-0 transition-transform duration-300 ml-1">🍕</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-[12px] transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-[var(--shadow-red)]' 
                    : 'text-[var(--text-secondary)] hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-[600] text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10 bg-white/5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#FF8C00] flex items-center justify-center text-white font-[700] text-[16px] shadow-sm shrink-0">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-[700] text-[14px] text-white truncate">{user?.name}</p>
              <p className="text-[12px] text-[var(--text-secondary)] font-[500] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-[var(--primary)] text-white rounded-[12px] transition-all duration-300 font-[600] text-[14px] hover:shadow-[var(--shadow-red)]"
          >
            <LogOut size={18} strokeWidth={2.5} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-[280px] p-8 md:p-10 overflow-y-auto min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
