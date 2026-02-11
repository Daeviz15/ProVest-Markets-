"use client";

import React, { useState } from 'react';
import { ChevronDown, RefreshCw } from 'lucide-react';
import Image from 'next/image';

export default function QuickTrade() {
  const [side, setSide] = useState('buy');

  return (
    <div className="bg-dash-surface/50 border border-dash-border rounded-[32px] p-8 h-full">
      <h3 className="text-lg font-bold text-white mb-6 font-outfit">Make Quick Trades</h3>
      
      {/* Buy/Sell Toggle */}
      <div className="flex bg-white/[0.03] p-1 rounded-xl mb-8">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
            side === 'buy' ? 'bg-dash-accent text-bg-primary' : 'text-text-muted'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
            side === 'sell' ? 'bg-dash-error text-bg-primary' : 'text-text-muted'
          }`}
        >
          Sell
        </button>
      </div>

      <div className="space-y-4">
        {/* Spend */}
        <div className="space-y-2">
            <div className="flex justify-between text-[11px] text-text-muted uppercase font-space tracking-wider px-1">
                <span>Spend</span>
                <span>Balances: 18-16,500</span>
            </div>
            <div className="relative group">
                <input 
                    type="number" 
                    placeholder="0"
                    className="w-full bg-white/[0.03] border border-dash-border rounded-xl py-4 pl-4 pr-32 text-white font-outfit outline-none focus:border-dash-accent/40"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors border border-white/5">
                    <Image src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a6353054d9072017cf627ccda0689531c3bf108/128/color/usdt.png" width={18} height={18} alt="USDT" />
                    <span className="text-xs font-bold text-white uppercase">USDT</span>
                    <ChevronDown size={14} className="text-text-muted" />
                </div>
            </div>
        </div>

        {/* Swap Icon */}
        <div className="flex justify-center -my-2 relative z-10">
            <button className="w-10 h-10 bg-dash-bg border border-dash-border rounded-full flex items-center justify-center text-dash-accent hover:rotate-180 transition-transform duration-500 shadow-xl">
                <RefreshCw size={18} />
            </button>
        </div>

        {/* Receive */}
        <div className="space-y-2">
            <div className="text-[11px] text-text-muted uppercase font-space tracking-wider px-1">
                Receive
            </div>
            <div className="relative group">
                <input 
                    type="number" 
                    placeholder="0"
                    className="w-full bg-white/[0.03] border border-dash-border rounded-xl py-4 pl-4 pr-32 text-white font-outfit outline-none focus:border-dash-accent/40"
                    disabled
                />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors border border-white/5">
                    <Image src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a6353054d9072017cf627ccda0689531c3bf108/128/color/eth.png" width={18} height={18} alt="ETH" />
                    <span className="text-xs font-bold text-white uppercase">ETH</span>
                    <ChevronDown size={14} className="text-text-muted" />
                </div>
            </div>
        </div>

        <button className={`w-full py-4 rounded-2xl font-bold text-[15px] transition-all transform active:scale-95 shadow-lg mt-4 ${
            side === 'buy' ? 'bg-dash-accent text-bg-primary hover:bg-white' : 'bg-dash-error text-bg-primary hover:bg-white'
        }`}>
            {side === 'buy' ? 'Execute Buy Order' : 'Execute Sell Order'}
        </button>
      </div>
    </div>
  );
}
