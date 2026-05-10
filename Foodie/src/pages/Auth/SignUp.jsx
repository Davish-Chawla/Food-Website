import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, CheckCircle2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { register: registerUser } = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur'
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const res = await registerUser(data);
      if (res.success) {
        toast.success(`Welcome to FoodieHub, ${res.user.name}! 🎉`);
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Right side - Visual/Info (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[var(--dark)] relative overflow-hidden items-center justify-center p-20 order-last">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[var(--primary)] opacity-[0.03] rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[var(--primary)] opacity-[0.03] rounded-full blur-[100px] translate-y-1/3 translate-x-1/4" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-lg"
        >
          <div className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center text-[var(--primary)] mb-8 border border-white/10">
            <Sparkles size={32} />
          </div>
          <h2 className="text-6xl font-black text-white leading-[1.1] mb-8">
            Start Your <br />
            <span className="text-[var(--primary)]">Gourmet Journey</span>
          </h2>
          <p className="text-[var(--gray-400)] text-xl font-medium leading-relaxed mb-12">
            Join our community of food enthusiasts and get access to 
            curated collections and premium dining experiences.
          </p>

          <div className="space-y-6">
            {[
              "Personalized food recommendations",
              "Priority delivery during peak hours",
              "Exclusive invitations to tasting events"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-white">
                  <CheckCircle2 size={18} />
                </div>
                <p className="text-white font-bold text-[15px]">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--bg-light)] lg:bg-white">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-[var(--dark)] mb-3">Create Account</h1>
            <p className="text-[var(--text-secondary)] text-lg font-medium">Join FoodieHub today</p>
          </div>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-500 font-bold text-sm"
            >
              <AlertCircle size={18} />
              {errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-black text-[var(--gray-400)] uppercase mb-2 px-1">Full Name</label>
                <div className="relative group">
                  <User className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-red-400' : 'text-[var(--gray-400)] group-focus-within:text-[var(--primary)]'}`} size={18} />
                  <input 
                    type="text" 
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: { value: 3, message: 'Minimum 3 characters' }
                    })} 
                    className={`w-full pl-12 pr-4 py-4 bg-[var(--bg-light)] rounded-2xl border-2 transition-all font-medium text-[15px] outline-none ${errors.name ? 'border-red-300 bg-red-50/30 focus:border-red-500' : 'border-transparent focus:border-[var(--primary)] focus:bg-white'}`} 
                    placeholder="John Doe" 
                  />
                </div>
                {errors.name && <p className="mt-2 ml-1 text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-[13px] font-black text-[var(--gray-400)] uppercase mb-2 px-1">Phone</label>
                <div className="relative group">
                  <Phone className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-red-400' : 'text-[var(--gray-400)] group-focus-within:text-[var(--primary)]'}`} size={18} />
                  <input 
                    type="tel" 
                    {...register('phone', { 
                      required: 'Phone is required',
                      pattern: { value: /^[0-9]{10}$/, message: 'Must be 10 digits' }
                    })} 
                    className={`w-full pl-12 pr-4 py-4 bg-[var(--bg-light)] rounded-2xl border-2 transition-all font-medium text-[15px] outline-none ${errors.phone ? 'border-red-300 bg-red-50/30 focus:border-red-500' : 'border-transparent focus:border-[var(--primary)] focus:bg-white'}`} 
                    placeholder="9876543210" 
                  />
                </div>
                {errors.phone && <p className="mt-2 ml-1 text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-black text-[var(--gray-400)] uppercase mb-2 px-1">Email Address</label>
              <div className="relative group">
                <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-[var(--gray-400)] group-focus-within:text-[var(--primary)]'}`} size={18} />
                <input 
                  type="email" 
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })} 
                  className={`w-full pl-12 pr-4 py-4 bg-[var(--bg-light)] rounded-2xl border-2 transition-all font-medium text-[15px] outline-none ${errors.email ? 'border-red-300 bg-red-50/30 focus:border-red-500' : 'border-transparent focus:border-[var(--primary)] focus:bg-white'}`} 
                  placeholder="name@example.com" 
                />
              </div>
              {errors.email && <p className="mt-2 ml-1 text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-black text-[var(--gray-400)] uppercase mb-2 px-1">Password</label>
              <div className="relative group">
                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-[var(--gray-400)] group-focus-within:text-[var(--primary)]'}`} size={18} />
                <input 
                  type="password" 
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' }
                  })} 
                  className={`w-full pl-12 pr-4 py-4 bg-[var(--bg-light)] rounded-2xl border-2 transition-all font-medium text-[15px] outline-none ${errors.password ? 'border-red-300 bg-red-50/30 focus:border-red-500' : 'border-transparent focus:border-[var(--primary)] focus:bg-white'}`} 
                  placeholder="••••••••" 
                />
              </div>
              {errors.password && <p className="mt-2 ml-1 text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full h-16 text-lg mt-4"
              icon={ArrowRight}
            >
              Sign Up
            </Button>
          </form>

          <p className="mt-10 text-center text-[var(--text-secondary)] font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--primary)] font-black hover:underline ml-1">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
