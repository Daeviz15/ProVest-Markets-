"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from "motion/react";
import { Lock, EyeOff, Eye, ArrowRight, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const } 
    }
  };

  // Password strength checks
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    match: password.length > 0 && password === confirmPassword,
  };

  const allValid = checks.length && checks.uppercase && checks.number && checks.match;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!allValid) return;

    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg-primary flex items-center justify-center p-4 sm:p-6 lg:p-8 font-outfit">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-green/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-green/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const }}
        className="w-full max-w-[1000px] bg-[#0A0E1A]/80 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] relative z-20"
      >
        {/* Left Side: Brand Panel */}
        <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-accent-green/10 via-[#0A0E1A] to-[#0A0E1A] border-r border-white/5">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(163,240,193,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="flex items-center gap-0 mb-12">
              <span className="text-accent-green text-[28px] font-pacifico -mr-1">Provest</span>
              <span className="text-white text-[28px] font-bold font-outfit">Markets</span>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="w-full max-w-[240px] mb-10 text-accent-green"
            >
              <ShieldCheck size={160} strokeWidth={0.5} className="mx-auto drop-shadow-[0_0_30px_rgba(163,240,193,0.3)]" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h2 className="text-white text-[28px] font-bold mb-4 uppercase tracking-tight">
                Secure Reset
              </h2>
              <p className="text-white/40 text-[15px] font-sans max-w-[220px] mx-auto">
                Create a strong new password to protect your digital assets
              </p>
            </motion.div>
          </div>

          <div className="absolute top-[-10%] left-[-10%] w-[250px] h-[250px] bg-accent-green/5 blur-[80px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-accent-green/5 blur-[80px] rounded-full" />
        </div>

        {/* Right Side: Form Area */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            {!success ? (
              <>
                <div className="mb-10 text-center lg:text-left">
                  <h1 className="text-white text-[32px] sm:text-[36px] font-bold mb-3 tracking-tight">
                    New Password
                  </h1>
                  <p className="text-white/30 text-[15px] font-sans">
                    Choose a strong, unique password to secure your account.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password Field */}
                  <div className="space-y-2 group">
                    <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest ml-1 group-focus-within:text-accent-green transition-colors">
                       New Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-green transition-colors">
                        <Lock size={18} />
                      </div>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white outline-none focus:border-accent-green/40 focus:bg-white/[0.05] transition-all font-outfit"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2 group">
                    <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest ml-1 group-focus-within:text-accent-green transition-colors">
                       Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-green transition-colors">
                        <Lock size={18} />
                      </div>
                      <input 
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white outline-none focus:border-accent-green/40 focus:bg-white/[0.05] transition-all font-outfit"
                        required
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                        {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Checklist */}
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 space-y-2.5">
                    {[
                      { label: 'At least 8 characters', valid: checks.length },
                      { label: 'One uppercase letter', valid: checks.uppercase },
                      { label: 'One number', valid: checks.number },
                      { label: 'Passwords match', valid: checks.match },
                    ].map((check, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                          check.valid
                            ? 'bg-accent-green/20 text-accent-green'
                            : 'bg-white/[0.04] text-white/20'
                        }`}>
                          {check.valid ? <CheckCircle size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                        </div>
                        <span className={`text-[13px] font-sans transition-colors ${check.valid ? 'text-accent-green' : 'text-white/30'}`}>
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[14px] font-sans flex items-center gap-3"
                    >
                      <AlertCircle size={16} className="shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading || !allValid}
                    className="w-full py-5 rounded-2xl bg-white text-bg-primary font-bold text-[17px] hover:bg-accent-green disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-xl mt-4 flex items-center justify-center gap-3 group"
                  >
                    {loading ? 'Updating Password...' : 'Set New Password'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </>
            ) : (
              /* ======================== SUCCESS STATE ======================== */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center lg:text-left"
              >
                <div className="w-20 h-20 rounded-3xl bg-accent-green/10 border border-accent-green/20 flex items-center justify-center mx-auto lg:mx-0 mb-8">
                  <CheckCircle size={36} className="text-accent-green" />
                </div>

                <h1 className="text-white text-[32px] sm:text-[36px] font-bold mb-4 tracking-tight">
                  Password Updated
                </h1>
                <p className="text-white/40 text-[15px] font-sans mb-10 max-w-[380px]">
                  Your password has been successfully reset. You can now sign in with your new credentials.
                </p>

                <Link 
                  href="/signin" 
                  className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-bg-primary font-bold text-[17px] hover:bg-accent-green transition-all group"
                >
                  Continue to Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
