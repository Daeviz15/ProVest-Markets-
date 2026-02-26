"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminSidebarContextType {
  isOpen: boolean;      // Mobile drawer state
  isCollapsed: boolean; // Desktop collapsed state
  toggleMobile: () => void;
  toggleDesktop: () => void;
  closeMobile: () => void;
  openMobile: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined);

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobile = () => setIsOpen(!isOpen);
  const toggleDesktop = () => setIsCollapsed(!isCollapsed);
  const closeMobile = () => setIsOpen(false);
  const openMobile = () => setIsOpen(true);

  return (
    <AdminSidebarContext.Provider value={{ 
      isOpen, 
      isCollapsed, 
      toggleMobile, 
      toggleDesktop, 
      closeMobile, 
      openMobile 
    }}>
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (context === undefined) {
    throw new Error('useAdminSidebar must be used within an AdminSidebarProvider');
  }
  return context;
}
