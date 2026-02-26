"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Download,
  X
} from 'lucide-react';
import { useAdminSidebar } from '../context/AdminSidebarContext';
import { useState, useEffect } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Download, label: 'Deposits', href: '/admin/deposits' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isOpen, isCollapsed, toggleDesktop, closeMobile } = useAdminSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    // Note: This would typically use an auth signout action
    window.location.href = '/';
  };

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isCollapsed ? 72 : 240,
        x: mounted && typeof window !== 'undefined' && window.innerWidth < 1024 
          ? (isOpen ? 0 : -280) 
          : 0
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed left-0 top-0 bottom-0 flex flex-col bg-[#0C101A] border-r border-white/[0.06] z-50 transition-colors duration-300
        ${isOpen ? 'shadow-2xl shadow-black' : ''}
        lg:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="h-[70px] flex items-center justify-between px-5 border-b border-white/[0.06] overflow-hidden">
        <div className="flex items-center">
            <ShieldCheck className="text-dash-accent shrink-0" size={24} />
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center ml-2"
              >
                <span className="font-pacifico text-[16px] text-dash-accent">Provest</span>
                <span className="font-outfit text-[16px] font-bold text-white -ml-0.5">Admin</span>
              </motion.div>
            )}
        </div>
        
        {/* Mobile Close */}
        <button 
            onClick={closeMobile}
            className="lg:hidden p-2 text-text-muted hover:text-white transition-colors"
        >
            <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => {
                  if (window.innerWidth < 1024) closeMobile();
              }}
            >
              <motion.div
                whileHover={{ x: 2 }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer relative
                  ${isActive
                    ? 'bg-dash-accent/10 text-dash-accent'
                    : 'text-text-muted hover:text-white hover:bg-white/[0.03]'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="admin-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-dash-accent rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={20} className="shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/[0.06] space-y-1">
        <button
          onClick={toggleDesktop}
          className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-white hover:bg-white/[0.03] transition-all"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!isCollapsed && <span className="text-sm font-semibold">Collapse</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-dash-error/70 hover:text-dash-error hover:bg-dash-error/5 transition-all"
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
