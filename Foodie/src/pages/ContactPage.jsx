import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setShowSuccess(false), 5000);
    } else {
      const firstError = document.querySelector('.border-red-500');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const InputField = ({ label, name, placeholder, type = "text", textArea = false }) => (
    <div className="space-y-2">
      <label className="text-sm font-extrabold text-[#2F3542]">{label} *</label>
      <div className="relative">
        {textArea ? (
          <textarea
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            placeholder={placeholder}
            rows="5"
            className={`w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border-2 transition-all outline-none resize-none ${
              errors[name] ? 'border-red-500' : formData[name] ? 'border-green-500' : 'border-transparent focus:border-[#FF4757] focus:bg-white'
            }`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border-2 transition-all outline-none ${
              errors[name] ? 'border-red-500' : formData[name] ? 'border-green-500' : 'border-transparent focus:border-[#FF4757] focus:bg-white'
            }`}
          />
        )}
        {formData[name] && !errors[name] && <div className="absolute right-4 top-4 text-green-500">✓</div>}
      </div>
      {errors[name] && <p className="text-red-500 text-xs font-bold flex items-center gap-1">⚠️ {errors[name]}</p>}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-24 min-h-screen bg-[#F8F9FA]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <p className="text-[#FF4757] font-black text-xs uppercase tracking-[0.2em] mb-4">— GET IN TOUCH</p>
          <h1 className="text-5xl font-black text-[#2F3542] mb-4">Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4757] to-[#FFA502]">Us</span></h1>
          <p className="text-[#747D8C] text-lg max-w-2xl mx-auto font-medium">
            Have a question or feedback? We'd love to hear from you. 
            Get in touch with our team today.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {[
              { icon: Phone, title: 'Call Us', content: '+91 98765 43210', color: 'bg-blue-50 text-blue-500' },
              { icon: MessageCircle, title: 'WhatsApp', content: '+91 98765 43210', color: 'bg-green-50 text-green-500', isWA: true },
              { icon: MapPin, title: 'Our Location', content: 'Rajpura, Patiala, Punjab, India', color: 'bg-red-50 text-[#FF4757]' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex items-center gap-6 group hover:scale-[1.02] transition-all">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center shrink-0 shadow-inner`}>
                  <item.icon size={28} />
                </div>
                <div>
                  <h4 className="font-black text-[#2F3542] mb-1">{item.title}</h4>
                  <p className="text-[#747D8C] font-bold text-sm">{item.content}</p>
                  {item.isWA && (
                    <a 
                      href="https://wa.me/919876543210" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-500 text-xs font-black uppercase mt-2 inline-block hover:underline"
                    >
                      Chat Now →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden">
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-0 left-0 w-full bg-green-500 text-white p-4 flex items-center justify-center gap-3 font-bold z-10"
                  >
                    <CheckCircle2 size={20} />
                    Message sent! We'll get back to you within 24 hours.
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField label="Full Name" name="name" placeholder="Enter your name" />
                  <InputField label="Email Address" name="email" placeholder="Enter your email" type="email" />
                </div>
                <InputField label="Subject" name="subject" placeholder="How can we help?" />
                <InputField label="Message" name="message" placeholder="Your message here..." textArea />
                
                <button type="submit" className="w-full btn-gradient py-5 text-xl flex items-center justify-center gap-3">
                  <Send size={24} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-20 w-full h-[450px] bg-white rounded-[3rem] shadow-2xl flex flex-col items-center justify-center border border-gray-100 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#F8F9FA] opacity-50"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MapPin size={40} className="text-[#FF4757]" />
            </div>
            <h3 className="text-2xl font-black text-[#2F3542] mb-2">Our Office</h3>
            <p className="text-[#747D8C] font-bold">Rajpura, Patiala, Punjab, India</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
