"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from "motion/react";
import { Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';
import { requestPasswordReset } from '@/app/actions/auth';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

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
    const result = await requestPasswordReset(formData);

    if (result?.error) {
      setError(result.error);
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
              <KeyRound size={160} strokeWidth={0.5} className="mx-auto drop-shadow-[0_0_30px_rgba(163,240,193,0.3)]" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h2 className="text-white text-[28px] font-bold mb-4 uppercase tracking-tight">
                Account Recovery
              </h2>
              <p className="text-white/40 text-[15px] mb-10 font-sans max-w-[220px] mx-auto">
                Securely reset your password and regain access to your portfolio
              </p>

              <div className="text-[13px] text-white/20 font-sans">
                Remember your password? <br />
                <Link href="/signin" className="text-accent-green underline hover:text-white transition-colors">Sign In</Link>
              </div>
            </motion.div>
          </div>

          {/* Abstract Shapes */}
          <div className="absolute top-[-10%] left-[-10%] w-[250px] h-[250px] bg-accent-green/5 blur-[80px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-accent-green/5 blur-[80px] rounded-full" />
        </div>

        {/* Right Side: Form Area */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            {!success ? (
              <>
                {/* Back Link */}
                <Link href="/signin" className="inline-flex items-center gap-2 text-white/30 text-[13px] font-sans hover:text-accent-green transition-colors mb-8">
                  <ArrowLeft size={14} />
                  Back to Sign In
                </Link>

                <div className="mb-10 text-center lg:text-left">
                  <h1 className="text-white text-[32px] sm:text-[36px] font-bold mb-3 tracking-tight">
                    Reset Password
                  </h1>
                  <p className="text-white/30 text-[15px] font-sans">
                    Enter the email associated with your account and we&apos;ll send a secure link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2 group">
                    <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest ml-1 group-focus-within:text-accent-green transition-colors">
                       Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-green transition-colors">
                        <Mail size={18} />
                      </div>
                      <input 
                        name="email"
                        type="email" 
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent-green/40 focus:bg-white/[0.05] transition-all font-outfit"
                        required
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[14px] font-sans"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading || !email}
                    className="w-full py-5 rounded-2xl bg-white text-bg-primary font-bold text-[17px] hover:bg-accent-green disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-xl mt-4 flex items-center justify-center gap-3 group"
                  >
                    {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
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
                  Check Your Email
                </h1>
                <p className="text-white/40 text-[15px] font-sans mb-3 max-w-[380px]">
                  We&apos;ve sent a secure password reset link to:
                </p>
                <p className="text-accent-green font-mono text-[16px] font-bold mb-8 bg-accent-green/5 border border-accent-green/10 rounded-2xl py-3 px-5 inline-block">
                  {email}
                </p>

                <div className="space-y-4 text-white/30 text-[14px] font-sans mb-10">
                  <p>The link will expire in <strong className="text-white/50">24 hours</strong>.</p>
                  <p>Didn&apos;t receive the email? Check your spam folder or try again.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => { setSuccess(false); setEmail(''); }}
                    className="flex-1 py-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white font-semibold text-[15px] hover:bg-white/[0.08] transition-all"
                  >
                    Try Different Email
                  </button>
                  <Link href="/signin" className="flex-1 py-4 rounded-2xl bg-white text-bg-primary font-bold text-[15px] hover:bg-accent-green transition-all text-center">
                    Back to Sign In
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Mobile only */}
            {!success && (
              <div className="mt-10 text-center lg:hidden">
                <p className="text-white/40 text-[14px]">
                  Remember your password?{" "}
                  <Link href="/signin" className="text-accent-green underline font-bold">
                    Sign In
                  </Link>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
