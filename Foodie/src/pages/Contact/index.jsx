import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { submitMessage } from '../../services/messageService';
import { Mail, Phone, MapPin, Send, AlertCircle } from 'lucide-react';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await submitMessage(data);
      if (res.success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-[var(--bg-light)] min-h-screen relative">
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex items-center justify-center"
          >
            <Loader message="Sending your message..." />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader 
          label="Get In Touch"
          title="Contact"
          highlight="Us"
          subtitle="Have questions or feedback? We'd love to hear from you."
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <Card className="p-8 flex items-center gap-6" shadow="sm">
              <div className="w-14 h-14 bg-red-50 text-[var(--primary)] rounded-2xl flex items-center justify-center shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-[12px] font-black text-[var(--gray-400)] uppercase tracking-widest">Email Us</p>
                <p className="font-bold text-[var(--dark)]">support@foodiehub.com</p>
              </div>
            </Card>
            <Card className="p-8 flex items-center gap-6" shadow="sm">
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-[12px] font-black text-[var(--gray-400)] uppercase tracking-widest">Call Us</p>
                <p className="font-bold text-[var(--dark)]">+91 98765 43210</p>
              </div>
            </Card>
            <Card className="p-8 flex items-center gap-6" shadow="sm">
              <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-[12px] font-black text-[var(--gray-400)] uppercase tracking-widest">Visit Us</p>
                <p className="font-bold text-[var(--dark)]">123 Food Street, Tasty City</p>
              </div>
            </Card>
          </div>

          <Card className="lg:col-span-2 p-10 md:p-12" shadow="lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    {...register('name', { required: 'Name is required' })}
                    className={`premium-input ${errors.name ? 'border-red-400 focus:border-red-500 bg-red-50/30' : ''}`} 
                  />
                  {errors.name && <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.name.message}</p>}
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                    })}
                    className={`premium-input ${errors.email ? 'border-red-400 focus:border-red-500 bg-red-50/30' : ''}`} 
                  />
                  {errors.email && <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.email.message}</p>}
                </div>
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Subject" 
                  {...register('subject', { required: 'Subject is required' })}
                  className={`premium-input ${errors.subject ? 'border-red-400 focus:border-red-500 bg-red-50/30' : ''}`} 
                />
                {errors.subject && <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.subject.message}</p>}
              </div>
              <div>
                <textarea 
                  placeholder="Your Message" 
                  {...register('message', { required: 'Message is required' })}
                  className={`premium-input h-40 resize-none ${errors.message ? 'border-red-400 focus:border-red-500 bg-red-50/30' : ''}`} 
                />
                {errors.message && <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.message.message}</p>}
              </div>
              <Button type="submit" size="lg" className="w-full h-14" icon={Send} loading={isSubmitting}>
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;


