"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle,
  Clock,
  Zap,
  ShieldAlert,
  Wallet
} from 'lucide-react';
import Image from 'next/image';
import { useLoading } from '../context/LoadingContext';
import { getMarkets, getCoinHistory, CoinMarketData } from '@/lib/crypto';
import BalanceChart from '../components/BalanceChart';
import { CoinSkeleton } from '../components/CoinSkeleton';

export default function TradePage() {
  const [selectedCoin, setSelectedCoin] = useState<CoinMarketData | null>(null);
  const [coins, setCoins] = useState<CoinMarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [timeRange, setTimeRange] = useState('7');
  const [userBalance, setUserBalance] = useState(0); // For Deposit Guard
  const [showDepositGuard, setShowDepositGuard] = useState(false);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const loadCoins = async () => {
      setLoading(true);
      try {
        const data = await getMarkets(page, 10);
        setCoins(data);
        if (!selectedCoin && data.length > 0) {
          setSelectedCoin(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCoins();
  }, [page]);

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [marketHistory, setMarketHistory] = useState<any[]>([]);

  useEffect(() => {
    // Generate mocked market history only on client to avoid hydration mismatch
    const history = [...Array(6)].map((_, i) => ({
      time: new Date(Date.now() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      price: (selectedCoin?.current_price || 48720) + (Math.random() - 0.5) * 100,
      change: (Math.random() * 0.5).toFixed(3),
      isUp: Math.random() > 0.5
    }));
    setMarketHistory(history);
  }, [selectedCoin]);

  const handleTradeAction = () => {
    if (userBalance <= 0) {
      setShowDepositGuard(true);
    } else {
      setIsLoading(true, `Executing ${activeTab.toUpperCase()} Order`);
      
      // Simulate trade execution
      setTimeout(() => {
          setIsLoading(false);
          console.log('Trade executed');
      }, 3000);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 max-w-[1700px] mx-auto pb-12 font-outfit px-3 sm:px-4">
      <div className="bg-[#0C101A] rounded-[24px] p-4 sm:p-5 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-5 sm:mb-6 px-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2 whitespace-nowrap">
                    <TrendingUp size={16} className="text-dash-accent" />
                    Live Markets
                </h3>
                <div className="flex items-center gap-2 sm:hidden">
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-white disabled:opacity-20 transition-all border border-white/5"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <span className="text-[9px] font-space text-text-muted uppercase tracking-widest font-bold min-w-[40px] text-center">Pg {page}</span>
                    <button 
                        onClick={() => setPage(p => p + 1)}
                        className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-white transition-all border border-white/5"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
              </div>
              
              <div className="relative flex-1 max-w-sm group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-dash-accent transition-colors" size={14} />
                  <input 
                      type="text" 
                      placeholder="Search coins..."
                      className="w-full bg-[#141822] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:border-dash-accent/40 focus:bg-[#1a1f2d] transition-all outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
              </div>
              <div className="hidden sm:flex items-center gap-2 ml-auto">
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-white disabled:opacity-20 transition-all border border-white/5"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <span className="text-[10px] font-space text-text-muted uppercase tracking-widest font-bold min-w-[60px] text-center">Pg {page}</span>
                    <button 
                        onClick={() => setPage(p => p + 1)}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-white transition-all border border-white/5"
                    >
                        <ChevronRight size={14} />
                    </button>
              </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar pr-4">
              {loading ? (
                  <div className="flex gap-4">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-3 min-w-[180px] animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-white/5" />
                            <div className="space-y-1.5">
                                <div className="w-12 h-3 bg-white/5 rounded" />
                                <div className="w-8 h-2 bg-white/5 rounded" />
                            </div>
                        </div>
                      ))}
                  </div>
              ) : (
                  filteredCoins.map((coin) => (
                      <motion.div 
                          key={coin.id}
                          onClick={() => setSelectedCoin(coin)}
                          className={`flex items-center gap-4 bg-[#141822]/40 border rounded-2xl p-3 min-w-[200px] cursor-pointer transition-all ${
                              selectedCoin?.id === coin.id 
                                  ? 'bg-dash-accent/10 border-dash-accent/30' 
                                  : 'hover:bg-white/[0.03] border-white/5'
                          }`}
                      >
                          <div className="w-10 h-10 rounded-xl bg-white/5 relative overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                                <Image src={coin.image} alt={coin.name} fill className="object-contain p-1.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <p className="text-white font-bold text-sm leading-tight">{coin.symbol.toUpperCase()}</p>
                                <p className={`text-[10px] font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-dash-accent' : 'text-dash-error'}`}>
                                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                                </p>
                              </div>
                              <p className="text-white/60 font-bold text-xs mt-1 font-mono">${coin.current_price.toLocaleString()}</p>
                          </div>
                      </motion.div>
                  ))
              )}
          </div>
      </div>
      
      {/* Upper Grid: Chart & Order Entry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        
        {/* Dynamic Charting Terminal - Expanded to 2 columns on LG */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8 h-full">
            <div className="bg-[#0C101A] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-5 md:p-6 lg:p-8 border border-white/5 shadow-2xl relative overflow-hidden h-full flex flex-col">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-dash-accent/10 border border-dash-accent/20 flex items-center justify-center relative overflow-hidden shadow-inner">
                            {selectedCoin && <Image src={selectedCoin.image} alt="" fill className="object-contain p-2.5" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight font-outfit">{selectedCoin?.symbol.toUpperCase()} / USD</h2>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                                    (selectedCoin?.price_change_percentage_24h || 0) >= 0 
                                      ? 'bg-dash-accent/10 text-dash-accent border-dash-accent/20' 
                                      : 'bg-dash-error/10 text-dash-error border-dash-error/20'
                                }`}>
                                    <TrendingUp size={12} />
                                    {(selectedCoin?.price_change_percentage_24h || 0) >= 0 ? '+' : ''}{selectedCoin?.price_change_percentage_24h?.toFixed(2)}%
                                </div>
                            </div>
                            <p className="text-text-muted text-[11px] uppercase tracking-[0.2em] font-space mt-1">{selectedCoin?.name} Institutional Index</p>
                        </div>
                    </div>

                    <div className="flex bg-[#141822]/80 backdrop-blur-md rounded-2xl p-1.5 shadow-2xl border border-white/5">
                        {[
                            { label: '1D', value: '1' },
                            { label: '1W', value: '7' },
                            { label: '1M', value: '30' },
                            { label: '1Y', value: '365' }
                        ].map((item) => (
                            <button 
                                key={item.label}
                                onClick={() => setTimeRange(item.value)}
                                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                                    timeRange === item.value 
                                      ? 'bg-dash-accent text-bg-primary shadow-lg shadow-dash-accent/20 scale-105' 
                                      : 'text-text-muted hover:text-white'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] relative">
                    {selectedCoin && (
                        <BalanceChart coinId={selectedCoin.id} days={timeRange} />
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 lg:pt-8 border-t border-white/5">
                    {[
                        { label: 'Current Price', value: `$${selectedCoin?.current_price.toLocaleString()}`, highlight: true },
                        { label: 'Market Cap', value: `$${selectedCoin?.market_cap.toLocaleString()}` },
                        { label: '24h High', value: `$${((selectedCoin?.current_price || 0) * 1.05).toLocaleString()}` },
                        { label: '24h Low', value: `$${((selectedCoin?.current_price || 0) * 0.95).toLocaleString()}` },
                    ].map((stat) => (
                        <div key={stat.label} className="group cursor-default">
                            <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1.5 font-bold group-hover:text-dash-accent transition-colors">{stat.label}</p>
                            <p className={`text-sm sm:text-base lg:text-lg font-bold tracking-tight font-mono ${stat.highlight ? 'text-dash-accent' : 'text-white'}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Order Execution Module - Fixed 1 column on LG */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6 lg:space-y-8 h-full">
            <div className="bg-[#0C101A] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-5 md:p-6 lg:p-8 border border-white/5 shadow-2xl relative flex flex-col h-full overflow-hidden">
                <div className="mb-0 flex-1">
                    <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                        <h3 className="text-white font-bold text-base sm:text-lg font-outfit uppercase tracking-tight">Trade Terminal</h3>
                        <div className="flex items-center gap-1.5 text-[10px] text-dash-accent font-bold bg-dash-accent/10 px-3 py-1 rounded-full border border-dash-accent/20">
                            <Zap size={10} fill="currentColor" /> Institutional
                        </div>
                    </div>

                    {/* Trade Tabs */}
                    <div className="flex bg-[#141822] rounded-xl sm:rounded-2xl p-1.5 mb-4 sm:mb-6 lg:mb-8 border border-white/5">
                        <button 
                            onClick={() => setActiveTab('buy')}
                            className={`flex-1 py-2.5 sm:py-3 md:py-3.5 font-bold rounded-lg sm:rounded-xl text-xs shadow-xl transition-all uppercase tracking-widest ${
                                activeTab === 'buy' 
                                    ? 'bg-dash-accent text-bg-primary scale-[1.02]' 
                                    : 'text-text-muted hover:text-white'
                            }`}
                        >
                            Buy
                        </button>
                        <button 
                            onClick={() => setActiveTab('sell')}
                            className={`flex-1 py-2.5 sm:py-3 md:py-3.5 font-bold rounded-lg sm:rounded-xl text-xs hover:shadow-xl transition-all uppercase tracking-widest ${
                                activeTab === 'sell' 
                                    ? 'bg-dash-error text-white scale-[1.02]' 
                                    : 'text-text-muted hover:text-white'
                            }`}
                        >
                            Sell
                        </button>
                    </div>

                    <div className="space-y-4 sm:space-y-6 lg:space-y-8 relative">
                        {/* Deposit Guard Overlay */}
                        <AnimatePresence>
                            {showDepositGuard && (
                                <motion.div 
                                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                                    animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
                                    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                                    className="absolute inset-x-[-15px] inset-y-[-15px] z-20 bg-bg-primary/70 rounded-2xl sm:rounded-[28px] flex flex-col items-center justify-center p-6 sm:p-8 text-center border border-white/5 shadow-2xl"
                                >
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-dash-error/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-dash-error/20 shadow-2xl shadow-dash-error/10">
                                        <Wallet className="text-dash-error" size={28} />
                                    </div>
                                    <h4 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3">Insufficient Capital</h4>
                                    <p className="text-text-muted text-xs sm:text-[13px] mb-6 sm:mb-10 leading-relaxed font-outfit">Your institutional trading account balance is currently **$0.00**. Provide liquidity to begin trading assets.</p>
                                    <button 
                                        className="w-full py-4 sm:py-5 bg-dash-accent text-bg-primary font-extrabold rounded-xl sm:rounded-2xl hover:bg-white transition-all shadow-2xl shadow-dash-accent/20 active:scale-95 text-sm uppercase tracking-[0.2em]"
                                        onClick={() => window.location.href = '/dashboard/deposit'}
                                    >
                                        Fund Account
                                    </button>
                                    <button 
                                        className="mt-6 text-[11px] text-text-muted uppercase font-bold tracking-widest hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-0.5"
                                        onClick={() => setShowDepositGuard(false)}
                                    >
                                        Skip for now
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Trading Amount</label>
                                <span className="text-[11px] font-mono text-text-muted/60">Balance: $0.00</span>
                            </div>
                            <div className="relative group">
                                <input 
                                    type="number" 
                                    placeholder="0.00"
                                    className="w-full bg-[#141822] border border-white/5 rounded-xl sm:rounded-2xl py-3 px-4 sm:py-4 sm:px-6 md:py-5 md:px-8 text-lg sm:text-xl md:text-2xl font-bold text-white outline-none focus:border-dash-accent/40 focus:bg-white/[0.04] transition-all font-mono"
                                />
                                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-bold text-white/20 text-sm group-focus-within:text-dash-accent transition-colors tracking-widest">USD</span>
                            </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <label className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold px-1">Estimated Return</label>
                            <div className="bg-[#141822] rounded-xl sm:rounded-2xl py-3 px-4 sm:py-4 sm:px-6 md:py-5 md:px-8 flex items-center justify-between border border-white/5 group hover:bg-white/[0.02] transition-colors">
                                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white/10 font-mono">0.00</span>
                                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-inner group-hover:border-dash-accent/20 transition-all">
                                     <div className="w-6 h-6 relative rounded-full overflow-hidden shadow-2xl">
                                        {selectedCoin && <Image src={selectedCoin.image} alt="" fill className="object-contain" />}
                                     </div>
                                     <span className="font-extrabold text-sm text-white tracking-wider">{selectedCoin?.symbol.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-3 sm:p-4 md:p-5 bg-white/[0.03] rounded-xl sm:rounded-2xl border border-white/10 space-y-3 sm:space-y-4 shadow-inner">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-text-muted flex items-center gap-2 font-bold uppercase tracking-tighter"><Clock size={14} className="text-dash-accent/60" /> Market Type</span>
                                <span className="text-white font-mono font-bold">Standard</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-text-muted flex items-center gap-2 font-bold uppercase tracking-tighter"><ShieldAlert size={14} className="text-dash-accent/60" /> Network Fee</span>
                                <span className="text-dash-accent font-mono font-bold">$0.00</span>
                            </div>
                        </div>

                        <button 
                            className={`w-full py-4 sm:py-5 md:py-6 font-black rounded-xl sm:rounded-2xl hover:bg-white transition-all shadow-2xl active:scale-[0.98] text-sm uppercase tracking-[0.25em] mt-4 sm:mt-6 ${
                                activeTab === 'buy' 
                                    ? 'bg-dash-accent text-bg-primary shadow-dash-accent/20' 
                                    : 'bg-dash-error text-white shadow-dash-error/20'
                            }`}
                            onClick={handleTradeAction}
                        >
                            {activeTab} {selectedCoin?.symbol.toUpperCase()}
                        </button>
                    </div>
                </div>

                <div className="mt-4 sm:mt-6 lg:mt-8 space-y-3 sm:space-y-4 border-t border-white/5 pt-4 sm:pt-6 lg:pt-8">
                     <div className="flex items-center gap-3 text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">
                        <div className="w-2 h-2 rounded-full bg-dash-accent animate-pulse shadow-[0_0_10px_rgba(163,240,193,0.5)]" />
                        SLA Verified Transmission
                     </div>
                </div>
            </div>
        </div>
      </div>

      {/* Lower Section: Open Orders & Market History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-[#0C101A] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-5 md:p-6 lg:p-8 border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                     <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight">Open Orders</h3>
                     <button className="text-[11px] text-dash-accent font-bold uppercase tracking-widest hover:underline">View All History</button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left py-4 text-[10px] text-text-muted uppercase tracking-widest font-bold">Asset</th>
                                <th className="text-left py-4 text-[10px] text-text-muted uppercase tracking-widest font-bold">Type</th>
                                <th className="text-left py-4 text-[10px] text-text-muted uppercase tracking-widest font-bold">Price</th>
                                <th className="text-left py-4 text-[10px] text-text-muted uppercase tracking-widest font-bold">Amount</th>
                                <th className="text-right py-4 text-[10px] text-text-muted uppercase tracking-widest font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {/* Empty state - no dummy orders */}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Clock size={32} className="text-text-muted" />
                    </div>
                    <p className="text-text-muted text-sm font-medium">No other active orders found</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Your order queue is currently clear</p>
                </div>
            </div>

            <div className="bg-[#0C101A] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-5 md:p-6 lg:p-8 border border-white/5 shadow-2xl flex flex-col">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight mb-4 sm:mb-6 lg:mb-8">Market History</h3>
                <div className="space-y-4 flex-1">
                    {marketHistory.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 sm:py-3 border-b border-white/5 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${item.isUp ? 'bg-dash-accent' : 'bg-dash-error'}`} />
                                <span className="text-white/60 text-xs font-mono">{item.time}</span>
                            </div>
                            <span className="text-white font-bold text-xs font-mono">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            <span className={`text-[10px] font-bold ${item.isUp ? 'text-dash-accent' : 'text-dash-error'}`}>
                                {item.isUp ? '+' : '-'}{item.change}%
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 border-t border-white/5 flex items-center gap-2">
                     <Zap size={14} className="text-dash-accent" />
                     <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Real-time market depth</p>
                </div>
            </div>
      </div>
    </div>
  );
}
