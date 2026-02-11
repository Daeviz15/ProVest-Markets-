"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

const popularCoins = [
  { name: 'BTC', price: '$57,750', change: '-0.24%', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a6353054d9072017cf627ccda0689531c3bf108/128/color/btc.png' },
  { name: 'ETH', price: '$24,800', change: '+8.36%', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a6353054d9072017cf627ccda0689531c3bf108/128/color/eth.png' },
  { name: 'XRP', price: '$96,250', change: '-2.12%', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a6353054d9072017cf627ccda0689531c3bf108/128/color/xrp.png' },
];

export default function MarketsOverview() {
  const [activeTab, setActiveTab] = useState('popular');

  return (
    <div className="bg-dash-surface/50 border border-dash-border rounded-[32px] p-8 h-full">
      <h3 className="text-lg font-bold text-white mb-6 font-outfit">Markets Overview</h3>
      
      {/* Tabs */}
      <div className="flex bg-white/[0.03] p-1 rounded-xl mb-8 w-fit">
        {['Popular', 'New Listing'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.toLowerCase() 
                ? 'bg-dash-accent text-bg-primary shadow-lg shadow-dash-accent/10' 
                : 'text-text-muted hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Coin List */}
      <div className="space-y-6">
        {popularCoins.map((coin, index) => (
          <motion.div 
            key={coin.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5 transition-all group-hover:border-dash-accent/30">
                <Image src={coin.icon} alt={coin.name} width={24} height={24} />
              </div>
              <span className="font-bold text-white font-outfit">{coin.name}</span>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-bold text-white font-outfit">{coin.price}</p>
              <p className={`text-[11px] font-bold ${coin.change.startsWith('+') ? 'text-dash-accent' : 'text-dash-error'}`}>
                {coin.change}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
