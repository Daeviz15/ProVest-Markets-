"use client";

import { Search, Plus, ChevronDown, Bell, Menu, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useSidebar } from '../context/SidebarContext';

export default function Topbar() {
  const { toggle } = useSidebar();

  return (
    <header className="h-[80px] sm:h-[90px] w-full flex items-center justify-between px-4 sm:px-8 bg-dash-bg/40 backdrop-blur-2xl sticky top-0 z-40 transition-all border-b border-dash-border/30">
      {/* Left Section: Mobile Toggle & Logo */}
      <div className="flex items-center gap-4">
        <button 
            onClick={toggle}
            className="p-2 text-text-muted hover:text-white bg-white/5 rounded-xl border border-white/5 transition-all active:scale-95 shadow-sm"
        >
            <Menu size={20} />
        </button>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2">
            <ShieldCheck className="text-dash-accent" size={24} />
            <div className="flex items-center">
                <span className="font-pacifico text-[18px] text-dash-accent">Aura</span>
                <span className="font-outfit text-[18px] font-bold text-white -ml-0.5">Trade</span>
            </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center w-[400px] relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-dash-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search coins, news etc"
            className="w-full bg-white/[0.02] rounded-xl py-2.5 pl-12 pr-4 text-white placeholder:text-text-muted outline-none border border-white/5 focus:border-dash-accent/30 transition-all font-outfit text-sm shadow-inner"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-dash-accent text-bg-primary rounded-full font-bold text-sm hover:bg-white transition-all shadow-lg active:scale-95">
          <Plus size={18} />
          <span className="hidden sm:inline">Fund Wallet</span>
        </button>

        <div className="h-10 w-px bg-dash-border" />

        <button className="relative p-2 text-text-secondary hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-dash-accent rounded-full border-2 border-dash-bg" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="w-10 h-10 rounded-full border-2 border-dash-accent/20 overflow-hidden group-hover:border-dash-accent transition-colors bg-dash-surface flex items-center justify-center">
             <span className="text-xs font-bold text-dash-accent uppercase">DU</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-bold text-white font-outfit leading-none">David Ukata</p>
            <p className="text-[11px] text-text-muted mt-1 uppercase tracking-wider font-space">Institutional Trader</p>
          </div>
          <ChevronDown size={14} className="text-text-muted group-hover:text-white transition-colors" />
        </div>
      </div>
    </header>
  );
}
