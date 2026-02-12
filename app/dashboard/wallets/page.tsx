"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  ArrowRight, 
  Search, 
  SlidersHorizontal,
  Wallet,
  Send,
  Download,
  History as HistoryIcon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getMarkets, CoinMarketData } from '@/lib/crypto';
import Sparkline from '../components/Sparkline';
import { motion } from 'motion/react';

export default function WalletPage() {
  const [coins, setCoins] = useState<CoinMarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        // Fetch top coins to populate the "wallet" list with real market data
        const data = await getMarkets(1, 15);
        setCoins(data);
      } catch (error) {
        console.error("Failed to load wallet assets", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8 max-w-[1600px] mx-auto pb-12 font-outfit px-3 sm:px-4 lg:px-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Wallet</h1>
        <div className="flex gap-3">
             <button className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5">
                <Search size={20} />
             </button>
             <button className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5">
                <HistoryIcon size={20} className="lucide-history" />
             </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#00C896] to-[#009E74] p-6 sm:p-8 shadow-2xl shadow-[#00C896]/10">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative z-10 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-white/80 mb-2">
                  <span className="text-sm font-bold tracking-wide">Estimated Balance</span>
                  <div className="bg-white/20 rounded-full p-0.5 cursor-help">
                      <div className="w-3 h-3 text-[10px] flex items-center justify-center font-serif italic font-bold">i</div>
                  </div>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-8 drop-shadow-sm font-mono">$0.00</h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl">
                  {[
                      { label: 'Deposit', icon: ArrowDownLeft, href: '/dashboard/deposit' },
                      { label: 'Transfer', icon: Send, href: '#' },
                      { label: 'Exchange', icon: RefreshCw, href: '/dashboard/trade' },
                      { label: 'Withdraw', icon: Download, href: '/dashboard/withdraw' }
                  ].map((action) => (
                      action.href !== '#' ? (
                        <Link 
                            key={action.label}
                            href={action.href}
                            className="flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-white text-[#009E74] rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:shadow-lg active:scale-95 transition-all shadow-sm"
                        >
                            <action.icon size={16} strokeWidth={2.5} />
                            {action.label}
                        </Link>
                      ) : (
                        <button 
                            key={action.label}
                            className="flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-white text-[#009E74] rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:shadow-lg active:scale-95 transition-all shadow-sm"
                        >
                            <action.icon size={16} strokeWidth={2.5} />
                            {action.label}
                        </button>
                      )
                  ))}
              </div>
          </div>
      </div>

      {/* Asset List Section */}
      <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center gap-3">
               <div className="relative flex-1 bg-[#141822] rounded-2xl group border border-white/5 transition-colors focus-within:border-dash-accent/30">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-white transition-colors" size={18} />
                  <input 
                      type="text" 
                      placeholder="Search Cryptocurrency"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent py-4 pl-12 pr-12 text-sm text-white placeholder:text-text-muted/60 outline-none font-medium"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-dash-accent hover:text-white transition-colors">
                      <SlidersHorizontal size={18} />
                  </button>
               </div>
          </div>

          {/* Table Headers (Desktop) */}
          <div className="hidden md:grid grid-cols-12 px-6 py-2 text-[11px] font-bold text-text-muted uppercase tracking-widest">
              <div className="col-span-4 flex items-center gap-1">Name <ArrowUpRight size={10} /></div>
              <div className="col-span-4 text-center">Trend (7d)</div>
              <div className="col-span-4 text-right">Balance</div>
          </div>

          {/* List Content */}
          <div className="space-y-3">
              {loading ? (
                  [...Array(5)].map((_, i) => (
                      <div key={i} className="h-20 bg-[#141822] rounded-3xl animate-pulse border border-white/5" />
                  ))
              ) : (
                  filteredCoins.map((coin) => {
                      const isPositive = (coin.price_change_percentage_24h || 0) >= 0;
                      // Generate a realistic looking 'balance' based on coin rank just for demo visualization since no dummy content allowed usually implies 'lorem ipsum', but visual placeholders for UI dev are needed.
                      // Ideally this would be 0 if strictly no dummy data, but design showed balances.
                      // I will use 0 for "Real" feel if user has no data, or small random amounts if demonstrating UI. 
                      // User said "no dummy contents". So 0.00 is safest/most professional for a new account.
                      const balance = 0.00;
                      const balanceUsd = 0.00;

                      return (
                          <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              key={coin.id}
                              className="group bg-[#0C101A] hover:bg-[#141822] border border-white/5 rounded-3xl p-4 sm:p-5 flex flex-col md:grid md:grid-cols-12 items-center gap-4 transition-all hover:border-white/10 hover:shadow-xl hover:shadow-black/20"
                          >
                              {/* Coin Info */}
                              <div className="w-full md:col-span-4 flex items-center justify-between md:justify-start gap-4">
                                  <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-full bg-white/5 p-2 relative overflow-hidden shadow-inner border border-white/10 group-hover:border-dash-accent/30 transition-colors">
                                          <Image src={coin.image} alt={coin.name} fill className="object-contain p-2" />
                                      </div>
                                      <div>
                                          <h3 className="text-white font-bold text-base leading-none">{coin.symbol.toUpperCase()}</h3>
                                          <p className="text-text-muted text-xs font-medium mt-1">{coin.name}</p>
                                      </div>
                                  </div>
                                  {/* Mobile Balance (Right aligned on mobile row) */}
                                  <div className="text-right md:hidden">
                                      <p className="text-white font-bold text-base font-mono">{balance.toFixed(4)}</p>
                                      <p className="text-text-muted text-xs font-medium">${balanceUsd.toFixed(2)}</p>
                                  </div>
                              </div>

                              {/* Sparkline (Centered on Desktop, hidden or smaller on mobile?) -> Let's show on Desktop only for sleekness or adaptable */}
                              <div className="w-full md:col-span-4 flex items-center justify-center py-2 md:py-0 h-12 md:h-auto">
                                   <Sparkline 
                                      isPositive={isPositive} 
                                      width={120} 
                                      height={40} 
                                   />
                              </div>

                              {/* Desktop Balance */}
                              <div className="hidden md:block col-span-4 text-right">
                                  <p className="text-white font-bold text-lg font-mono tracking-tight">{balance.toFixed(6)}</p>
                                  <p className="text-text-muted text-sm font-medium font-mono opacity-60">${balanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                              </div>
                          </motion.div>
                      );
                  })
              )}
          </div>
      </div>
    </div>
  );
}

