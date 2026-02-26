"use client";

import { Search, Bell, Menu } from 'lucide-react';
import { useAdminSidebar } from '../context/AdminSidebarContext';

interface AdminTopbarProps {
  title?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
}

export default function AdminTopbar({ 
  title,
  searchQuery, 
  onSearchChange, 
  searchPlaceholder = "Search users..." 
}: AdminTopbarProps) {
  const { toggleMobile } = useAdminSidebar();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="h-[70px] flex items-center justify-between px-4 lg:px-8 bg-[#0C101A]/60 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Toggle */}
        <button 
          onClick={toggleMobile}
          className="lg:hidden p-2 text-text-muted hover:text-white bg-white/[0.03] border border-white/[0.06] rounded-xl transition-all"
        >
          <Menu size={20} />
        </button>

        {/* Search or Title */}
        <div className="flex-1 max-w-md">
        {title ? (
          <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        ) : (
          <div className="relative group">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-dash-accent transition-colors"
            />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-white/[0.03] rounded-xl py-2.5 pl-11 pr-4 text-white text-sm placeholder:text-text-muted outline-none border border-white/[0.06] focus:border-dash-accent/30 transition-all font-outfit"
            />
          </div>
        )}
      </div>

      </div>
    
      {/* Right side */}
      <div className="flex items-center gap-5 ml-6">
        <div className="px-4 py-1.5 bg-white/[0.03] rounded-lg border border-white/[0.06]">
          <span className="text-xs font-semibold text-text-muted">{today}</span>
        </div>
        <button className="relative p-2 text-text-muted hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-dash-accent rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-dash-accent/30 to-dash-accent/10 border border-dash-accent/20 flex items-center justify-center">
          <span className="text-xs font-bold text-dash-accent">A</span>
        </div>
      </div>
    </header>
  );
}
