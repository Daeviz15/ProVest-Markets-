"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, Sprout, ArrowRight, Layers } from 'lucide-react';
import Link from 'next/link';

export default function MyStakesPage() {
  const stats = [
    { label: 'Total Staked', value: '$0.00', icon: Wallet },
    { label: 'Total Earnings', value: '$0.00', icon: TrendingUp, highlight: true },
    { label: 'Average APY', value: '0.00%', icon: Layers },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-outfit mb-2">My Stakes</h1>
        <p className="text-text-muted text-sm">Manage your active staking positions and earnings.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
            <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0C101A] p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group"
            >
                <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${stat.highlight ? 'text-dash-accent' : 'text-white'}`}>
                    <stat.icon size={80} />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-xl ${stat.highlight ? 'bg-dash-accent/10 text-dash-accent' : 'bg-white/5 text-text-muted'}`}>
                            <stat.icon size={20} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-text-muted">{stat.label}</span>
                    </div>
                    <h2 className={`text-3xl font-bold ${stat.highlight ? 'text-dash-accent' : 'text-white'} font-mono`}>{stat.value}</h2>
                </div>
            </motion.div>
        ))}
      </div>

      {/* Empty State / Active Stakes List */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-[#0C101A] rounded-[32px] border border-white/5 p-12 flex flex-col items-center justify-center text-center min-h-[400px] relative overflow-hidden"
      >
         {/* Background Decoration */}
         <div className="absolute inset-0 bg-dash-accent/5 blur-[100px] rounded-full opacity-20" />

         <div className="relative z-10 max-w-md">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-dash-accent border border-white/10 shadow-2xl">
                <Sprout size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 font-outfit">No Active Stakes Yet</h3>
            <p className="text-text-muted mb-8 leading-relaxed">
                You haven't staked any assets yet. Start staking your crypto to earn passive rewards and grow your portfolio.
            </p>
            <Link 
                href="/dashboard/staking-pools"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-bg-primary font-bold rounded-2xl hover:bg-dash-accent hover:text-bg-primary transition-all shadow-lg active:scale-95 group"
            >
                Explore Pools
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>
      </motion.div>

    </div>
  );
}
