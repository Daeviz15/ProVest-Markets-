import React from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dash-bg flex font-outfit">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-[var(--sidebar-width)] ml-[var(--sidebar-collapsed)] transition-all duration-300">
        <Topbar />
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
