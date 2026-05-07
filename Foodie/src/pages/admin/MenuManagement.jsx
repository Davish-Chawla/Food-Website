import React, { useEffect, useState } from 'react';
import { getAdminMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../../services/adminService';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import CustomDropdown from '../../components/CustomDropdown';

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

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await deleteMenuItem(itemToDelete);
      if (res.success) {
        toast.success('Item deleted successfully');
        setItems(items.filter(i => i._id !== itemToDelete));
      }
    } catch (error) {
      toast.error('Failed to delete item');
    } finally {
      setItemToDelete(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-[800] text-[var(--dark-2)] tracking-tight">Menu Items</h1>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] hover:scale-[1.02] active:scale-95 text-white px-5 py-2.5 rounded-full font-[700] text-[15px] shadow-[var(--shadow-red)] transition-all"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add New Item
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[var(--primary)] font-[700]">Loading menu...</div>
      ) : (
        <div className="bg-white rounded-[20px] shadow-[var(--shadow-sm)] border border-[var(--gray-2)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--gray-3)] text-[13px] text-[var(--text-secondary)] uppercase tracking-wide bg-[var(--gray-1)]">
                  <th className="p-4 font-[700] whitespace-nowrap">Image</th>
                  <th className="p-4 font-[700]">Name</th>
                  <th className="p-4 font-[700]">Category</th>
                  <th className="p-4 font-[700]">Price</th>
                  <th className="p-4 font-[700]">Status</th>
                  <th className="p-4 font-[700] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item._id} className={`border-b border-[var(--gray-2)] last:border-0 hover:bg-[var(--gray-2)] transition-colors ${idx % 2 === 1 ? 'bg-[var(--gray-1)]' : 'bg-white'}`}>
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-[12px] overflow-hidden bg-[var(--gray-2)]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-[700] text-[var(--dark-2)] text-[15px]">{item.name}</td>
                    <td className="p-4 font-[600] text-[var(--text-secondary)] text-[14px]">{item.category}</td>
                    <td className="p-4 font-[800] text-[var(--primary)] text-[15px]">₹{item.price}</td>
                    <td className="p-4">
                      <label className="flex items-center cursor-pointer w-fit">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={item.available}
                            onChange={() => handleToggleAvailable(item._id, item.available)}
                          />
                          <div className={`block w-11 h-6 rounded-full transition-colors duration-300 ${item.available ? 'bg-[var(--success)]' : 'bg-[var(--gray-3)]'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${item.available ? 'transform translate-x-5' : ''}`}></div>
                        </div>
                      </label>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openModal(item)}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-[#3498DB] hover:bg-[#E3F2FD] transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} strokeWidth={2.5} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item._id)}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--primary)] hover:bg-[#FFF0F1] transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="px-6 py-4 border-b border-[var(--gray-2)] flex justify-between items-center bg-[var(--gray-1)]">
              <h3 className="text-[20px] font-[800] text-[var(--dark-2)]">
                {editingItem ? 'Edit Menu Item' : 'Add New Item'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[var(--gray-3)] rounded-full transition-colors">
                <X size={20} className="text-[var(--dark-2)]" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] font-[700] text-[var(--dark-2)] mb-1">Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-[var(--gray-3)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-[700] text-[var(--dark-2)] mb-1">Category</label>
                    {!showNewCategoryInput ? (
                      <CustomDropdown
                        value={formData.category}
                        onChange={(val) => {
                          if (val === 'ADD_NEW') {
                            setShowNewCategoryInput(true);
                            setFormData({...formData, category: ''});
                          } else {
                            setFormData({...formData, category: val});
                          }
                        }}
                        options={[
                          ...existingCategories.map(cat => ({ label: cat, value: cat })),
                          { label: 'Add New Category', value: 'ADD_NEW', isSpecial: true }
                        ]}
                        placeholder="Select Category"
                      />
                    ) : (
                      <div className="flex gap-2">
                        <input 
                          autoFocus
                          required
                          type="text" 
                          placeholder="New category..." 
                          value={formData.category} 
                          onChange={e => setFormData({...formData, category: e.target.value})} 
                          className="w-full px-4 py-2 border border-[var(--gray-3)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" 
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            setShowNewCategoryInput(false);
                            setFormData({...formData, category: existingCategories[0] || 'Pizza'});
                          }}
                          className="px-3 rounded-xl bg-[var(--gray-2)] hover:bg-[var(--gray-3)] text-[var(--dark-2)] transition-colors"
                          title="Cancel new category"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[14px] font-[700] text-[var(--dark-2)] mb-1">Price (₹)</label>
                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border border-[var(--gray-3)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                  </div>
                </div>
                
                {/* Star Rating Section */}
                <div>
                  <label className="block text-[14px] font-[700] text-[var(--dark-2)] mb-1">Rating</label>
                  <div className="flex items-center gap-2 bg-[var(--gray-1)] p-2.5 rounded-xl border border-[var(--gray-3)] w-fit">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className="transition-transform active:scale-90"
                      >
                        <Star 
                          size={24} 
                          fill={star <= formData.rating ? "#FFD700" : "none"} 
                          className={star <= formData.rating ? "text-[#FFD700]" : "text-[var(--gray-3)]"}
                          strokeWidth={2}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-[800] text-[var(--dark-2)] text-[14px]">{formData.rating}.0</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-[700] text-[var(--dark-2)] mb-1">Image</label>
                  <div className="flex items-center gap-4">
                    {formData.image && (
                      <div className="w-16 h-16 rounded-[12px] bg-[var(--gray-2)] overflow-hidden shrink-0 shadow-sm border border-[var(--gray-3)]">
                        <img src={formData.image} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="relative group cursor-pointer w-full h-16">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="flex items-center justify-center w-full h-full px-4 border-2 border-dashed border-[var(--gray-3)] rounded-xl group-hover:border-[var(--primary)] transition-colors bg-[var(--gray-1)] group-hover:bg-[#FFF0F1]">
                        <span className="text-[14px] font-[600] text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors">
                          {formData.image ? 'Change Image' : 'Click to Upload Image'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-[700] text-[var(--dark-2)] mb-1">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-[var(--gray-3)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" rows="2"></textarea>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-[14px] font-[600] text-[var(--dark-2)]">
                    <input type="checkbox" checked={formData.veg} onChange={e => setFormData({...formData, veg: e.target.checked})} className="w-4 h-4 accent-[var(--primary)]" />
                    Vegetarian
                  </label>
                  <label className="flex items-center gap-2 text-[14px] font-[600] text-[var(--dark-2)]">
                    <input type="checkbox" checked={formData.available} onChange={e => setFormData({...formData, available: e.target.checked})} className="w-4 h-4 accent-[var(--primary)]" />
                    Available
                  </label>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-full font-[700] text-[14px] text-[var(--dark-2)] bg-[var(--gray-2)] hover:bg-[var(--gray-3)] transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-full font-[700] text-[14px] text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] transition-colors shadow-sm">
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}  

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] w-full max-w-sm shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#FFF0F1] text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-[20px] font-[800] text-[var(--dark-2)] mb-2">Delete Item?</h3>
            <p className="text-[14px] text-[var(--text-secondary)] font-[500] mb-8">
              This action cannot be undone. Are you sure you want to permanently delete this menu item?
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-full font-[700] text-[14px] text-[var(--dark-2)] bg-[var(--gray-2)] hover:bg-[var(--gray-3)] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-full font-[700] text-[14px] text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
