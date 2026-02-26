"use client";

import React from 'react';
import { useAdminSidebar } from '../context/AdminSidebarContext';

export default function AdminMainContent({ children }: { children: React.ReactNode }) {
  const { isOpen, closeMobile, isCollapsed } = useAdminSidebar();

  return (
    <main className={`flex-1 transition-all duration-300 min-h-screen relative
      ${isCollapsed 
        ? 'w-full lg:w-[calc(100%-72px)] lg:ml-[72px]' 
        : 'w-full lg:w-[calc(100%-240px)] lg:ml-[240px]'
      }
    `}>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
          onClick={closeMobile}
        />
      )}
      
      {children}
    </main>
  );
}
