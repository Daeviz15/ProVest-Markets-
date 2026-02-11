"use client";

import React from 'react';
import { motion, Variants } from "motion/react";

const benefitItems = [
  {
    title: "Blockchain Consulting With Your Business",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    )
  },
  {
    title: "Kickstart your crypto website today",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "Designed for crypto trading platforms",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
];

const portfolioData = [
  { name: "Bitcoin", symbol: "BTC", change: "+2.20%", color: "#F7931A", icon: "/btc.jpg" },
  { name: "Ethereum", symbol: "ETH", change: "+1.50%", color: "#627EEA", icon: "/eth.png" },
  { name: "Litecoin", symbol: "LTC", change: "+3.05%", color: "#345D9D", icon: "/litecoin.png" },
  { name: "Polkadot", symbol: "DOT", change: "+2.80%", color: "#E6007A", icon: "/polkadot.png" }
];

export default function Benefits() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const }
    }
  };

  return (
    <section id="benefits" className="bg-bg-primary py-32 relative overflow-hidden">
      {/* Premium High-Gloss Glowing Arc Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none -translate-y-[50%]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-[60px] drop-shadow-[0_0_20px_rgba(163,240,193,0.3)] filter blur-[0.5px]"
        >
          <defs>
            <linearGradient id="divider-grad-glow-benefits" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--accent-green)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="divider-grad-core-benefits" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--accent-green)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Thick Outer Glow Line */}
          <path
            d="M0,100 Q600,0 1200,100"
            stroke="url(#divider-grad-glow-benefits)"
            strokeWidth="6"
            fill="transparent"
            strokeLinecap="round"
          />
          {/* Sharp Inner Core Line */}
          <path
            d="M0,100 Q600,0 1200,100"
            stroke="url(#divider-grad-core-benefits)"
            strokeWidth="1.5"
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Decorative Background Waves */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full pointer-events-none opacity-20">
        <svg viewBox="0 0 500 500" className="w-full h-full">
          <path d="M0,250 Q125,150 250,250 T500,250" fill="none" stroke="var(--accent-green)" strokeWidth="1" className="animate-pulse" />
          <path d="M0,280 Q125,180 250,280 T500,280" fill="none" stroke="#627EEA" strokeWidth="1" style={{ opacity: 0.5 }} />
          <path d="M0,220 Q125,120 250,220 T500,220" fill="none" stroke="#E6007A" strokeWidth="1" style={{ opacity: 0.3 }} />
        </svg>
      </div>

      <div className="mx-auto px-6 sm:px-8 lg:px-12 max-w-[var(--container-max)] relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-24">
          
          {/* Left: Feature List */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="lg:w-1/2 flex flex-col gap-10"
          >
            <div>
              <span className="text-accent-green font-space text-[14px] font-medium tracking-[0.2em] uppercase mb-4 inline-block">
                Earning Power
              </span>
              <h2 className="font-outfit text-white text-[44px] sm:text-[56px] font-bold leading-[1.05] tracking-tight mb-6">
                Earn <span className="text-accent-green italic">Alpha</span> <br /> on your portfolio.
              </h2>
              <p className="text-white/40 text-[18px] leading-relaxed max-w-lg">
                Unlock automated yield strategies and real-time portfolio optimization tools designed for institutional holders.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {[
                { title: "Smart Compounding", desc: "Automated yield harvesting across major DeFi protocols." },
                { title: "Risk Mitigation", desc: "AI-driven liquidity protection and slippage prevention." }
              ].map((benefit, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-1px h-full bg-white/10 group-hover:bg-accent-green/40 transition-colors" />
                  <div className="flex flex-col gap-2">
                    <h4 className="text-white text-[20px] font-bold font-outfit">{benefit.title}</h4>
                    <p className="text-white/30 text-[15px] leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Asset Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:w-1/2 w-full max-w-[500px] aspect-square relative group"
          >
            <div className="absolute inset-0 bg-accent-green/5 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700" />
            <div className="relative h-full bg-[#0A0E1A]/60 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 flex flex-col shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-10">
                <div className="flex flex-col">
                  <span className="text-white/40 text-[13px] font-space uppercase tracking-widest font-bold mb-1">Live Profit</span>
                  <span className="text-white text-[32px] font-bold font-outfit">+$4,291.80</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green text-[13px] font-bold font-space">
                  +12.4%
                </div>
              </div>

              {/* Asset List */}
              <div className="flex flex-col gap-6">
                {portfolioData.map((coin, i) => (
                  <div key={i} className="flex items-center justify-between group/asset">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center p-1.5 overflow-hidden group-hover/asset:border-accent-green/30 transition-colors relative">
                        {/* Inner Aura */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-accent-green/20 to-transparent opacity-0 group-hover/asset:opacity-100 transition-opacity" />
                        <img
                          src={coin.icon}
                          alt={coin.name}
                          className="w-full h-full object-cover rounded-full relative z-10 p-1"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-bold font-outfit text-[16px]">{coin.name}</span>
                        <span className="text-white/30 text-[13px] font-space">{coin.symbol}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold font-outfit">{coin.change}</div>
                      <div className="w-12 h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-accent-green" 
                          style={{ width: `${60 + i * 10}%`, opacity: 0.6 + i * 0.1 }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Metrics Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-white/5"
        >
          {[
            { label: "Active users", val: "6M+" },
            { label: "Daily Volume", val: "$1.4B" },
            { label: "Safe Security", val: "100%" },
            { label: "Trade Volume", val: "$22B+" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-accent-green text-[24px] sm:text-[32px] font-bold font-outfit mb-1">{stat.val}</span>
              <span className="text-white/20 text-[12px] font-space uppercase tracking-[0.2em] font-bold">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
