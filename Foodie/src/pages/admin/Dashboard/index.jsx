import React, { useEffect, useState } from 'react';
import { getDashboard } from '../../../services/adminService';
import { Package, IndianRupee, Users, Clock, TrendingUp, RefreshCcw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import SectionHeader from '../../../components/common/SectionHeader';
import Loader from '../../../components/ui/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchStats = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      else setRefreshing(true);
      
      const data = await getDashboard();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Dashboard error", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats(true);
  }, []);

  if (loading || !stats) return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Loader message="Synthesizing your business metrics..." />
    </div>
  );

  const COLORS = ['#FF4757', '#3B82F6', '#EAB308', '#22C55E', '#A855F7'];
  const pieData = [
    { name: 'Placed', value: stats?.orderStatusBreakdown?.placed || 0 },
    { name: 'Confirmed', value: stats?.orderStatusBreakdown?.confirmed || 0 },
    { name: 'Preparing', value: stats?.orderStatusBreakdown?.preparing || 0 },
    { name: 'Delivered', value: stats?.orderStatusBreakdown?.delivered || 0 },
    { name: 'Cancelled', value: stats?.orderStatusBreakdown?.cancelled || 0 }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <SectionHeader 
          title="Dashboard"
          highlight="Overview"
          align="left"
          className="mb-0"
        />
        <button 
          onClick={() => fetchStats(false)}
          disabled={refreshing}
          className={`flex items-center gap-2 px-6 py-3 bg-white border border-[var(--gray-200)] rounded-2xl text-[var(--dark)] font-bold text-[14px] shadow-sm hover:shadow-md transition-all ${refreshing ? 'opacity-50 cursor-not-allowed' : 'hover:border-[var(--primary)] active:scale-95'}`}
        >
          <RefreshCcw size={18} className={`${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="p-6 group" shadow="sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <Package size={28} />
            </div>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-[12px] font-black shadow-sm">
              <TrendingUp size={14} /> +{stats.todayOrders} New
            </div>
          </div>
          <div>
            <p className="text-[12px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em] mb-2">Total Orders</p>
            <h3 className="text-4xl font-black text-[var(--dark)] tracking-tighter">{stats.totalOrders.toLocaleString()}</h3>
          </div>
        </Card>
        
        <Card className="p-6 group" shadow="sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
              <IndianRupee size={28} />
            </div>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-[12px] font-black shadow-sm">
              ₹{stats.todayRevenue?.toLocaleString() || 0} Today
            </div>
          </div>
          <div>
            <p className="text-[12px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em] mb-2">Total Revenue</p>
            <h3 className="text-4xl font-black text-[var(--dark)] tracking-tighter">₹{stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </Card>
        
        <Card className="p-6 group" shadow="sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
          </div>
          <div>
            <p className="text-[12px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em] mb-2">Total Customers</p>
            <h3 className="text-4xl font-black text-[var(--dark)] tracking-tighter">{stats.totalCustomers.toLocaleString()}</h3>
          </div>
        </Card>
        
        <Card className="p-6 group" shadow="sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-[var(--primary)] group-hover:scale-110 transition-transform">
              <Clock size={28} />
            </div>
          </div>
          <div>
            <p className="text-[12px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em] mb-2">Pending Orders</p>
            <h3 className="text-4xl font-black text-[var(--dark)] tracking-tighter">{stats.pendingOrders}</h3>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <Card className="p-8" shadow="sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-[var(--dark)] tracking-tight">Revenue Trends</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>
              <span className="text-[12px] font-black text-[var(--gray-400)] uppercase tracking-widest">Revenue (₹)</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueByDay}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4757" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FF4757" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F2F6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#95A5A6', fontSize: 11, fontWeight: 700}} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#95A5A6', fontSize: 11, fontWeight: 700}} 
                  tickFormatter={(val) => `₹${val}`} 
                />
                <Tooltip 
                  cursor={{stroke: '#FF4757', strokeWidth: 2, strokeDasharray: '5 5'}}
                  contentStyle={{
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    padding: '16px'
                  }}
                  itemStyle={{color: '#FF4757', fontWeight: 900}}
                  labelStyle={{fontWeight: 900, color: '#212529', marginBottom: '4px'}}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#FF4757" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  activeDot={{ r: 8, stroke: '#fff', strokeWidth: 4, fill: '#FF4757' }}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-8" shadow="sm">
          <h3 className="text-xl font-black text-[var(--dark)] tracking-tight mb-8">Status Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px'}}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  iconSize={8}
                  wrapperStyle={{fontWeight: 700, fontSize: '11px', paddingTop: '30px', textTransform: 'uppercase', letterSpacing: '0.1em'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8" shadow="sm">
          <h3 className="text-xl font-black text-[var(--dark)] tracking-tight mb-8">Top Performers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--gray-100)] text-[11px] text-[var(--gray-400)] font-black uppercase tracking-[0.2em]">
                  <th className="pb-4 px-4">Item Name</th>
                  <th className="pb-4 px-4 text-center">Orders</th>
                  <th className="pb-4 px-4 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.topItems.map((item, idx) => (
                  <tr key={idx} className="border-b border-[var(--gray-100)] last:border-0 hover:bg-[var(--bg-light)] transition-colors">
                    <td className="p-4 font-bold text-[var(--dark)] text-[15px]">{item.name}</td>
                    <td className="p-4 text-center font-bold text-[var(--text-secondary)] text-[15px]">{item.ordersCount}</td>
                    <td className="p-4 text-right font-black text-[var(--primary)] text-[15px]">₹{item.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-8" shadow="sm">
          <h3 className="text-xl font-black text-[var(--dark)] tracking-tight mb-8">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--gray-100)] text-[11px] text-[var(--gray-400)] font-black uppercase tracking-[0.2em]">
                  <th className="pb-4 px-4">Order#</th>
                  <th className="pb-4 px-4">Customer</th>
                  <th className="pb-4 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, idx) => {
                  const statusStyles = {
                    placed: 'bg-orange-50 text-orange-600',
                    confirmed: 'bg-blue-50 text-blue-600',
                    preparing: 'bg-amber-50 text-amber-600',
                    delivered: 'bg-green-50 text-green-600',
                    cancelled: 'bg-red-50 text-red-600',
                    out_for_delivery: 'bg-purple-50 text-purple-600',
                  };
                  return (
                    <tr 
                      key={order._id} 
                      className="border-b border-[var(--gray-100)] last:border-0 hover:bg-[var(--bg-light)] cursor-pointer transition-colors"
                      onClick={() => navigate('/Admin/orders')}
                    >
                      <td className="p-4 font-black text-[var(--dark)] text-[15px]">#{order.orderNumber}</td>
                      <td className="p-4 text-[15px] font-bold text-[var(--text-secondary)] truncate max-w-[120px]">{order.user?.name}</td>
                      <td className="p-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyles[order.orderStatus] || statusStyles.placed}`}>
                          {order.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
