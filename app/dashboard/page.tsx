"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, TrendingUp, Users } from 'lucide-react';
import BalanceChart from './components/BalanceChart';
import MarketsOverview from './components/MarketsOverview';
import QuickTrade from './components/QuickTrade';
import PaymentHistory from './components/PaymentHistory';

export default function DashboardPage() {
  const [selectedCoin, setSelectedCoin] = useState({ id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' });
  const [timeRange, setTimeRange] = useState('7'); // days

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Analytics Section (Main Balance) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-[#0C101A] rounded-[32px] p-8 relative overflow-hidden h-full flex flex-col shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:items-center relative z-10">
            <div>
              <p className="text-text-muted text-[11px] font-space uppercase tracking-widest mb-2 flex items-center gap-2">
                {selectedCoin.name} Analysis <ArrowUpRight size={14} className="text-dash-accent" />
              </p>
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl sm:text-4xl font-bold text-white font-outfit tracking-tight">
                    {selectedCoin.symbol.toUpperCase()} / USD
                </h2>
                <span className="text-dash-accent text-sm font-bold bg-dash-accent/10 px-2 py-1 rounded-lg flex items-center gap-1">
                  <TrendingUp size={12} /> Live
                </span>
              </div>
            </div>

            <div className="flex bg-[#141822]/80 backdrop-blur-md rounded-xl p-1 shadow-inner">
              {[
                { label: 'D', value: '1' },
                { label: 'W', value: '7' },
                { label: 'M', value: '30' },
                { label: 'Y', value: '365' }
              ].map((item) => (
                <button 
                    key={item.label}
                    onClick={() => setTimeRange(item.value)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        timeRange === item.value ? 'bg-dash-accent text-bg-primary' : 'text-text-muted hover:text-white'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <BalanceChart coinId={selectedCoin.id} days={timeRange} />
          
          <div className="mt-auto flex items-center gap-2 text-white/20 text-[10px] font-space uppercase tracking-widest pt-4">
            <div className="w-2 h-2 rounded-full bg-dash-accent" />
            Live Market Trends for {selectedCoin.name}
          </div>
        </motion.div>

        {/* Markets Overview (Moved to Top Right) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
        >
            <MarketsOverview 
                onCoinSelect={(id, symbol, name) => setSelectedCoin({ id, symbol, name })}
                selectedCoinId={selectedCoin.id}
            />
        </motion.div>
      </div>

      {/* Grid for Widgets (Bottom Row) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <QuickTrade />
        </motion.div>
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
        >
            <PaymentHistory />
        </motion.div>
      </div>
    </div>
  );
}
