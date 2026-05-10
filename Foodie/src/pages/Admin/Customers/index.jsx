import React, { useEffect, useState } from 'react';
import { getCustomers } from '../../../services/adminService';
import toast from 'react-hot-toast';
import { Download, Search } from 'lucide-react';
import Card from '../../../components/ui/Card';
import SectionHeader from '../../../components/common/SectionHeader';
import Button from '../../../components/ui/Button';
import Loader from '../../../components/ui/Loader';

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <SectionHeader 
          title="Customer"
          highlight="Insights"
          align="left"
          className="mb-0"
        />
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="premium-input !pl-12 w-full sm:w-80"
            />
          </div>
          <Button variant="outline" onClick={() => toast('Exporting data...')} icon={Download}>
            Export
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden" shadow="sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--gray-100)] text-[11px] text-[var(--gray-400)] font-black uppercase tracking-[0.2em] bg-[var(--bg-light)]">
                <th className="p-5 font-black">Avatar</th>
                <th className="p-5 font-black">Name</th>
                <th className="p-5 font-black">Contact Info</th>
                <th className="p-5 font-black text-center">Orders</th>
                <th className="p-5 font-black text-right">Card Spend</th>
                <th className="p-5 font-black text-right">COD Spend</th>
                <th className="p-5 font-black">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-20">
                    <Loader message="Synchronizing customer database..." />
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-20 text-[var(--text-secondary)] font-bold">No customers found.</td></tr>
              ) : (
                filteredCustomers.map((customer, idx) => (
                  <tr key={customer._id} className="border-b border-[var(--gray-100)] last:border-0 hover:bg-[var(--bg-light)] transition-colors">
                    <td className="p-5">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-black text-[15px] shadow-sm">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td className="p-5 font-bold text-[var(--dark)] text-[15px]">{customer.name}</td>
                    <td className="p-5">
                      <p className="font-bold text-[14px] text-[var(--dark)]">{customer.email}</p>
                      <p className="text-[12px] text-[var(--text-secondary)] font-medium mt-0.5">{customer.phone || 'No contact'}</p>
                    </td>
                    <td className="p-5 text-center font-black text-[var(--text-secondary)] text-[15px]">{customer.totalOrders}</td>
                    <td className="p-5 text-right font-black text-purple-600 text-[15px]">₹{(customer.cardTotal || 0).toLocaleString()}</td>
                    <td className="p-5 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-black text-green-600 text-[15px]">₹{(customer.codPaid || 0).toLocaleString()}</span>
                        {customer.codPending > 0 && (
                          <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mt-1 uppercase tracking-widest border border-orange-100">
                            Unpaid: ₹{customer.codPending.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-5 text-[13px] text-[var(--text-secondary)] font-bold">
                      {new Date(customer.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Customers;
