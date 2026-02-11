"use client";

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, TrendingUp, Users } from 'lucide-react';
import BalanceChart from './components/BalanceChart';
import MarketsOverview from './components/MarketsOverview';
import QuickTrade from './components/QuickTrade';
import PaymentHistory from './components/PaymentHistory';

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Analytics Section (Main Balance) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-dash-surface/50 border border-dash-border rounded-[32px] p-8 relative overflow-hidden h-full flex flex-col"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:items-center relative z-10">
            <div>
              <p className="text-text-muted text-[11px] font-space uppercase tracking-widest mb-2 flex items-center gap-2">
                Total Balance <ArrowUpRight size={14} className="text-dash-accent" />
              </p>
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl sm:text-4xl font-bold text-white font-outfit tracking-tight">$7,500.00</h2>
                <span className="text-dash-accent text-sm font-bold bg-dash-accent/10 px-2 py-1 rounded-lg flex items-center gap-1">
                  <TrendingUp size={12} /> +2.6%
                </span>
              </div>
            </div>

            <div className="flex bg-white/[0.03] border border-dash-border rounded-xl p-1">
              {['D', 'W', 'M', 'Y'].map((item) => (
                <button 
                    key={item}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        item === 'D' ? 'bg-dash-accent text-bg-primary' : 'text-text-muted hover:text-white'
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <BalanceChart />
          
          <div className="mt-auto flex items-center gap-2 text-white/20 text-[10px] font-space uppercase tracking-widest pt-4">
            <div className="w-2 h-2 rounded-full bg-dash-accent" />
            Live Market Trends
          </div>
        </motion.div>

        {/* Upgrade Card / Premium Plan */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dash-surface/50 border border-dash-border rounded-[32px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[400px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-dash-accent/5 blur-[60px] rounded-full group-hover:bg-dash-accent/10 transition-all" />
          
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-dash-accent/10 rounded-full flex items-center justify-center border border-dash-accent/20">
                <Users size={40} className="text-dash-accent" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-3">Upgrade to Premium</h3>
          <p className="text-text-muted text-sm mb-8 leading-relaxed max-w-[220px]">
             Get unlimited access to advanced trading tools and institutional analytics.
          </p>

          <button className="w-full py-4 bg-dash-accent text-bg-primary font-bold rounded-2xl hover:bg-white transition-all shadow-lg active:scale-95 group-hover:shadow-dash-accent/10">
            Let's Go
          </button>
          
          <p className="mt-4 text-[10px] text-text-muted/50 uppercase tracking-tighter">
            Cancel or upgrade anytime
          </p>
        </motion.div>
      </div>

      {/* Grid for Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <MarketsOverview />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <QuickTrade />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <PaymentHistory />
        </motion.div>
      </div>
    </div>
  );
}
