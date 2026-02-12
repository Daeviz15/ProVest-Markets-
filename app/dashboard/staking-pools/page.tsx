"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Timer, TrendingUp, CheckCircle2, Search, Filter, AlertCircle, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const POOLS = [
  { 
    id: 'eth-2', 
    asset: 'Ethereum', 
    symbol: 'ETH', 
    apy: 4.5, 
    duration: 'Flexible', 
    min: '0.1 ETH',
    tvl: '$12.4M',
    icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
  },
  { 
    id: 'sol-staking', 
    asset: 'Solana', 
    symbol: 'SOL', 
    apy: 7.8, 
    duration: '30 Days', 
    min: '1 SOL',
    tvl: '$45.2M',
    icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
  },
  { 
    id: 'usdt-saver', 
    asset: 'Tether', 
    symbol: 'USDT', 
    apy: 12.5, 
    duration: '90 Days', 
    min: '100 USDT',
    tvl: '$180.5M',
    popular: true,
    icon: 'https://assets.coingecko.com/coins/images/325/large/tether.png'
  },
  { 
    id: 'dot-staking', 
    asset: 'Polkadot', 
    symbol: 'DOT', 
    apy: 14.2, 
    duration: '60 Days', 
    min: '5 DOT',
    tvl: '$8.9M',
    icon: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png'
  },
  { 
    id: 'avax-validator', 
    asset: 'Avalanche', 
    symbol: 'AVAX', 
    apy: 9.1, 
    duration: '30 Days', 
    min: '1 AVAX',
    tvl: '$15.6M',
    icon: '/avax.png'
  },
  { 
    id: 'ada-pool', 
    asset: 'Cardano', 
    symbol: 'ADA', 
    apy: 3.2, 
    duration: 'Flexible', 
    min: '10 ADA',
    tvl: '$22.1M',
    icon: 'https://assets.coingecko.com/coins/images/975/large/cardano.png'
  },
];

const FILTERS = ['All Pools', 'Flexible', 'Locked', 'High Yield'];

export default function StakingPoolsPage() {
  const [activeFilter, setActiveFilter] = useState('All Pools');
  const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success', showDepositLink?: boolean } | null>(null);

  // Mock User Balance
  const userBalance = 0; 

  const handleStake = (pool: typeof POOLS[0]) => {
      if (userBalance <= 0) {
          setNotification({
              message: `Insufficient ${pool.symbol} balance. Please deposit funds to stake.`,
              type: 'error',
              showDepositLink: true
          });
          
          // Auto-hide after 5 seconds
          setTimeout(() => setNotification(null), 5000);
          return;
      }
      // Implement staking logic here
  };

  const filteredPools = POOLS.filter(pool => {
    if (activeFilter === 'All Pools') return true;
    if (activeFilter === 'Flexible') return pool.duration === 'Flexible';
    if (activeFilter === 'Locked') return pool.duration !== 'Flexible';
    if (activeFilter === 'High Yield') return pool.apy >= 10;
    return true;
  });

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
            <motion.div
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -20, x: '-50%' }}
                className="fixed top-24 left-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-[#141822] border border-dash-error/30 rounded-xl shadow-2xl backdrop-blur-xl min-w-[320px]"
            >
                <div className={`p-2 rounded-full ${notification.type === 'error' ? 'bg-dash-error/10 text-dash-error' : 'bg-dash-accent/10 text-dash-accent'}`}>
                    <AlertCircle size={18} />
                </div>
                <div className="flex-1">
                    <p className="text-white text-sm font-bold">{notification.type === 'error' ? 'Staking Failed' : 'Success'}</p>
                    <p className="text-text-muted text-xs">{notification.message}</p>
                </div>
                {notification.showDepositLink && (
                    <Link href="/dashboard/deposit" className="text-xs font-bold text-dash-accent hover:underline">
                        Deposit
                    </Link>
                )}
                <button onClick={() => setNotification(null)} className="text-text-muted hover:text-white transition-colors">
                    <X size={14} />
                </button>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-2xl font-bold text-white font-outfit mb-2">Staking Pools</h1>
           <p className="text-text-muted text-sm">Earn passive rewards by staking your assets in secured pools.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-[#0C101A] p-1 rounded-xl border border-white/5 shadow-sm">
            {FILTERS.map((filter) => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeFilter === filter 
                            ? 'bg-dash-accent text-bg-primary shadow-lg shadow-dash-accent/10' 
                            : 'text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                >
                    {filter}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode='popLayout'>
        {filteredPools.map((pool, index) => (
            <motion.div
                layout
                key={pool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#0C101A] rounded-3xl p-6 border border-white/5 hover:border-dash-accent/30 transition-all shadow-xl group relative overflow-hidden"
            >
                {/* Popular Badge */}
                {pool.popular && (
                    <div className="absolute top-0 right-0 bg-dash-accent text-bg-primary text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest z-10">
                        Popular
                    </div>
                )}

                {/* Background Glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-dash-accent/5 blur-[60px] rounded-full group-hover:bg-dash-accent/10 transition-all" />

                <div className="relative z-10">
                    {/* Header: Asset */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative overflow-hidden">
                            <Image src={pool.icon} alt={pool.asset} fill className="object-contain p-2" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg font-outfit">{pool.asset}</h3>
                            <span className="text-xs text-text-muted font-bold tracking-wider">{pool.symbol}</span>
                        </div>
                    </div>

                    {/* APY Highlight */}
                    <div className="bg-white/[0.03] rounded-2xl p-4 mb-6 flex justify-between items-center">
                        <div>
                            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1">Estimated APY</p>
                            <p className="text-3xl font-bold text-dash-accent font-outfit tracking-tight">{pool.apy}%</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-dash-accent/10 flex items-center justify-center text-dash-accent">
                            <TrendingUp size={20} />
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-8">
                         <div>
                            <p className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1">Duration</p>
                            <p className="text-white font-bold flex items-center gap-2">
                                <Timer size={14} className="text-dash-accent" /> {pool.duration}
                            </p>
                         </div>
                         <div>
                            <p className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1">Min Stake</p>
                            <p className="text-white font-bold">{pool.min}</p>
                         </div>
                         <div className="col-span-2 pt-2 border-t border-white/5 mt-2">
                             <div className="flex justify-between items-center">
                                <p className="text-text-muted text-[10px] uppercase font-bold tracking-wider">Total Staked</p>
                                <p className="text-white font-mono text-xs opacity-70">{pool.tvl}</p>
                             </div>
                         </div>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={() => handleStake(pool)}
                        className="w-full py-4 bg-white text-bg-primary font-bold rounded-2xl hover:bg-dash-accent hover:text-bg-primary transition-all shadow-lg active:scale-[0.98] group-hover:shadow-dash-accent/20"
                    >
                        Stake Now
                    </button>
                    
                </div>
            </motion.div>
        ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
