import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, ShieldQuestion, CheckCircle2, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { checkEmail, resetPassword } from '../../services/authService';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';

const ForgotPassword = () => {
  const [step, setStep] = useState('email'); // 'email' | 'reset' | 'success'
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { 
    register: registerEmail, 
    handleSubmit: handleEmailSubmit, 
    formState: { errors: emailErrors } 
  } = useForm();

  const { 
    register: registerReset, 
    handleSubmit: handleResetSubmit, 
    watch,
    formState: { errors: resetErrors } 
  } = useForm();

  const password = watch('password');

  const onCheckEmail = async (data) => {
    setIsLoading(true);
    try {
      const res = await checkEmail(data.email);
      if (res.success) {
        setUserEmail(data.email);
        setStep('reset');
        toast.success('Account verified! Set your new password.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email not found');
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data) => {
    setIsLoading(true);
    try {
      const res = await resetPassword(userEmail, data.password);
      if (res.success) {
        setStep('success');
        toast.success('Password updated successfully! 🎉');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Visual/Info (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[var(--dark)] relative overflow-hidden items-center justify-center p-20">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--primary)] opacity-[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-lg"
        >
          <div className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center text-[var(--primary)] mb-8 border border-white/10">
            <Sparkles size={32} />
          </div>
          <h2 className="text-6xl font-black text-white leading-[1.1] mb-8">
            Recover Your <br />
            <span className="text-[var(--primary)]">Gourmet Profile</span>
          </h2>
          <p className="text-[var(--gray-400)] text-xl font-medium leading-relaxed mb-12">
            Don't worry! It happens to the best of us. We'll help you get back to 
            your favorite meals in just a few steps.
          </p>

          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-[var(--primary)]/20 rounded-full flex items-center justify-center text-[var(--primary)]">
                <ShieldQuestion size={20} />
              </div>
              <h4 className="text-white font-bold">Account Security</h4>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Verify your identity and set a strong new password to keep your 
              orders and preferences safe.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--bg-light)] lg:bg-white">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.div 
                key="email-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-10 text-center lg:text-left">
                  <Link to="/login" className="inline-flex items-center gap-2 text-[var(--primary)] font-bold text-sm mb-8 hover:gap-3 transition-all">
                    <ArrowLeft size={16} /> Back to Login
                  </Link>
                  <h1 className="text-4xl font-black text-[var(--dark)] mb-3">Forgot Password?</h1>
                  <p className="text-[var(--text-secondary)] text-lg font-medium">Verify your email to reset password</p>
                </div>

                <form onSubmit={handleEmailSubmit(onCheckEmail)} className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-black text-[var(--gray-400)] uppercase mb-3 px-1">Email Address</label>
                    <div className="relative group">
                      <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${emailErrors.email ? 'text-red-400' : 'text-[var(--gray-400)] group-focus-within:text-[var(--primary)]'}`} size={18} />
                      <input
                        type="email"
                        {...registerEmail('email', { 
                          required: 'Email is required',
                          pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                        })}
                        className={`premium-input !pl-14 ${emailErrors.email ? 'border-red-300' : ''}`}
                        placeholder="name@example.com"
                      />
                    </div>
                    {emailErrors.email && <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {emailErrors.email.message}</p>}
                  </div>

                  <Button type="submit" loading={isLoading} className="w-full h-16 text-lg" icon={ArrowRight}>
                    Verify Email
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 'reset' && (
              <motion.div 
                key="reset-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-10 text-center lg:text-left">
                  <button onClick={() => setStep('email')} className="inline-flex items-center gap-2 text-[var(--primary)] font-bold text-sm mb-8 hover:gap-3 transition-all">
                    <ArrowLeft size={16} /> Change Email
                  </button>
                  <h1 className="text-4xl font-black text-[var(--dark)] mb-3">New Password</h1>
                  <p className="text-[var(--text-secondary)] text-lg font-medium">Set a strong password for <span className="text-[var(--dark)] font-black">{userEmail}</span></p>
                </div>

                <form onSubmit={handleResetSubmit(onResetPassword)} className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-black text-[var(--gray-400)] uppercase mb-3 px-1">New Password</label>
                    <div className="relative group">
                      <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${resetErrors.password ? 'text-red-400' : 'text-[var(--gray-400)] group-focus-within:text-[var(--primary)]'}`} size={18} />
                      <input
                        type="password"
                        {...registerReset('password', { 
                          required: 'Password is required',
                          minLength: { value: 6, message: 'Minimum 6 characters' }
                        })}
                        className={`premium-input !pl-14 ${resetErrors.password ? 'border-red-300' : ''}`}
                        placeholder="••••••••"
                      />
                    </div>
                    {resetErrors.password && <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {resetErrors.password.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[13px] font-black text-[var(--gray-400)] uppercase mb-3 px-1">Confirm Password</label>
                    <div className="relative group">
                      <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${resetErrors.confirmPassword ? 'text-red-400' : 'text-[var(--gray-400)] group-focus-within:text-[var(--primary)]'}`} size={18} />
                      <input
                        type="password"
                        {...registerReset('confirmPassword', { 
                          required: 'Please confirm password',
                          validate: val => val === password || 'Passwords do not match'
                        })}
                        className={`premium-input !pl-14 ${resetErrors.confirmPassword ? 'border-red-300' : ''}`}
                        placeholder="••••••••"
                      />
                    </div>
                    {resetErrors.confirmPassword && <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {resetErrors.confirmPassword.message}</p>}
                  </div>

                  <Button type="submit" loading={isLoading} className="w-full h-16 text-lg" icon={CheckCircle2}>
                    Save New Password
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-inner">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl font-black text-[var(--dark)] mb-4">Password Saved!</h2>
                <p className="text-[var(--text-secondary)] text-lg font-medium mb-12 leading-relaxed">
                  Your password has been updated successfully. <br />
                  You can now use your new password to login.
                </p>
                <Button onClick={() => navigate('/login')} className="w-full h-16 text-lg" icon={ArrowRight}>
                  Return to Login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
