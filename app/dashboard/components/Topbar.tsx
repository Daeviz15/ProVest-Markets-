"use client";

import React from 'react';
import { Search, Plus, ChevronDown, Bell } from 'lucide-react';
import Image from 'next/image';

export default function Topbar() {
  return (
    <header className="h-[90px] w-full flex items-center justify-between px-8 bg-dash-bg/50 backdrop-blur-xl border-b border-dash-border sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-dash-accent transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search coins, news etc"
          className="w-full bg-white/[0.03] border border-dash-border rounded-xl py-2.5 pl-12 pr-4 text-white placeholder:text-text-muted outline-none focus:border-dash-accent/40 transition-all font-outfit text-sm"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-dash-accent text-bg-primary rounded-full font-bold text-sm hover:bg-white transition-all shadow-lg active:scale-95">
          <Plus size={18} />
          Add new coin
        </button>

        <div className="h-10 w-px bg-dash-border" />

        <button className="relative p-2 text-text-secondary hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-dash-accent rounded-full border-2 border-dash-bg" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="w-10 h-10 rounded-full border-2 border-dash-accent/20 overflow-hidden group-hover:border-dash-accent transition-colors">
            <Image 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="User"
              width={40}
              height={40}
            />
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
