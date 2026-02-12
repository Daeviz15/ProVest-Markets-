"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Clock, 
  History, 
  Search, 
  Filter, 
  Download, 
  Inbox,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

type TabType = 'open' | 'history' | 'trades';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('open');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'open', label: 'Open Orders', icon: FileText },
    { id: 'history', label: 'Order History', icon: Clock },
    { id: 'trades', label: 'Trade History', icon: History },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 font-outfit px-3 sm:px-4 lg:px-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 pt-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Orders</h1>
          <p className="text-text-muted text-sm mt-1">Manage your open positions and view history</p>
        </div>
        <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/5">
                <Download size={16} />
                <span className="hidden sm:inline">Export History</span>
             </button>
        </div>
      </div>

      {/* Controls & Tabs */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between sticky top-[90px] z-30 bg-dash-bg/95 backdrop-blur-xl py-2 -mx-3 px-3 sm:-mx-4 sm:px-4 lg:mx-0 lg:px-0 lg:bg-transparent lg:static">
        
        {/* Tabs */}
        <div className="flex bg-[#0C101A] p-1.5 rounded-xl border border-white/5 overflow-x-auto custom-scrollbar shadow-lg">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all relative ${
                            isActive 
                                ? 'text-white' 
                                : 'text-text-muted hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeOrderTab"
                                className="absolute inset-0 bg-white/10 rounded-lg border border-white/5 shadow-inner"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <Icon size={16} className={isActive ? 'text-dash-accent' : ''} />
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-1 lg:flex-none">
            <div className="relative flex-1 lg:w-[300px] group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-dash-accent transition-colors" size={16} />
                <input 
                    type="text" 
                    placeholder="Search by coin, pair..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0C101A] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-dash-accent/30 focus:bg-[#141822] transition-all outline-none shadow-sm"
                />
            </div>
            <button className="p-2.5 bg-[#0C101A] hover:bg-white/5 text-text-muted hover:text-white rounded-xl border border-white/5 transition-colors">
                <Filter size={18} />
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#0C101A] rounded-[24px] border border-white/5 shadow-xl min-h-[400px] flex flex-col relative overflow-hidden">
        
        {/* Desktop Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 bg-white/[0.01]">
            <div className="col-span-2 text-[11px] font-bold text-text-muted uppercase tracking-widest">Date / Time</div>
            <div className="col-span-2 text-[11px] font-bold text-text-muted uppercase tracking-widest">Pair</div>
            <div className="col-span-1 text-[11px] font-bold text-text-muted uppercase tracking-widest">Type</div>
            <div className="col-span-1 text-[11px] font-bold text-text-muted uppercase tracking-widest">Side</div>
            <div className="col-span-2 text-[11px] font-bold text-text-muted uppercase tracking-widest text-right">Price</div>
            <div className="col-span-2 text-[11px] font-bold text-text-muted uppercase tracking-widest text-right">Amount</div>
            <div className="col-span-1 text-[11px] font-bold text-text-muted uppercase tracking-widest text-right">Status</div>
            <div className="col-span-1 text-[11px] font-bold text-text-muted uppercase tracking-widest text-right">Action</div>
        </div>

        {/* Content Body - Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 text-center">
            
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-md w-full flex flex-col items-center"
                >
                    <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center mb-6 shadow-inner relative overflow-hidden group">
                        <div className="absolute inset-0 bg-dash-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {activeTab === 'open' && <Inbox size={32} className="text-text-muted/50 group-hover:text-dash-accent transition-colors" />}
                        {activeTab === 'history' && <Clock size={32} className="text-text-muted/50 group-hover:text-dash-accent transition-colors" />}
                        {activeTab === 'trades' && <History size={32} className="text-text-muted/50 group-hover:text-dash-accent transition-colors" />}
                    </div>

                    <h3 className="text-xl text-white font-bold mb-2">No {activeTab === 'open' ? 'active orders' : activeTab === 'history' ? 'order history' : 'trade history'}</h3>
                    <p className="text-text-muted text-sm mb-8 leading-relaxed">
                        {activeTab === 'open' 
                            ? "You don't have any open orders at the moment. Active orders will appear here." 
                            : "Your order details and trade history will be displayed here once you start trading."
                        }
                    </p>

                    <Link 
                        href="/dashboard/trade"
                        className="flex items-center gap-2 px-8 py-3 bg-dash-accent text-bg-primary font-bold rounded-xl hover:bg-white transition-all shadow-lg shadow-dash-accent/10 hover:shadow-dash-accent/20 active:scale-95 text-sm uppercase tracking-wider"
                    >
                        Start Trading
                        <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </AnimatePresence>

        </div>
      </div>

    </div>
  );
}
