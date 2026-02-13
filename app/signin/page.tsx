"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from "motion/react";
import { Mail, Lock, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { signIn } from '@/app/actions/auth';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const result = await signIn(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // Success will redirect via server action
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
          {/* Decorative Pattern Layer */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(163,240,193,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 text-center">
            {/* Logo Area */}
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
                Welcome Back
              </h2>
              <p className="text-white/40 text-[15px] mb-10 font-sans max-w-[200px] mx-auto">
                Securely access your institutional trading portal
              </p>

              <div className="text-[13px] text-white/20 font-sans">
                Don't have an account? <br />
                <Link href="/signup" className="text-accent-green underline hover:text-white transition-colors">Register Now</Link>
              </div>
            </motion.div>
          </div>

          {/* Abstract Provest Shapes */}
          <div className="absolute top-[-10%] left-[-10%] w-[250px] h-[250px] bg-accent-green/5 blur-[80px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-accent-green/5 blur-[80px] rounded-full" />
        </div>

        {/* Right Side: Login Form Area */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-white text-[32px] sm:text-[36px] font-bold mb-3 tracking-tight">
                Sign In
              </h1>
              <p className="text-white/30 text-[15px] font-sans">
                Enter your credentials to manage your digital assets.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2 group">
                <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest ml-1 group-focus-within:text-accent-green transition-colors">
                   Email
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-green transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="name@company.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent-green/40 focus:bg-white/[0.05] transition-all font-outfit"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 group">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest group-focus-within:text-accent-green transition-colors">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[11px] text-accent-green/60 hover:text-accent-green transition-colors uppercase font-bold tracking-tighter">
                    Reset Password
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-green transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white outline-none focus:border-accent-green/40 transition-all font-outfit"
                    required
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

              {/* Remember Me Toggle (Optional Aesthetic) */}
              <div className="flex items-center gap-3 ml-1 group cursor-pointer">
                <div className="w-4 h-4 rounded border border-white/10 flex items-center justify-center bg-white/[0.02] group-hover:border-accent-green/40 transition-colors">
                    <div className="w-2 h-2 rounded-sm bg-accent-green opacity-0 group-hover:opacity-10 transition-opacity" />
                </div>
                <span className="text-[13px] text-white/20 font-sans group-hover:text-white/40 transition-colors">Keep me authenticated on this device</span>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-white text-bg-primary font-bold text-[17px] hover:bg-accent-green disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-xl mt-10 flex items-center justify-center gap-3 group"
              >
                {loading ? 'Authenticating...' : 'Access Account'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10 text-center lg:hidden">
                <p className="text-white/40 text-[14px]">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-accent-green underline font-bold">
                    Register Now
                  </Link>
                </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
