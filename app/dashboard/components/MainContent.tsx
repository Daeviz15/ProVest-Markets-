"use client";

import React from 'react';
import { useSidebar } from '../context/SidebarContext';
import Topbar from './Topbar';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useSidebar();

  return (
    <main className={`flex-1 transition-all duration-300 min-h-screen relative
      ${isOpen ? 'w-full lg:w-[calc(100%-var(--sidebar-width))] lg:ml-[var(--sidebar-width)]' : 'w-full ml-0'}
    `}>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
          onClick={close}
        />
      )}
      
      <Topbar />
      <div className="p-4 sm:p-8">
        {children}
      </div>
    </main>
  );
}
