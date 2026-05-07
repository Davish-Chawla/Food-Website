import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const data = await login(email, password);
      if (data.success) {
        toast.success(`Welcome back, ${data.user.name}!`);
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid credentials');
      setPassword(''); // Clear password on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex pt-20">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h1 className="text-4xl font-black text-[#2F3542] mb-3">Welcome Back! 👋</h1>
            <p className="text-[#747D8C] text-lg font-medium">Please enter your details to sign in.</p>
          </div>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mb-6 p-4 bg-red-50 text-red-500 rounded-xl font-bold border border-red-100 flex items-center gap-3 shadow-sm"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              {errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#2F3542] mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A4B0BE] group-focus-within:text-[#FF4757] transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-white border-2 border-transparent text-[#2F3542] text-lg font-medium rounded-2xl focus:outline-none focus:border-[#FF4757] focus:ring-4 focus:ring-[#FF4757]/10 transition-all shadow-sm"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-[#2F3542]">Password</label>
                <a href="#" className="text-sm font-bold text-[#FF4757] hover:text-[#e63e4c] transition-colors">Forgot Password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A4B0BE] group-focus-within:text-[#FF4757] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-white border-2 border-transparent text-[#2F3542] text-lg font-medium rounded-2xl focus:outline-none focus:border-[#FF4757] focus:ring-4 focus:ring-[#FF4757]/10 transition-all shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#FF4757] text-white text-lg font-black rounded-2xl shadow-xl shadow-[#FF4757]/30 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#FF4757]/40 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-[#747D8C] font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#FF4757] font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Image/Benefits */}
      <div className="hidden lg:flex w-1/2 bg-[#FF4757] p-12 items-center justify-center relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-white max-w-lg"
        >
          <h2 className="text-5xl font-black mb-6 leading-tight">Fastest Delivery & Easy Pick-up</h2>
          <p className="text-xl font-medium text-white/80 mb-10">Sign in to access your saved addresses, track your orders, and earn delicious rewards.</p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
              <div className="bg-white text-[#FF4757] p-2 rounded-xl"><CheckCircle2 size={24} /></div>
              <p className="font-bold text-lg">Earn points on every order</p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
              <div className="bg-white text-[#FF4757] p-2 rounded-xl"><CheckCircle2 size={24} /></div>
              <p className="font-bold text-lg">Save multiple delivery addresses</p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
              <div className="bg-white text-[#FF4757] p-2 rounded-xl"><CheckCircle2 size={24} /></div>
              <p className="font-bold text-lg">Exclusive member-only discounts</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
