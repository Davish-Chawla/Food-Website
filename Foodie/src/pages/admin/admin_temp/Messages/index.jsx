import React, { useEffect, useState } from 'react';
import { getMessages, markMessageAsRead, deleteMessage } from '../../../services/messageService';
import toast from 'react-hot-toast';
import { Mail, Trash2, Eye, Calendar, User, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../../components/ui/Card';
import SectionHeader from '../../../components/common/SectionHeader';
import Button from '../../../components/ui/Button';
import Loader from '../../../components/ui/Loader';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getMessages();
      if (res.success) {
        setMessages(res.data);
      }
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await markMessageAsRead(id);
      if (res.success) {
        setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
        if (selectedMessage?._id === id) {
          setSelectedMessage({ ...selectedMessage, isRead: true });
        }
      }
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await deleteMessage(id);
      if (res.success) {
        toast.success('Message deleted');
        setMessages(messages.filter(m => m._id !== id));
        setSelectedMessage(null);
      }
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      handleMarkAsRead(msg._id);
    }
  };

  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Customer"
        highlight="Messages"
        align="left"
        className="mb-0"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Messages List */}
        <Card className="lg:col-span-5 overflow-hidden h-[700px] flex flex-col" shadow="sm">
          <div className="p-6 border-b border-[var(--gray-100)] bg-[var(--bg-light)]/50 flex justify-between items-center">
            <h3 className="text-sm font-black text-[var(--dark)] uppercase tracking-widest">Inbox ({messages.filter(m => !m.isRead).length} Unread)</h3>
            <button onClick={fetchMessages} className="text-[var(--primary)] font-bold text-xs hover:underline">Refresh</button>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="py-32">
                <Loader message="Gathering customer feedback..." />
              </div>
            ) : messages.length === 0 ? (
              <div className="p-20 text-center text-[var(--text-secondary)] font-bold">No messages found.</div>
            ) : (
              <div className="divide-y divide-[var(--gray-100)]">
                {messages.map((msg) => (
                  <button
                    key={msg._id}
                    onClick={() => openMessage(msg)}
                    className={`w-full p-6 text-left transition-all hover:bg-[var(--bg-light)] group relative ${selectedMessage?._id === msg._id ? 'bg-[var(--bg-light)] border-l-4 border-l-[var(--primary)]' : ''}`}
                  >
                    {!msg.isRead && <span className="absolute top-7 right-6 w-2.5 h-2.5 bg-[var(--primary)] rounded-full shadow-[0_0_8px_var(--primary)]" />}
                    <div className="flex justify-between items-start mb-2">
                      <p className={`text-[15px] ${msg.isRead ? 'font-medium text-[var(--text-secondary)]' : 'font-black text-[var(--dark)]'}`}>
                        {msg.name}
                      </p>
                      <span className="text-[10px] font-bold text-[var(--gray-400)] uppercase">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${msg.isRead ? 'text-[var(--gray-400)]' : 'text-[var(--dark)] font-bold'}`}>
                      {msg.subject}
                    </p>
                    <p className="text-xs text-[var(--gray-400)] line-clamp-1 mt-1">
                      {msg.message}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Message Content */}
        <Card className="lg:col-span-7 h-[700px] flex flex-col relative overflow-hidden" shadow="md">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full"
              >
                {/* Header */}
                <div className="p-8 border-b border-[var(--gray-100)] bg-[var(--bg-light)]/30">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-[var(--dark)] tracking-tight">{selectedMessage.name}</h2>
                        <p className="text-sm font-medium text-[var(--text-secondary)]">{selectedMessage.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleDelete(selectedMessage._id)}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2 text-[11px] font-black text-[var(--gray-400)] uppercase tracking-widest">
                      <Calendar size={14} className="text-[var(--primary)]" />
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-black text-[var(--gray-400)] uppercase tracking-widest">
                      <User size={14} className="text-[var(--primary)]" />
                      ID: {selectedMessage._id.substring(18)}
                    </div>
                    {selectedMessage.isRead && (
                      <div className="flex items-center gap-2 text-[11px] font-black text-green-500 uppercase tracking-widest">
                        <CheckCircle2 size={14} />
                        Read
                      </div>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                  <h4 className="text-2xl font-black text-[var(--dark)] mb-8 tracking-tight border-l-4 border-l-[var(--primary)] pl-6">
                    {selectedMessage.subject}
                  </h4>
                  <div className="bg-[var(--bg-light)]/50 p-8 rounded-[32px] border border-[var(--gray-100)] min-h-[200px]">
                    <p className="text-[var(--dark)] font-medium leading-relaxed whitespace-pre-wrap text-lg">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-[var(--gray-100)] flex justify-end gap-4">
                  <Button variant="dark" onClick={() => setSelectedMessage(null)}>
                    Close
                  </Button>
                  <a 
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex items-center gap-2 px-8 py-4 bg-[var(--primary)] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[var(--primary)]/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Mail size={18} /> Reply via Email
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-20">
                <div className="w-24 h-24 bg-[var(--bg-light)] rounded-[32px] flex items-center justify-center text-[var(--gray-200)] mb-8 border border-[var(--gray-100)]">
                  <Mail size={48} strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-black text-[var(--dark)] mb-3">Select a Message</h3>
                <p className="text-[var(--text-secondary)] font-medium max-w-xs leading-relaxed">
                  Choose a conversation from the sidebar to read and manage customer inquiries.
                </p>
              </div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
};

export default AdminMessages;
