"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from "motion/react";
import { User, Mail, Globe, Users, Lock, EyeOff, ArrowRight } from 'lucide-react';
import { signUp } from '@/app/actions/auth';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const } 
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
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
        className="w-full max-w-[1100px] bg-[#0A0E1A]/80 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px] relative z-20"
      >
        {/* Left Side: Form Area */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col">
          {/* Logo Area */}
          <div className="flex items-center gap-0 mb-12 sm:mb-16">
            <span className="text-accent-green text-[28px] font-pacifico -mr-1">Provest</span>
            <span className="text-white text-[28px] font-bold font-outfit">Markets</span>
          </div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <h1 className="text-white text-[32px] sm:text-[40px] font-bold mb-8 leading-tight">
              Sign Up
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Login/Name Field */}
              <div className="space-y-2 group">
                <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest ml-1 group-focus-within:text-accent-green transition-colors">
                  Login <span className="text-accent-green">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-green transition-colors">
                    <User size={18} />
                  </div>
                  <input 
                    name="fullName"
                    type="text" 
                    placeholder="Enter your username"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent-green/40 focus:bg-white/[0.05] transition-all font-outfit"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2 group">
                <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest ml-1 group-focus-within:text-accent-green transition-colors">
                  Email <span className="text-accent-green">*</span>
                  <span className="capitalize text-[10px] font-medium ml-2 text-white/20 font-sans tracking-normal">You will receive an email confirmation</span>
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-green transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="Enter your email"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent-green/40 focus:bg-white/[0.05] transition-all font-outfit"
                  />
                </div>
              </div>

              {/* Country Field */}
              <div className="space-y-2 group">
                <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest ml-1">
                  Country
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20">
                    <Globe size={18} />
                  </div>
                  <select 
                    name="country"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-12 text-white outline-none focus:border-accent-green/40 transition-all font-outfit appearance-none"
                  >
                    <option value="" className="bg-[#0A0E1A]">Select Country</option>
                    <option value="US" className="bg-[#0A0E1A]">United States</option>
                    <option value="UK" className="bg-[#0A0E1A]">United Kingdom</option>
                    <option value="CA" className="bg-[#0A0E1A]">Canada</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Referrer Field */}
              <div className="space-y-2 group">
                <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest ml-1">
                  Referrer
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20">
                    <Users size={18} />
                  </div>
                  <input 
                    name="referrer"
                    type="text" 
                    placeholder="Enter referral code (Optional)"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent-green/40 transition-all font-outfit"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 group">
                <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest ml-1 group-focus-within:text-accent-green transition-colors">
                  Password <span className="text-accent-green">*</span>
                  <span className="capitalize text-[10px] font-medium ml-2 text-white/20 font-sans tracking-normal">(At least 8 symbols)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-green transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white outline-none focus:border-accent-green/40 transition-all font-outfit"
                  />
                  <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                    <EyeOff size={18} />
                  </button>
                </div>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[14px] font-sans">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 rounded-xl bg-accent-green/10 border border-accent-green/20 text-accent-green text-[14px] font-sans">
                  Success! Please check your email for verification.
                </div>
              )}

              {/* Terms Checkbox/Text placeholder */}
              <p className="text-[13px] text-white/30 leading-relaxed font-sans mt-8">
                By clicking "Sign Up" button, you agree to our <Link href="/terms" className="text-accent-green underline hover:text-white transition-colors">Terms of use</Link>
              </p>

              <button 
                type="submit"
                disabled={loading || success}
                className="w-full py-5 rounded-2xl bg-accent-green text-bg-primary font-bold text-[17px] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-[0_20px_40px_-10px_rgba(163,240,193,0.3)] mt-8"
              >
                {loading ? 'Processing...' : 'Sign Up'}
              </button>

              <div className="mt-8 text-center lg:hidden">
                <p className="text-white/40 text-[14px]">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-accent-green underline font-bold">
                    Sign In here
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Right Side: Visual Brand Area */}
        <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-accent-green/10 via-[#0A0E1A] to-[#0A0E1A]">
          {/* Decorative Pattern Layer */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(163,240,193,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-16 text-center">
            {/* Illustration */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="w-full max-w-[320px] mb-12"
            >
              <img src="/sign-up.svg" alt="Sign Up Illustration" className="w-full h-auto drop-shadow-2xl" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h2 className="text-white text-[32px] font-bold mb-4 leading-tight">
                Hello! Welcome to the <br /> <span className="text-accent-green">ProvestMarkets</span> platform
              </h2>
              <p className="text-white/40 text-[16px] mb-10 font-sans">
                If you already have an account
              </p>

              <Link 
                href="/signin"
                className="group flex items-center gap-3 px-10 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-bold text-[16px] hover:bg-accent-green hover:text-bg-primary hover:border-accent-green transition-all shadow-xl"
              >
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Abstract Provest Shapes */}
          <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-accent-green/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-5%] left-[-10%] w-[250px] h-[250px] bg-accent-green/5 blur-[80px] rounded-full" />
        </div>
      </motion.div>
    </main>
  );
}
