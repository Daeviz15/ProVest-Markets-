"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Mail, 
  User as UserIcon, 
  Shield, 
  Globe, 
  Copy, 
  Check,
  ChevronRight,
  LogOut,
  Settings
} from 'lucide-react';
import Image from 'next/image';
import { useUser } from '../context/UserContext';
import { useLoading } from '../context/LoadingContext';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const { user, refreshUser, setUser } = useUser();
  const { setIsLoading } = useLoading();
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Account Holder";
  const avatarUrl = user?.user_metadata?.avatar_url || "/nft-one.png";
  const email = user?.email || "No email linked";

  const handleCopyId = () => {
    navigator.clipboard.writeText(user?.id || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUploadClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
        setIsLoading(true, "Uploading profile image...");
        
        const fileName = "avatar"; // Fixed name to prevent accumulation
        const filePath = `avatars/${user.id}/${fileName}`;

        // 1. Upload to Supabase Storage with upsert: true and no-cache
        const { error: uploadError } = await supabase.storage
            .from('profiles')
            .upload(filePath, file, { 
                upsert: true,
                cacheControl: '0' 
            });

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('profiles')
            .getPublicUrl(filePath);

        // 3. Update User Metadata with cache-buster
        // Use ? or & depending on if publicUrl already has params
        const timestamp = new Date().getTime();
        const finalUrl = publicUrl.includes('?') 
            ? `${publicUrl}&t=${timestamp}` 
            : `${publicUrl}?t=${timestamp}`;

        const { data: { user: updatedUser }, error: updateError } = await supabase.auth.updateUser({
            data: { avatar_url: finalUrl }
        });

        if (updateError) throw updateError;

        // 4. Update local context state immediately for instant feedback
        if (updatedUser) {
            setUser(updatedUser);
        }
    } catch (error: any) {
        console.error("Upload failed", error);
        alert(error.message || "Failed to upload image");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 font-outfit px-2 sm:px-4">
      {/* 1. Cover & Profile Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group mb-24"
      >
        {/* Cover Image Container */}
        <div className="h-48 sm:h-72 w-full rounded-[32px] overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10" />
          <Image 
            src={avatarUrl} 
            alt="Cover" 
            fill 
            className="object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          {/* Decorative radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-dash-accent/5 blur-[120px] rounded-full pointer-events-none" />
        </div>

        {/* Profile Avatar Overlap */}
        <div className="absolute -bottom-16 left-8 sm:left-12 flex items-end gap-6 z-20">
          <div className="relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 bg-dash-bg border-4 border-dash-bg shadow-2xl overflow-hidden relative">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-[#0C101A]">
                <Image 
                  src={avatarUrl} 
                  alt="Avatar" 
                  fill 
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 128px, 160px"
                />
              </div>
            </div>
            {/* Upload Trigger Button */}
            <button 
                onClick={handleUploadClick}
                className="absolute bottom-1 right-1 p-2.5 bg-dash-accent text-bg-primary rounded-full hover:bg-white transition-all shadow-xl active:scale-90 border-2 border-dash-bg"
            >
              <Camera size={18} />
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" 
            />
          </div>

          <div className="hidden sm:block pb-4">
            <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">{fullName}</h1>
            <p className="text-text-muted font-medium flex items-center gap-2">
              <Shield size={14} className="text-dash-accent" />
              Institutional Account
            </p>
          </div>
        </div>
      </motion.div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Account Details */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0C101A] border border-white/5 rounded-[32px] p-8 shadow-xl"
          >
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <UserIcon className="text-dash-accent" size={20} />
                Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest pl-1">Full Name</label>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white font-medium flex items-center gap-3">
                   <UserIcon size={18} className="text-white/20" />
                   {fullName}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest pl-1">Email Address</label>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white font-medium flex items-center gap-3">
                   <Mail size={18} className="text-white/20" />
                   {email}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest pl-1">Country</label>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white font-medium flex items-center gap-3">
                   <Globe size={18} className="text-white/20" />
                   {user?.user_metadata?.country || "United Kingdom"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest pl-1">User ID</label>
                <div 
                    onClick={handleCopyId}
                    className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white font-mono text-sm flex items-center justify-between group cursor-pointer hover:border-dash-accent/40 transition-colors"
                >
                   <span className="truncate opacity-60 group-hover:opacity-100">{user?.id || "N/A"}</span>
                   {copied ? <Check size={16} className="text-dash-accent" /> : <Copy size={16} className="text-white/20 group-hover:text-dash-accent" />}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Status */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0C101A] border border-white/5 rounded-[32px] p-8 shadow-xl"
          >
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <Shield className="text-dash-accent" size={20} />
                Security & Verification
            </h2>
            
            <div className="space-y-4">
              {[
                { 
                  label: 'KYC Status', 
                  status: user?.user_metadata?.kyc_status || 'Unverified', 
                  color: user?.user_metadata?.kyc_status === 'Verified' ? 'text-dash-accent' : 'text-amber-500' 
                },
                { 
                  label: 'Two-Factor Auth', 
                  status: (user?.factors && user.factors.length > 0) ? 'Enabled' : 'Not Enabled', 
                  color: (user?.factors && user.factors.length > 0) ? 'text-dash-accent' : 'text-amber-500' 
                },
                { 
                  label: 'Account Level', 
                  status: user?.user_metadata?.account_level || 'Tier 3 (Institutional)', 
                  color: 'text-white' 
                }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                  <span className="text-text-muted font-medium">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Quick Links & Actions */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-dash-accent to-emerald-600 rounded-[32px] p-8 shadow-2xl shadow-dash-accent/10"
          >
            <h3 className="text-bg-primary font-bold text-xl mb-2">Need Help?</h3>
            <p className="text-bg-primary/70 text-sm font-medium mb-6 leading-relaxed">Our dedicated account managers are available 24/7 for our institutional clients.</p>
            <button className="w-full py-4 bg-bg-primary text-white rounded-2xl font-bold text-sm hover:shadow-lg active:scale-95 transition-all">
                Contact Support
            </button>
          </motion.div>

          <motion.nav 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0C101A] border border-white/5 rounded-[32px] p-3 shadow-xl"
          >
            {[
              { icon: Settings, label: 'Account Settings', href: '#' },
              { icon: LogOut, label: 'Sign Out', href: '/auth/signout', color: 'text-red-500' }
            ].map((link) => (
              <button 
                key={link.label}
                className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl bg-white/5 ${link.color || 'text-white/60'} group-hover:text-dash-accent transition-colors`}>
                    <link.icon size={20} />
                  </div>
                  <span className={`font-bold text-sm ${link.color || 'text-white/80'}`}>{link.label}</span>
                </div>
                <ChevronRight size={18} className="text-white/10 group-hover:text-dash-accent transition-all group-hover:translate-x-1" />
              </button>
            ))}
          </motion.nav>
        </div>
      </div>
    </div>
  );
}
