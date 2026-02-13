"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Bell, 
  Monitor, 
  Shield, 
  Globe, 
  User, 
  CreditCard, 
  MessageSquare,
  ChevronRight,
  Check,
  Moon,
  Sun,
  Layout,
  Volume2,
  Lock,
  Eye,
  Smartphone,
  Info,
  X
} from 'lucide-react';
import Link from 'next/link';

// Custom Bespoke Components for a "Hand-crafted" feel
const BespokeToggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button 
        onClick={onChange}
        className={`relative w-14 h-8 rounded-full transition-all duration-500 overflow-hidden border ${
            enabled ? 'bg-dash-accent/20 border-dash-accent/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10'
        }`}
    >
        <motion.div 
            animate={{ x: enabled ? 26 : 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                enabled ? 'bg-dash-accent shadow-lg shadow-dash-accent/40' : 'bg-white/20'
            }`}
        >
            {enabled ? <Check size={12} className="text-bg-primary font-bold" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/40" />}
        </motion.div>
    </button>
);

const BespokeCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-[#0C101A]/60 border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl group hover:border-white/10 transition-all duration-500 ${className}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-dash-accent/5 blur-[60px] -mr-16 -mt-16 rounded-full group-hover:bg-dash-accent/10 transition-colors pointer-events-none" />
        <div className="relative z-10">{children}</div>
    </div>
);

type CategoryId = 'general' | 'notifications' | 'display' | 'preferences';

export default function SettingsPage() {
    const [activeCategory, setActiveCategory] = useState<CategoryId>('general');
    
    // UI State for demonstration / Mocking future persistence
    const [settings, setSettings] = useState({
        marketingEmails: true,
        tradingAlerts: true,
        compactMode: false,
        highContrast: false,
        soundEffects: true,
        baseCurrency: 'USD ($)',
        timezone: 'UTC +00:00 (London)',
        language: 'English (UK)',
        autoLock: '15 Minutes'
    });

    // Selection Overlay State
    const [selectionTarget, setSelectionTarget] = useState<{
        field: keyof typeof settings;
        label: string;
        options: string[];
    } | null>(null);

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSelect = (value: string) => {
        if (selectionTarget) {
            setSettings(prev => ({ ...prev, [selectionTarget.field]: value }));
            setSelectionTarget(null);
        }
    };

    const categories = [
        { id: 'general', icon: Globe, label: 'General', desc: 'Regional & Account' },
        { id: 'notifications', icon: Bell, label: 'Notifications', desc: 'System & Trading' },
        { id: 'display', icon: Monitor, label: 'Display', desc: 'Visual Interface' },
        { id: 'preferences', icon: Layout, label: 'Preferences', desc: 'Advanced Setup' },
    ];

    const selectionOptions = {
        baseCurrency: ['USD ($)', 'EUR (€)', 'BTC (₿)', 'GBP (£)', 'ETH (Ξ)'],
        timezone: ['UTC +00:00 (London)', 'UTC -05:00 (New York)', 'UTC +08:00 (Singapore)', 'UTC +09:00 (Tokyo)', 'UTC +01:00 (Dubai)'],
        autoLock: ['5 Minutes', '15 Minutes', '30 Minutes', '1 Hour', 'Never']
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 font-outfit px-2 sm:px-6 relative">
            {/* Selection Overlay */}
            <AnimatePresence>
                {selectionTarget && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectionTarget(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[120]"
                        >
                            <BespokeCard className="!p-0 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-white font-bold tracking-tight">Select {selectionTarget.label}</h3>
                                    <button onClick={() => setSelectionTarget(null)} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                    {selectionTarget.options.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleSelect(opt)}
                                            className={`w-full text-left p-4 rounded-2xl mb-2 flex items-center justify-between transition-all group ${
                                                settings[selectionTarget.field] === opt 
                                                ? 'bg-dash-accent text-bg-primary' 
                                                : 'hover:bg-white/5 text-white/60 hover:text-white'
                                            }`}
                                        >
                                            <span className="font-bold text-sm tracking-tight">{opt}</span>
                                            {settings[selectionTarget.field] === opt && <Check size={18} />}
                                        </button>
                                    ))}
                                </div>
                            </BespokeCard>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <header className="mb-12">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-dash-accent/10 rounded-2xl">
                        <Settings className="text-dash-accent" size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">System Configuration</h1>
                </div>
                <p className="text-text-muted font-medium ml-1">Personalize your institutional trading environment</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Custom Category Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id as CategoryId)}
                            className={`w-full text-left p-5 rounded-[24px] transition-all duration-500 group relative flex items-start gap-4 ${
                                activeCategory === cat.id 
                                ? 'bg-dash-accent text-bg-primary shadow-xl shadow-dash-accent/20' 
                                : 'bg-white/[0.02] border border-white/5 text-white/40 hover:bg-white/[0.05] hover:text-white'
                            }`}
                        >
                            <div className={`p-2.5 rounded-xl ${
                                activeCategory === cat.id ? 'bg-white/20' : 'bg-white/5 group-hover:bg-dash-accent/10 transition-colors'
                            }`}>
                                <cat.icon size={20} className={activeCategory === cat.id ? 'text-bg-primary' : 'group-hover:text-dash-accent'} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm leading-tight">{cat.label}</h3>
                                <p className={`text-[10px] uppercase font-black tracking-widest mt-1 opacity-60`}>{cat.desc}</p>
                            </div>
                            {activeCategory === cat.id && (
                                <motion.div 
                                    layoutId="active-indicator"
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    <ChevronRight size={16} />
                                </motion.div>
                            )}
                        </button>
                    ))}

                    <div className="mt-8 p-6 bg-gradient-to-b from-[#0C101A] to-dash-accent/5 rounded-[28px] border border-white/5">
                        <div className="flex items-center gap-3 text-dash-accent mb-3">
                            <Shield size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Gear</span>
                        </div>
                        <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                            Your settings are synced across our global node network for ultra-low latency accessibility.
                        </p>
                    </div>
                </div>

                {/* Main Settings Panel */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            {activeCategory === 'general' && (
                                <div className="space-y-6">
                                    <BespokeCard>
                                        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                            <Globe className="text-dash-accent" size={20} />
                                            Regional Hub
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {[
                                                { label: 'Base Currency', value: settings.baseCurrency, icon: CreditCard, field: 'baseCurrency' as const, options: selectionOptions.baseCurrency },
                                                { label: 'Display Language', value: settings.language, icon: MessageSquare, field: 'language' as const, isLocked: true },
                                                { label: 'System Timezone', value: settings.timezone, icon: Globe, field: 'timezone' as const, options: selectionOptions.timezone },
                                                { label: 'Idle Auto-Lock', value: settings.autoLock, icon: Lock, field: 'autoLock' as const, options: selectionOptions.autoLock },
                                            ].map((item, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className={`space-y-3 group ${item.isLocked ? 'cursor-default' : 'cursor-pointer'}`}
                                                    onClick={() => {
                                                        if (!item.isLocked && item.options) {
                                                            setSelectionTarget({
                                                                field: item.field,
                                                                label: item.label,
                                                                options: item.options
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">{item.label}</label>
                                                    <div className={`bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white font-bold flex items-center justify-between transition-all ${
                                                        !item.isLocked ? 'group-hover:border-dash-accent/40 group-hover:bg-white/[0.05]' : 'opacity-60'
                                                    }`}>
                                                        <div className="flex items-center gap-4">
                                                            <item.icon size={18} className={`text-white/20 transition-colors ${!item.isLocked ? 'group-hover:text-dash-accent' : ''}`} />
                                                            <span className="text-sm">{item.value}</span>
                                                        </div>
                                                        {!item.isLocked && <ChevronRight size={14} className="text-white/10 group-hover:text-white transition-all" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </BespokeCard>

                                    <BespokeCard className="bg-gradient-to-r from-[#0C101A] to-dash-accent/5">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-dash-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                                                <User className="text-dash-accent" size={28} />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-lg">Identity Link</h3>
                                                <p className="text-text-muted text-sm font-medium leading-relaxed">
                                                    Manage how your profile appears to other institutional partners on the network.
                                                </p>
                                            </div>
                                            <Link href="/dashboard/profile" className="ml-auto">
                                                <button className="px-6 py-3 bg-white/5 text-white rounded-xl font-bold text-xs hover:bg-white/10 transition-all border border-white/5 whitespace-nowrap">
                                                    Open Profile
                                                </button>
                                            </Link>
                                        </div>
                                    </BespokeCard>
                                </div>
                            )}

                            {activeCategory === 'notifications' && (
                                <BespokeCard>
                                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                        <Bell className="text-dash-accent" size={20} />
                                        Intelligence Alerts
                                    </h2>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Trading Signals', desc: 'Real-time alerts for market volatility and price targets', key: 'tradingAlerts' },
                                            { label: 'Account Integrity', desc: 'Security notifications for logins and document status', key: 'marketingEmails' },
                                            { label: 'Atmospheric Sounds', desc: 'Subtle audio cues for interface interactions', key: 'soundEffects' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between py-6 border-b border-white/5 last:border-0 hover:bg-white/[0.01] -mx-4 px-4 rounded-xl transition-all group">
                                                <div className="space-y-1">
                                                    <h4 className="text-white font-bold group-hover:text-dash-accent transition-colors">{item.label}</h4>
                                                    <p className="text-xs text-text-muted font-medium">{item.desc}</p>
                                                </div>
                                                <BespokeToggle 
                                                    enabled={settings[item.key as keyof typeof settings] as boolean} 
                                                    onChange={() => toggleSetting(item.key as keyof typeof settings)} 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-8 p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
                                        <Info size={18} className="text-white/20 shrink-0" />
                                        <p className="text-[11px] text-text-muted/60 font-medium leading-relaxed">
                                            Push notifications are delivered via our priority encrypted channel. Ensure your browser permits system alerts for full functionality.
                                        </p>
                                    </div>
                                </BespokeCard>
                            )}

                            {activeCategory === 'display' && (
                                <div className="space-y-6">
                                    <BespokeCard>
                                        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                            <Monitor className="text-dash-accent" size={20} />
                                            Visual Interface
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button 
                                                className={`p-6 rounded-[28px] border flex flex-col items-center gap-4 transition-all duration-500 scale-100 active:scale-[0.98] ${
                                                    !settings.compactMode ? 'bg-dash-accent/10 border-dash-accent text-white shadow-xl shadow-dash-accent/10' : 'bg-white/[0.02] border-white/5 text-white/40 grayscale hover:grayscale-0'
                                                }`}
                                                onClick={() => setSettings(prev => ({ ...prev, compactMode: false }))}
                                            >
                                                <div className="p-4 bg-white/5 rounded-2xl">
                                                    <Layout size={32} />
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="font-bold">Institutional</h3>
                                                    <p className="text-[10px] uppercase font-black tracking-widest mt-1 opacity-60">Standard View</p>
                                                </div>
                                            </button>
                                            <button 
                                                className={`p-6 rounded-[28px] border flex flex-col items-center gap-4 transition-all duration-500 scale-100 active:scale-[0.98] ${
                                                    settings.compactMode ? 'bg-dash-accent/10 border-dash-accent text-white shadow-xl shadow-dash-accent/10' : 'bg-white/[0.02] border-white/5 text-white/40 grayscale hover:grayscale-0'
                                                }`}
                                                onClick={() => setSettings(prev => ({ ...prev, compactMode: true }))}
                                            >
                                                <div className="p-4 bg-white/5 rounded-2xl">
                                                    <Smartphone size={32} />
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="font-bold">Analytic</h3>
                                                    <p className="text-[10px] uppercase font-black tracking-widest mt-1 opacity-60">Compact Grid</p>
                                                </div>
                                            </button>
                                        </div>
                                    </BespokeCard>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <BespokeCard className="!p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-white/5 rounded-xl">
                                                        <Volume2 size={20} className="text-dash-accent" />
                                                    </div>
                                                    <h4 className="text-white font-bold text-sm">Haptic Feedback</h4>
                                                </div>
                                                <BespokeToggle enabled={settings.highContrast} onChange={() => toggleSetting('highContrast')} />
                                            </div>
                                        </BespokeCard>
                                        <BespokeCard className="!p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-white/5 rounded-xl">
                                                        <Eye size={20} className="text-dash-accent" />
                                                    </div>
                                                    <h4 className="text-white font-bold text-sm">Enhanced Focus</h4>
                                                </div>
                                                <BespokeToggle enabled={settings.compactMode} onChange={() => toggleSetting('compactMode')} />
                                            </div>
                                        </BespokeCard>
                                    </div>
                                </div>
                            )}

                            {activeCategory === 'preferences' && (
                                <BespokeCard>
                                     <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                        <Shield size={20} className="text-dash-accent" />
                                        Operational Preferences
                                    </h2>
                                    <div className="p-10 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                            <Settings size={32} className="text-white/10 animate-[spin_10s_linear_infinite]" />
                                        </div>
                                        <h3 className="text-white font-bold text-lg">Terminal Customization</h3>
                                        <p className="text-text-muted text-sm max-w-sm leading-relaxed">
                                            Advanced operational preferences and custom terminal modules will be available in the next system update.
                                        </p>
                                        <button className="mt-4 px-8 py-3 bg-dash-accent text-bg-primary rounded-xl font-black text-xs hover:bg-white transition-all">
                                            Check for Updates
                                        </button>
                                    </div>
                                </BespokeCard>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
