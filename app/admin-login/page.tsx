"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, EyeOff, Eye, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Redirect to admin — server-side layout guard verifies admin status
      window.location.href = '/admin/users';
    } catch {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0D14] flex items-center justify-center p-4 font-outfit">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-dash-accent/[0.02] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/[0.02] blur-[150px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <ShieldCheck className="text-dash-accent" size={28} />
          <div className="flex items-center">
            <span className="font-pacifico text-[22px] text-dash-accent">Provest</span>
            <span className="font-outfit text-[22px] font-bold text-white -ml-0.5">Admin</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#0C101A] border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white">Admin Console</h1>
            <p className="text-sm text-text-muted mt-1">Sign in with your admin credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Email</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-dash-accent transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@provestmarkets.com"
                  required
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3 pl-11 pr-4 text-white text-sm outline-none focus:border-dash-accent/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Password</label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-dash-accent transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3 pl-11 pr-12 text-white text-sm outline-none focus:border-dash-accent/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-dash-error/10 border border-dash-error/20"
              >
                <AlertTriangle size={14} className="text-dash-error shrink-0" />
                <span className="text-xs font-semibold text-dash-error">{error}</span>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-dash-accent text-[#0A0D14] font-bold text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-[0_10px_30px_-10px_rgba(163,240,193,0.2)]"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0A0D14]/30 border-t-[#0A0D14] rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                'Sign In to Admin'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-white/[0.06]">
            <p className="text-[10px] text-text-muted text-center leading-relaxed">
              This console is restricted to authorized administrators only.
              All actions are logged and audited.
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
