"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Wallet, 
  LayoutDashboard, 
  Bell, 
  MessageSquare, 
  Settings, 
  LogOut,
  ShieldCheck
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Wallet, label: 'Portfolio', href: '/dashboard/portfolio' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Bell, label: 'Alerts', href: '/dashboard/alerts' },
  { icon: MessageSquare, label: 'Support', href: '/dashboard/support' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[var(--sidebar-collapsed)] lg:w-[var(--sidebar-width)] bg-dash-bg border-r border-dash-border flex flex-col items-center lg:items-start py-8 transition-all duration-300 z-50">
      {/* Logo Section */}
      <div className="px-6 mb-12 flex items-center gap-3">
        <div className="relative w-10 h-10 flex items-center justify-center bg-dash-accent/10 rounded-xl border border-dash-accent/20">
          <ShieldCheck className="text-dash-accent" size={24} />
        </div>
        <div className="hidden lg:flex items-center transform translate-y-0.5">
           <span className="font-pacifico text-[20px] text-dash-accent">Aura</span>
           <span className="font-outfit text-[20px] font-bold text-white -ml-1">Trade</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-dash-accent text-bg-primary font-bold' 
                  : 'text-text-secondary hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <item.icon size={22} className={isActive ? 'text-bg-primary' : 'group-hover:text-dash-accent transition-colors'} />
              <span className="hidden lg:block font-outfit text-[15px]">{item.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-dash-accent rounded-r-full hidden lg:block"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="w-full px-4 pt-8 border-t border-dash-border">
        <button 
          className="flex items-center gap-4 px-4 py-3.5 rounded-xl w-full text-dash-error hover:bg-dash-error/5 transition-all group"
          onClick={() => {/* Implement Logout */}}
        >
          <LogOut size={22} />
          <span className="hidden lg:block font-outfit text-[15px] font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}
