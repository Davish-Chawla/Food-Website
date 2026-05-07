import React, { useEffect, useState } from 'react';
import { getCustomers } from '../../services/adminService';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        if (data.success) {
          setCustomers(data.data);
        }
      } catch (error) {
        toast.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-[32px] font-[800] text-[var(--dark-2)] tracking-tight">Customers</h1>
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 sm:flex-none w-full sm:w-64 px-5 py-2.5 bg-white border border-[var(--gray-3)] rounded-full text-[14px] font-[500] text-[var(--dark-2)] placeholder:text-[#ADB5BD] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all shadow-sm"
          />
          <button 
            onClick={() => toast('Export feature coming soon')}
            className="flex items-center gap-2 bg-white border border-[var(--gray-3)] text-[var(--dark-2)] px-5 py-2.5 rounded-full font-[700] text-[14px] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors shadow-sm"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[20px] shadow-[var(--shadow-sm)] border border-[var(--gray-2)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b border-[var(--gray-3)] text-[13px] text-[var(--text-secondary)] uppercase tracking-wide bg-[var(--gray-1)]">
                <th className="p-4 font-[700]">Avatar</th>
                <th className="p-4 font-[700]">Name</th>
                <th className="p-4 font-[700]">Contact</th>
                <th className="p-4 font-[700] text-center">Total Orders</th>
                <th className="p-4 font-[700] text-right">Card Payment</th>
                <th className="p-4 font-[700] text-right">COD Payment</th>
                <th className="p-4 font-[700]">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8 text-[var(--primary)] font-[700]">Loading customers...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-[var(--text-secondary)] font-[600]">No customers found.</td></tr>
              ) : (
                filteredCustomers.map((customer, idx) => (
                  <tr key={customer._id} className={`border-b border-[var(--gray-2)] last:border-0 hover:bg-[var(--gray-2)] transition-colors ${idx % 2 === 1 ? 'bg-[var(--gray-1)]' : 'bg-white'}`}>
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] flex items-center justify-center text-[#1976D2] font-[800] text-[15px] shadow-sm">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td className="p-4 font-[800] text-[var(--dark-2)] text-[15px]">{customer.name}</td>
                    <td className="p-4">
                      <p className="text-[14px] font-[600] text-[var(--dark-2)]">{customer.email}</p>
                      <p className="text-[12px] text-[var(--text-secondary)] font-[500]">{customer.phone || 'No phone'}</p>
                    </td>
                    <td className="p-4 text-center font-[700] text-[var(--text-secondary)] text-[15px]">{customer.totalOrders}</td>
                    <td className="p-4 text-right font-[800] text-[#9B59B6] text-[15px]">₹{(customer.cardTotal || 0).toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-[800] text-[var(--success)] text-[15px]">₹{(customer.codPaid || 0).toLocaleString()}</span>
                        {customer.codPending > 0 && (
                          <span className="text-[11px] font-[600] text-[#E67E22] bg-[#FFF3E0] px-2 py-0.5 rounded-md mt-1">
                            Pending: ₹{customer.codPending.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-[13px] text-[var(--text-secondary)] font-[600]">
                      {new Date(customer.joinedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
