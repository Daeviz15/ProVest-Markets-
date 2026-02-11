"use client";

import React from 'react';
import { motion, Variants } from "motion/react";

const featureData = [
  {
    label: "Highest volume",
    name: "BitCoin",
    symbol: "BTC",
    value: "$83411",
    color: "#F7931A",
    icon: "/btc.jpg"
  },
  {
    label: "Top gainer",
    name: "Ethereum",
    symbol: "ETH",
    value: "$1799.47",
    color: "#627EEA",
    icon: "/eth.png"
  },
  {
    label: "New listing",
    name: "Solana",
    symbol: "SOL",
    value: "$145.22",
    color: "#14F195",
    icon: "/solana.jpg"
  },
  {
    label: "Most active",
    name: "Polkadot",
    symbol: "DOT",
    value: "$7.42",
    color: "#E6007A",
    icon: "/polkadot.png"
  }
];

export default function Features() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const }
    }
  };

  return (
    <section id="features" className="relative bg-bg-primary pt-12 pb-32">
      {/* Premium High-Gloss Glowing Arc Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none -translate-y-[50%]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-[60px] drop-shadow-[0_0_20px_rgba(163,240,193,0.3)] filter blur-[0.5px]"
        >
          <defs>
            <linearGradient id="divider-grad-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--accent-green)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="divider-grad-core" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--accent-green)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Thick Outer Glow Line */}
          <path
            d="M0,100 Q600,0 1200,100"
            stroke="url(#divider-grad-glow)"
            strokeWidth="6"
            fill="transparent"
            strokeLinecap="round"
          />
          {/* Sharp Inner Core Line */}
          <path
            d="M0,100 Q600,0 1200,100"
            stroke="url(#divider-grad-core)"
            strokeWidth="1.5"
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="mx-auto px-6 sm:px-8 lg:px-12 max-w-[var(--container-max)]">
        {/* Market Stats Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div className="max-w-2xl">
            <span className="text-accent-green font-space text-[14px] font-medium tracking-[0.2em] uppercase mb-4 inline-block">
              Institutional Market Data
            </span>
            <h2 className="font-outfit text-white text-[42px] sm:text-[54px] font-bold leading-[1.1] tracking-tight">
              Real-time intelligence <br className="hidden sm:block" /> for global markets.
            </h2>
          </div>
          <div className="flex items-center gap-4 text-white/40 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse shadow-[0_0_10px_rgba(163,240,193,0.5)]" />
            <span className="font-space tracking-tight">Live Market Feed</span>
          </div>
        </motion.div>

        {/* Features Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featureData.map((item, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              transition={{ delay: idx * 0.1 }}
              className="group relative p-8 rounded-[32px] bg-[#0A0E1A]/40 backdrop-blur-md border border-white/[0.05] hover:border-accent-green/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-xl"
            >
              {/* Card Aura Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col items-start gap-12">
                <span className="text-white/30 font-space text-[12px] font-bold tracking-widest uppercase">
                  {item.label}
                </span>
                
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white/5 border border-white/5 group-hover:border-white/10 p-2 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(163,240,193,0.05)] relative">
                  {/* Brand Aura Glow */}
                  <div 
                    className="absolute inset-2 blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full pointer-events-none"
                    style={{ backgroundColor: item.color }}
                  />
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-full filter group-hover:brightness-110 relative z-10"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.symbol}&background=${item.color.replace("#", "")}&color=fff`;
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-white text-[24px] font-bold font-outfit">
                      {item.symbol}
                    </h3>
                    <span className="text-white/40 text-[14px] font-medium">/{item.name}</span>
                  </div>
                  <span className="text-accent-green text-[28px] font-bold tracking-tighter font-outfit tabular-nums">
                    {item.value}
                  </span>
                </div>
              </div>

              {/* Decorative Accent Line */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
