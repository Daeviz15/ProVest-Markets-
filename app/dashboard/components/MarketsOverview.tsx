"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { getMarkets, CoinMarketData } from '@/lib/crypto';
import { CoinSkeleton } from './CoinSkeleton';
import { AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';

export default function MarketsOverview({ 
  onCoinSelect, 
  selectedCoinId 
}: { 
  onCoinSelect?: (id: string, symbol: string, name: string) => void,
  selectedCoinId?: string
}) {
  const [activeTab, setActiveTab] = useState('popular');
  const [coins, setCoins] = useState<CoinMarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const order = activeTab === 'popular' ? 'market_cap_desc' : 'volume_desc';
        const data = await getMarkets(page, 5, order);
        setCoins(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [activeTab, page]);

  return (
    <div className="bg-[#0C101A] rounded-[32px] p-8 h-full shadow-2xl flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white font-outfit tracking-tight">Markets Overview</h3>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-text-muted hover:text-white disabled:opacity-30 transition-all"
            >
                <ChevronLeft size={16} />
            </button>
            <span className="text-[10px] font-space text-text-muted uppercase tracking-widest">Page {page}</span>
            <button 
                onClick={() => setPage(p => p + 1)}
                disabled={loading}
                className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-text-muted hover:text-white disabled:opacity-30 transition-all"
            >
                <ChevronRight size={16} />
            </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex bg-[#141822]/80 backdrop-blur-md p-1 rounded-xl mb-8 w-fit shadow-inner">
        {['Popular', 'New Listing'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
                setActiveTab(tab.toLowerCase().replace(' ', ''));
                setPage(page); // keep page
            }}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.toLowerCase().replace(' ', '')
                ? 'bg-dash-accent text-bg-primary shadow-lg shadow-dash-accent/10' 
                : 'text-text-muted hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Coin List */}
      <div className="flex-1 space-y-2">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-3 py-4"
            >
                <AlertCircle size={24} className="text-dash-error/50" />
                <p className="text-xs text-dash-error font-medium">{error}</p>
                <button 
                    onClick={() => setPage(1)}
                    className="text-[11px] text-dash-accent hover:underline font-bold uppercase tracking-widest"
                >
                    Retry
                </button>
            </motion.div>
          ) : loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
                {[...Array(5)].map((_, i) => <CoinSkeleton key={i} />)}
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {coins.map((coin, index) => (
                <motion.div 
                  key={coin.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onCoinSelect?.(coin.id, coin.symbol, coin.name)}
                  className={`flex items-center justify-between p-3 rounded-2xl group cursor-pointer transition-all ${
                    selectedCoinId === coin.id 
                        ? 'bg-dash-accent/10 border border-dash-accent/20' 
                        : 'hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center border border-white/5 transition-all group-hover:border-dash-accent/30 overflow-hidden relative">
                      <Image 
                        src={coin.image} 
                        alt={coin.name} 
                        fill
                        className="p-2 object-contain"
                      />
                    </div>
                    <div>
                        <span className="font-bold text-white font-outfit block leading-tight">{coin.symbol.toUpperCase()}</span>
                        <span className="text-[10px] text-text-muted uppercase font-space tracking-tighter">{coin.name}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-bold text-white font-outfit">
                        ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </p>
                    <p className={`text-[11px] font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-dash-accent' : 'text-dash-error'}`}>
                      {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
