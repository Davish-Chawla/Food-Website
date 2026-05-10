import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Star, Clock, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur'
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const res = await login(data.email, data.password);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`);
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Visual/Info (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[var(--dark)] relative overflow-hidden items-center justify-center p-20">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--primary)] opacity-[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--primary)] opacity-[0.03] rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-lg"
        >
          <span className="text-[var(--primary)] font-black text-xs uppercase tracking-[0.3em] mb-6 block">Premium Access</span>
          <h2 className="text-6xl font-black text-white leading-[1.1] mb-8">
            Experience the <br />
            <span className="text-[var(--primary)]">Art of Taste</span>
          </h2>
          <p className="text-[var(--gray-400)] text-xl font-medium leading-relaxed mb-12">
            Join thousands of food lovers who enjoy curated meals, 
            exclusive restaurant access, and lightning-fast delivery.
          </p>

          <div className="grid gap-6">
            {[
              { icon: <ShieldCheck size={20} />, title: "Secure Checkout", desc: "Enterprise-grade encryption for all payments." },
              { icon: <Star size={20} />, title: "Loyalty Perks", desc: "Earn points and unlock member-only discounts." },
              { icon: <Clock size={20} />, title: "Live Tracking", desc: "Monitor your delivery in real-time." }
            ].map((item, i) => (
              <div key={i} className="flex gap-5 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 group hover:bg-white/10 transition-colors">
                <div className="text-[var(--primary)]">{item.icon}</div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                  <p className="text-white/60 text-xs font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--bg-light)] lg:bg-white">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-[var(--dark)] mb-3">Welcome Back</h1>
            <p className="text-[var(--text-secondary)] text-lg font-medium">Please sign in to your account</p>
          </div>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-500 font-bold text-sm"
            >
              <AlertCircle size={18} />
              {errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[13px] font-black text-[var(--gray-400)] uppercase tracking-widest mb-3 px-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[var(--gray-400)] group-focus-within:text-[var(--primary)] transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`w-full pl-14 pr-4 py-4 bg-[var(--bg-light)] rounded-2xl border-2 transition-all font-medium text-[15px] outline-none ${errors.email ? 'border-red-300 bg-red-50/30 focus:border-red-500' : 'border-transparent focus:border-[var(--primary)] focus:bg-white'}`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="mt-2 ml-1 text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-3 px-1">
                <label className="text-[13px] font-black text-[var(--gray-400)] uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" size="sm" className="text-[12px] font-bold text-[var(--primary)] hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[var(--gray-400)] group-focus-within:text-[var(--primary)] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`w-full pl-14 pr-4 py-4 bg-[var(--bg-light)] rounded-2xl border-2 transition-all font-medium text-[15px] outline-none ${errors.password ? 'border-red-300 bg-red-50/30 focus:border-red-500' : 'border-transparent focus:border-[var(--primary)] focus:bg-white'}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-2 ml-1 text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full h-16 text-lg"
              icon={ArrowRight}
            >
              Login
            </Button>
          </form>

          <p className="mt-10 text-center text-[var(--text-secondary)] font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--primary)] font-black hover:underline ml-1">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
