"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Zap, 
  Clock, 
  Heart,
  LayoutGrid,
  List,
  Filter,
  ArrowUpRight,
  Wallet,
  ImageIcon,
  Flame
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const MY_NFTS: any[] = [];

const TABS = ["Collected", "Created", "Favorites", "Hidden"];

export default function MyNftsPage() {
    const [activeTab, setActiveTab] = useState("Collected");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const displayNfts = MY_NFTS.filter(nft => nft.category === activeTab);

    return (
        <div className="space-y-10 max-w-[1400px] mx-auto pb-12">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-dash-accent font-bold uppercase text-[10px] tracking-[0.3em]">
                        <ImageIcon size={14} />
                        Personal Gallery
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white font-outfit leading-tight">
                        My NFT <span className="text-transparent bg-clip-text bg-gradient-to-r from-dash-accent to-emerald-500">Collection</span>
                    </h1>
                </div>
                
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/nft-marketplace">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl font-bold text-sm hover:bg-dash-accent transition-all shadow-xl shadow-white/5 active:scale-95">
                            <Plus size={18} />
                            Mint New NFT
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Asset Value", value: "0.00 ETH", sub: "Start collecting", icon: Wallet, color: "dash-accent" },
                    { label: "NFTs Collected", value: "0", sub: "No assets yet", icon: ImageIcon, color: "blue-400" },
                    { label: "Floor Price High", value: "0.00 ETH", sub: "N/A", icon: Flame, color: "purple-500" },
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-black border border-white/5 rounded-[32px] p-6 relative overflow-hidden group"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}/5 blur-[60px] rounded-full`} />
                        <div className="relative z-10 flex items-start justify-between">
                            <div className="space-y-4">
                                <p className="text-text-muted text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-white font-mono">{stat.value}</h3>
                                <p className="text-dash-accent text-[10px] font-bold flex items-center gap-1">
                                    <ArrowUpRight size={12} /> {stat.sub}
                                </p>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-${stat.color}`}>
                                <stat.icon size={22} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters & View Switches */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-6">
                <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                                activeTab === tab 
                                    ? 'bg-dash-accent text-black shadow-lg shadow-dash-accent/20' 
                                    : 'text-text-muted hover:text-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-xl">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <div className="h-8 w-px bg-white/5" />
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>
            </div>

            {/* Asset Grid */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeTab + viewMode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        : "space-y-4"
                    }
                >
                    {displayNfts.length > 0 ? (
                        displayNfts.map((nft, index) => (
                            viewMode === 'grid' ? (
                                <motion.div
                                    key={nft.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative bg-black rounded-[32px] p-4 border border-white/5 hover:border-dash-accent/30 transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,255,163,0.05)]"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-[280px] w-full rounded-[24px] overflow-hidden mb-5 bg-[#080808]">
                                        <div className="w-full h-full relative [mask-image:linear-gradient(to_top,transparent_0%,black_15%,black_100%)]">
                                            <Image 
                                                src={nft.image} 
                                                alt={nft.title} 
                                                fill 
                                                className="object-contain group-hover:scale-105 transition-transform duration-700 p-2" 
                                            />
                                        </div>
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="bg-black/40 backdrop-blur-md text-dash-accent text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border border-dash-accent/20">
                                                {nft.rarity}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-white font-outfit group-hover:text-dash-accent transition-colors">{nft.title}</h3>
                                                <p className="text-[10px] text-text-muted font-bold mt-1 uppercase tracking-wider">{nft.collection}</p>
                                            </div>
                                            <button className="text-text-muted hover:text-white transition-colors">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                            <div>
                                                <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest mb-1">Value</p>
                                                <p className="text-white font-mono font-bold text-base flex items-center gap-1">
                                                    <Zap size={14} className="text-dash-accent fill-current" /> {nft.value}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest mb-1">Acquired</p>
                                                <p className="text-white text-[10px] font-bold">{nft.acquired}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key={nft.id}
                                    className="flex items-center gap-6 p-4 bg-black border border-white/5 rounded-2xl hover:border-dash-accent/20 transition-all group"
                                >
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#080808] relative flex-shrink-0">
                                        <Image src={nft.image} alt={nft.title} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                                        <div>
                                            <h4 className="text-white font-bold font-outfit">{nft.title}</h4>
                                            <p className="text-[10px] text-text-muted uppercase tracking-wider">{nft.collection}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest mb-1">Rarity</p>
                                            <p className="text-dash-accent text-xs font-bold">{nft.rarity}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest mb-1">Estimated Value</p>
                                            <p className="text-white text-sm font-mono font-bold">{nft.value}</p>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <button className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-xs font-bold text-white hover:bg-white/10">Sell</button>
                                            <button className="p-2 bg-white/[0.03] border border-white/5 rounded-lg text-text-muted hover:text-white">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
                            <div className="w-20 h-20 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center justify-center text-text-muted/30">
                                <Search size={40} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white font-outfit">No items found</h3>
                                <p className="text-text-muted text-sm mt-1">Try changing your filters or explore the marketplace.</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
