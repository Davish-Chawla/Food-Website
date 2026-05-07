import React, { useEffect, useState } from 'react';
import { getDashboard } from '../../services/adminService';
import { Package, IndianRupee, Users, Clock, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async (showLoading = true) => {
      try {
        if (showLoading && isMounted) setLoading(true);
        const data = await getDashboard();
        if (data.success && isMounted) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Dashboard error", error);
      } finally {
        if (showLoading && isMounted) setLoading(false);
      }
    };

    fetchStats(true);
    const interval = setInterval(() => fetchStats(false), 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading || !stats) return <div className="flex justify-center py-20 text-[var(--primary)] font-[700]">Loading Dashboard...</div>;

  const COLORS = ['#3B82F6', '#EAB308', '#F97316', '#22C55E', '#EF4444'];
  const pieData = [
    { name: 'Placed', value: stats.orderStatusBreakdown.placed },
    { name: 'Confirmed', value: stats.orderStatusBreakdown.confirmed },
    { name: 'Preparing', value: stats.orderStatusBreakdown.preparing },
    { name: 'Delivered', value: stats.orderStatusBreakdown.delivered },
    { name: 'Cancelled', value: stats.orderStatusBreakdown.cancelled }
  ];

  return (
    <div>
      <h1 className="text-[32px] font-[800] text-[var(--dark-2)] tracking-tight mb-8">Dashboard Overview</h1>
      
      {/* Top Stats */}
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[var(--gray-2)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-14 h-14 rounded-[18px] bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <Package size={28} strokeWidth={2} />
            </div>
            <div className="flex items-center gap-1 text-[var(--success)] bg-[#EAFDF3] px-3 py-1.5 rounded-full text-[12px] font-[800] shadow-sm">
              <TrendingUp size={14} /> +{stats.todayOrders} New
            </div>
          </div>
          <div>
            <p className="text-[13px] font-[700] text-[var(--text-secondary)] uppercase tracking-widest mb-1 opacity-70">Total Orders</p>
            <h3 className="text-[36px] font-[900] text-[var(--dark-2)] leading-none tracking-tight">{stats.totalOrders.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[var(--gray-2)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-14 h-14 rounded-[18px] bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <IndianRupee size={28} strokeWidth={2} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-[12px] font-[800] shadow-sm border border-emerald-100">
              ₹{stats.todayRevenue?.toLocaleString() || 0} Today
            </div>
          </div>
          <div>
            <p className="text-[13px] font-[700] text-[var(--text-secondary)] uppercase tracking-widest mb-1 opacity-70">Total Revenue</p>
            <h3 className="text-[36px] font-[900] text-[var(--dark-2)] leading-none tracking-tight">₹{stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[var(--gray-2)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-14 h-14 rounded-[18px] bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Users size={28} strokeWidth={2} />
            </div>
          </div>
          <div>
            <p className="text-[13px] font-[700] text-[var(--text-secondary)] uppercase tracking-widest mb-1 opacity-70">Total Customers</p>
            <h3 className="text-[36px] font-[900] text-[var(--dark-2)] leading-none tracking-tight">{stats.totalCustomers.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[var(--gray-2)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-14 h-14 rounded-[18px] bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
              <Clock size={28} strokeWidth={2} />
            </div>
          </div>
          <div>
            <p className="text-[13px] font-[700] text-[var(--text-secondary)] uppercase tracking-widest mb-1 opacity-70">Pending Orders</p>
            <h3 className="text-[36px] font-[900] text-[var(--dark-2)] leading-none tracking-tight">{stats.pendingOrders}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[20px] shadow-[var(--shadow-sm)] border border-[var(--gray-2)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[18px] font-[800] text-[var(--dark-2)]">Revenue Last 7 Days</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF4757]"></div>
              <span className="text-[12px] font-[600] text-[var(--text-secondary)]">Revenue (₹)</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueByDay}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4757" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF4757" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F2F6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#95A5A6', fontSize: 12, fontWeight: 600}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#95A5A6', fontSize: 12, fontWeight: 600}} 
                  tickFormatter={(val) => `₹${val}`} 
                />
                <Tooltip 
                  cursor={{stroke: '#FF4757', strokeWidth: 2, strokeDasharray: '5 5'}}
                  contentStyle={{
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                  itemStyle={{color: '#FF4757', fontWeight: 700}}
                  labelStyle={{fontWeight: 800, color: '#2D3436', marginBottom: '4px'}}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#FF4757" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2, fill: '#FF4757' }}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[var(--gray-2)]">
          <h3 className="text-[18px] font-[800] text-[var(--dark-2)] mb-6">Order Status Breakdown</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px'}}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  iconSize={10}
                  wrapperStyle={{fontWeight: 700, fontSize: '12px', paddingTop: '20px'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-[var(--shadow-sm)] border border-[var(--gray-2)]">
          <h3 className="text-[18px] font-[800] text-[var(--dark-2)] mb-6">Top Menu Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--gray-3)] text-[13px] text-[var(--text-secondary)] uppercase tracking-wide">
                  <th className="pb-4 px-4 font-[700]">Item Name</th>
                  <th className="pb-4 px-4 font-[700] text-center">Orders</th>
                  <th className="pb-4 px-4 font-[700] text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.topItems.map((item, idx) => (
                  <tr key={idx} className="border-b border-[var(--gray-2)] last:border-0 even:bg-[var(--gray-1)]">
                    <td className="p-4 font-[700] text-[var(--dark-2)] text-[14px]">{item.name}</td>
                    <td className="p-4 text-center font-[600] text-[var(--text-secondary)] text-[14px]">{item.ordersCount}</td>
                    <td className="p-4 text-right font-[800] text-[var(--success)] text-[14px]">₹{item.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-[var(--shadow-sm)] border border-[var(--gray-2)]">
          <h3 className="text-[18px] font-[800] text-[var(--dark-2)] mb-6">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--gray-3)] text-[13px] text-[var(--text-secondary)] uppercase tracking-wide">
                  <th className="pb-4 px-4 font-[700]">Order#</th>
                  <th className="pb-4 px-4 font-[700]">Customer</th>
                  <th className="pb-4 px-4 font-[700]">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, idx) => {
                  const statusColors = {
                    placed: 'bg-[#FFF3E0] text-[#E67E22]',
                    confirmed: 'bg-[#FFF3E0] text-[#E67E22]',
                    preparing: 'bg-[#E3F2FD] text-[#3498DB]',
                    delivered: 'bg-[#EAFDF3] text-[#2ED573]',
                    cancelled: 'bg-[#FFF0F1] text-[var(--primary)]',
                    out_for_delivery: 'bg-[#F4ECF7] text-[#9B59B6]',
                  };
                  return (
                    <tr 
                      key={order._id} 
                      className={`border-b border-[var(--gray-2)] last:border-0 hover:bg-[var(--gray-2)] cursor-pointer transition-colors ${idx % 2 === 1 ? 'bg-[var(--gray-1)]' : 'bg-white'}`}
                      onClick={() => navigate('/admin/orders')}
                    >
                      <td className="p-4 font-[700] text-[var(--dark-2)] text-[14px]">{order.orderNumber}</td>
                      <td className="p-4 text-[14px] font-[600] text-[var(--text-secondary)] truncate max-w-[120px]">{order.user?.name}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-[700] uppercase tracking-wider ${statusColors[order.orderStatus] || statusColors.placed}`}>
                          {order.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
