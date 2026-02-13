"use client";

import React, { useState } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff,
  Clock,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  X
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useLoading } from '../context/LoadingContext';
import { useNotification } from '../context/NotificationContext';
import { supabase } from '@/lib/supabase';

export default function SecurityPage() {
    const { user } = useUser();
    const { setIsLoading } = useLoading();
    const { addNotification } = useNotification();
    const [showPassword, setShowPassword] = useState(false);
    
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        addNotification(message, type);
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!passwordData.current) {
            showNotification("Please enter your current password", 'error');
            return;
        }

        if (passwordData.new.length < 6) {
            showNotification("New password must be at least 6 characters", 'error');
            return;
        }

        if (passwordData.new !== passwordData.confirm) {
            showNotification("New passwords do not match", 'error');
            return;
        }

        try {
            setIsLoading(true, "Updating security credentials...");
            const { error } = await supabase.auth.updateUser({
                password: passwordData.new
            });
            if (error) throw error;
            
            showNotification("Password updated successfully!", 'success');
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error: any) {
            showNotification(error.message || "Failed to update password", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 font-outfit px-2 sm:px-6 relative">
            {/* Toast Notification handled by global context */}
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-dash-accent/10 rounded-2xl">
                        <Lock className="text-dash-accent" size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Security Settings</h1>
                </div>
                <p className="text-text-muted font-medium ml-1">Manage your account security and authentication preferences</p>
            </div>

            <div className="space-y-8">
                {/* Password Update Section - Focused and Professional */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0C101A] border border-white/5 rounded-[32px] p-8 sm:p-12 shadow-xl relative overflow-hidden"
                >
                    {/* Subtle aesthetic glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-dash-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full pointer-events-none" />

                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white">Change Password</h3>
                            <p className="text-xs text-text-muted font-medium">Update your account password regularly to ensure security</p>
                        </div>
                        <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-3 bg-white/5 text-white/40 hover:text-white rounded-xl transition-all"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3 col-span-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Current Password</label>
                                <div className="relative group">
                                    <Key size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-dash-accent transition-colors" />
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={passwordData.current}
                                        onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-dash-accent/40 focus:bg-white/[0.04] transition-all font-medium"
                                        placeholder="Enter current password"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-dash-accent transition-colors" />
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-dash-accent/40 focus:bg-white/[0.04] transition-all font-medium"
                                        placeholder="Enter new password"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Confirm New Password</label>
                                <div className="relative group">
                                    <ShieldCheck size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-dash-accent transition-colors" />
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-dash-accent/40 focus:bg-white/[0.04] transition-all font-medium"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button className="px-12 py-5 bg-dash-accent text-bg-primary rounded-2xl font-black text-sm hover:shadow-2xl hover:shadow-dash-accent/30 active:scale-95 transition-all">
                                Update Credentials
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Additional Security Info Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-[#0C101A] to-dash-accent/5 border border-white/5 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl"
                >
                    <div className="p-5 bg-dash-accent/10 rounded-[28px]">
                        <Shield className="text-dash-accent" size={32} />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white mb-2">Automated Security Audit</h4>
                        <p className="text-sm text-text-muted leading-relaxed font-medium">
                            Your account is being monitored by our institutional-grade security systems. All active sessions are encrypted using end-to-end industry standards.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
