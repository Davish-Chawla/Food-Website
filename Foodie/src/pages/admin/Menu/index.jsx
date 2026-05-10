import React, { useEffect, useState } from 'react';
import { getAdminMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../../../services/adminService';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../../components/ui/Card';
import SectionHeader from '../../../components/common/SectionHeader';
import Button from '../../../components/ui/Button';
import Loader from '../../../components/ui/Loader';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: 'Pizza', price: '', image: '', description: '', veg: true, available: true, rating: 5
  });
  const [formErrors, setFormErrors] = useState({});
  
  const existingCategories = Array.from(new Set(items.map(i => i.category)));
  if (existingCategories.length === 0) existingCategories.push('Pizza', 'Burger', 'Pasta', 'Salad', 'Dessert', 'Beverage');

  const fetchMenu = async () => {
    try {
      const data = await getAdminMenu();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleToggleAvailable = async (id, currentStatus) => {
    try {
      const res = await updateMenuItem(id, { available: !currentStatus });
      if (res.success) {
        toast.success(`Item marked as ${!currentStatus ? 'Available' : 'Unavailable'}`);
        setItems(items.map(i => i._id === id ? { ...i, available: !currentStatus } : i));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openModal = (item = null) => {
    setShowNewCategoryInput(false);
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || '', 
        category: item.category || existingCategories[0] || 'Pizza', 
        price: item.price || '', 
        image: item.image || '', 
        description: item.description || '', 
        veg: item.veg !== undefined ? item.veg : true, 
        available: item.available !== undefined ? item.available : true,
        rating: item.rating || 5
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', category: existingCategories[0] || 'Pizza', price: '', image: '', description: '', veg: true, available: true, rating: 5 });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.price || formData.price <= 0) errors.price = "Valid price is required";
    if (!formData.image && !editingItem) errors.image = "Image is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      if (editingItem) {
        const res = await updateMenuItem(editingItem._id, formData);
        if (res.success) {
          toast.success('Item updated successfully');
          setItems(items.map(i => i._id === editingItem._id ? res.data : i));
        }
      } else {
        const res = await createMenuItem(formData);
        if (res.success) {
          toast.success('Item added successfully');
          setItems([res.data, ...items]);
        }
      }
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to save item');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <SectionHeader 
          title="Menu"
          highlight="Management"
          align="left"
          className="mb-0"
        />
        <Button onClick={() => openModal()} icon={Plus}>
          Add New Item
        </Button>
      </div>

      {loading ? (
        <div className="py-32">
          <Loader message="Organizing your culinary collection..." />
        </div>
      ) : (
        <Card className="overflow-hidden" shadow="sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--gray-100)] text-[11px] text-[var(--gray-400)] font-black uppercase tracking-[0.2em] bg-[var(--bg-light)]">
                  <th className="p-5 font-black">Image</th>
                  <th className="p-5 font-black">Name</th>
                  <th className="p-5 font-black">Category</th>
                  <th className="p-5 font-black">Price</th>
                  <th className="p-5 font-black">Status</th>
                  <th className="p-5 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item._id} className="border-b border-[var(--gray-100)] last:border-0 hover:bg-[var(--bg-light)] transition-colors">
                    <td className="p-5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[var(--gray-100)] shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-5 font-bold text-[var(--dark)] text-[15px]">{item.name}</td>
                    <td className="p-5 font-bold text-[var(--text-secondary)] text-[14px] uppercase tracking-wider">{item.category}</td>
                    <td className="p-5 font-black text-[var(--primary)] text-[15px]">₹{item.price}</td>
                    <td className="p-5">
                      <label className="flex items-center cursor-pointer w-fit">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={item.available}
                            onChange={() => handleToggleAvailable(item._id, item.available)}
                          />
                          <div className={`block w-12 h-7 rounded-full transition-colors duration-300 ${item.available ? 'bg-green-500' : 'bg-[var(--gray-200)]'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 shadow-md ${item.available ? 'transform translate-x-5' : ''}`}></div>
                        </div>
                      </label>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => openModal(item)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => setItemToDelete(item._id)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--primary)] bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal & Delete UI... (simplified for brevity) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl relative z-10 overflow-hidden border border-[var(--gray-200)]">
              <div className="px-8 py-6 border-b border-[var(--gray-100)] flex justify-between items-center bg-[var(--bg-light)]/50">
                <h3 className="text-xl font-black text-[var(--dark)] uppercase tracking-tighter">{editingItem ? 'Edit Item' : 'New Item'}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 bg-white rounded-full shadow-sm"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <input type="text" placeholder="Item Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`premium-input ${formErrors.name ? 'border-red-400 focus:border-red-500' : ''}`} />
                    {formErrors.name && <p className="text-[11px] font-bold text-red-500 mt-1 ml-2">{formErrors.name}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={`premium-input ${formErrors.price ? 'border-red-400 focus:border-red-500' : ''}`} />
                      {formErrors.price && <p className="text-[11px] font-bold text-red-500 mt-1 ml-2">{formErrors.price}</p>}
                    </div>
                    <div className="relative">
                      {!showNewCategoryInput ? (
                        <div className="flex gap-2">
                          <CustomDropdown 
                            value={formData.category} 
                            onChange={val => setFormData({...formData, category: val})} 
                            options={existingCategories.map(c => ({label: c, value: c}))} 
                            className="flex-1"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowNewCategoryInput(true)}
                            className="w-14 h-14 bg-white border border-[var(--gray-200)] rounded-2xl flex items-center justify-center text-[var(--primary)] hover:bg-red-50 transition-colors shadow-sm"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="New Category" 
                            autoFocus
                            onBlur={(e) => { if(!e.target.value) setShowNewCategoryInput(false) }}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className="premium-input flex-1" 
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowNewCategoryInput(false)}
                            className="w-14 h-14 bg-white border border-[var(--gray-200)] rounded-2xl flex items-center justify-center text-[var(--gray-400)] hover:bg-[var(--bg-light)] transition-colors shadow-sm"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-[var(--gray-400)] uppercase tracking-[0.2em] mb-3 ml-2">Rating ({formData.rating} Stars)</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      step="0.5" 
                      value={formData.rating} 
                      onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} 
                      className="w-full accent-[var(--primary)] h-2 bg-[var(--gray-100)] rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 px-1">
                      {[1,2,3,4,5].map(n => <span key={n} className="text-[10px] font-bold text-[var(--gray-300)]">{n}</span>)}
                    </div>
                  </div>
                  <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="premium-input h-24 resize-none" />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1 h-14">Save</Button>
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 h-14">Cancel</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setItemToDelete(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl relative z-10 p-10 text-center">
              <div className="w-20 h-20 bg-red-50 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 size={32} /></div>
              <h3 className="text-2xl font-black text-[var(--dark)] mb-4">Delete Item?</h3>
              <p className="text-[var(--text-secondary)] font-medium mb-10 leading-relaxed">This action is permanent and cannot be undone.</p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setItemToDelete(null)} className="flex-1">Cancel</Button>
                <Button onClick={async () => {
                  const res = await deleteMenuItem(itemToDelete);
                  if (res.success) {
                    toast.success('Deleted');
                    setItems(items.filter(i => i._id !== itemToDelete));
                    setItemToDelete(null);
                  }
                }} className="flex-1">Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuManagement;
