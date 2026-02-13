"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, Share2, MoreHorizontal, Clock, Zap, Target, AlertCircle, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import NftSpinner from '../components/NftSpinner';

// Curated high-quality Unsplash assets for NFT vibes
const HERO_IMAGE = "/nft-hero.png"; 
const AVATAR_1 = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80"; // Bitcoin Art
const AVATAR_2 = "https://images.unsplash.com/photo-1635326444826-06c8f411c074?auto=format&fit=crop&w=500&q=80"; // Abstract Neon
const AVATAR_3 = "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=500&q=80"; // 3D Shapes

const TRENDING_NFTS = [
  {
    id: 1,
    title: "Cyberpunk Ape #402",
    creator: "@NeonArtist",
    price: "0.85 ETH",
    image: "/nft-one.png",
    endsIn: "2hr : 56m : 21s",
    tag: "Limited Edition"
  },
  {
    id: 2,
    title: "Abstract Realm #12",
    creator: "@DigitalDreams",
    price: "1.25 ETH",
    image: "/nft-two.png",
    endsIn: "5hr : 12m : 05s",
    tag: "Rare"
  },
  {
    id: 3,
    title: "Future City #88",
    creator: "@CyberPunk",
    price: "0.42 ETH",
    image: "/nft-three.png",
    endsIn: "12hr : 45m : 30s",
    tag: "Auction"
  }
];

export default function NftMarketplacePage() {
  const [biddingStatus, setBiddingStatus] = useState<'idle' | 'checking' | 'insufficient'>('idle');
  const [activeNft, setActiveNft] = useState<any>(null);

  const handleBid = (nft: any) => {
    setActiveNft(nft);
    setBiddingStatus('checking');
    
    // Simulate balance check logic
    setTimeout(() => {
        setBiddingStatus('insufficient');
    }, 2500);
  };

  return (
    <div className="space-y-12 max-w-[1400px] mx-auto pb-12 relative">
      <AnimatePresence>
          {biddingStatus !== 'idle' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
              >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#080808] border border-white/5 rounded-[40px] p-10 max-w-md w-full text-center relative overflow-hidden shadow-2xl"
                  >
                        {/* Radial Glow Background */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-dash-accent/10 via-transparent to-transparent opacity-50" />

                        {biddingStatus === 'checking' ? (
                            <NftSpinner 
                                size="lg" 
                                message="Validating Bid" 
                                image="/nft-one.png"
                            />
                        ) : (
                            <div className="space-y-8 relative z-10">
                                <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                                    <AlertCircle size={40} />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold text-white font-outfit">Insufficient Funds</h3>
                                    <p className="text-text-muted text-sm leading-relaxed">
                                        You don't have enough ETH to bid on <span className="text-white font-bold">{activeNft?.title}</span>. 
                                        Please deposit funds to own this asset.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 pt-4">
                                    <Link href="/dashboard/deposit">
                                        <button className="w-full py-4 bg-dash-accent text-black font-bold rounded-2xl hover:bg-white transition-all shadow-lg shadow-dash-accent/10 flex items-center justify-center gap-2">
                                            <Plus size={18} />
                                            Deposit Now
                                        </button>
                                    </Link>
                                    <button 
                                        onClick={() => setBiddingStatus('idle')}
                                        className="w-full py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/5"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
      
      {/* Hero Section */}
      <section className="relative rounded-[40px] bg-black overflow-hidden min-h-[600px] flex items-center px-8 md:px-12 py-12 border border-white/5 shadow-2xl">
          {/* Professional Background Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-dash-accent/10 via-black to-black" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full relative z-10 items-center">
              
              {/* Text Content */}
              <div className="space-y-8 max-w-2xl">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl md:text-7xl lg:text-8xl font-bold font-outfit text-white leading-[0.95] tracking-tight"
                  >
                      Discover <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">Digital Art</span> <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-dash-accent via-green-400 to-emerald-500">NFTs</span>
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-text-muted text-lg max-w-md leading-relaxed border-l-2 border-dash-accent/50 pl-6"
                  >
                      Buy and sell NFTs from the world's top artists. More than 10,000 premium digital art pieces available.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-12 pt-8"
                  >
                      <div>
                          <p className="text-4xl font-bold text-white font-outfit">78k+</p>
                          <p className="text-text-muted text-[10px] uppercase font-bold tracking-[0.2em] mt-2">Active Users</p>
                      </div>
                      <div>
                          <p className="text-4xl font-bold text-white font-outfit">27k+</p>
                          <p className="text-text-muted text-[10px] uppercase font-bold tracking-[0.2em] mt-2">Artists</p>
                      </div>
                       <div className="w-14 h-14 rounded-full border border-dash-accent text-dash-accent flex items-center justify-center animate-spin-slow bg-dash-accent/5 backdrop-blur-sm">
                            <Target size={28} />
                       </div>
                  </motion.div>
              </div>

              {/* Hero Image - Blended */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative h-[600px] w-full flex items-center justify-center lg:justify-end"
              >
                  {/* Glowing Effect behind image */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-dash-accent/20 blur-[100px] rounded-full animate-pulse-slow" />

                  <div className="relative w-full h-full">
                    {/* Image with Mask for smooth blending on BOTH sides */}
                    <div className="w-full h-full relative [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]">
                        <Image 
                            src={HERO_IMAGE} 
                            alt="Hero NFT" 
                            fill 
                            className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,1)] scale-110 z-10"
                            priority
                        />
                    </div>
                    
                    {/* Stronger Overlays to hide box edges - Specifically strengthening the right side */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black via-black/40 to-transparent z-20 w-1/3 right-0" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent z-20 w-1/3 left-0" />
                  </div>
                  
      
              </motion.div>
          </div>
      </section>

      {/* Trending Section */}
      <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
              <div>
                  <p className="text-dash-accent font-bold uppercase text-xs tracking-[0.2em] mb-2">Trending</p>
                  <h2 className="text-4xl font-bold text-white font-outfit">Live Auctions</h2>
              </div>
              
              <div className="flex gap-2">
                  <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-bg-primary transition-all">
                      <Search size={20} />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-white text-bg-primary flex items-center justify-center hover:bg-dash-accent transition-all font-bold">
                      <ArrowRightIcon />
                  </button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TRENDING_NFTS.map((nft, index) => (
                  <motion.div
                    key={nft.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="group relative bg-black rounded-[32px] p-4 overflow-hidden border border-white/5 transition-all duration-500 hover:border-dash-accent/30 hover:shadow-[0_0_50px_rgba(0,255,163,0.1)]"
                  >
                      {/* Suble Card Radial Gradient */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-dash-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Image Container */}
                      <div className="relative h-[320px] w-full rounded-[24px] overflow-hidden mb-6 bg-[#080808]">
                          {/* Inner Masked Image for Perfect Blending */}
                          <div className="w-full h-full relative [mask-image:linear-gradient(to_top,transparent_0%,black_20%,black_100%)]">
                              <Image 
                                src={nft.image} 
                                alt={nft.title} 
                                fill 
                                className="object-contain group-hover:scale-105 transition-transform duration-700 p-2" 
                              />
                          </div>
                          
                          {/* Top Badges */}
                          <div className="absolute top-4 left-4 z-10">
                               <span className="bg-dash-accent text-black text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-xl">
                                   {nft.tag}
                               </span>
                          </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 px-2 pb-2">
                          <div className="flex justify-between items-start mb-6">
                              <div>
                                  <h3 className="text-xl font-bold text-white font-outfit mb-1 group-hover:text-dash-accent transition-colors">{nft.title}</h3>
                                  <p className="text-text-muted text-xs font-bold flex items-center gap-2">
                                      <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-dash-accent to-emerald-400" />
                                      {nft.creator}
                                  </p>
                              </div>
                              <div className="bg-white/5 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/5 flex flex-col items-center">
                                   <Clock size={14} className="text-dash-accent mb-1" />
                                   <p className="text-[10px] text-white font-mono font-bold">{nft.endsIn.split(' ')[0]}</p>
                              </div>
                          </div>

                          <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                              <div>
                                  <p className="text-text-muted text-[10px] uppercase font-bold tracking-widest mb-1">Price</p>
                                  <p className="text-white font-mono font-bold flex items-center gap-1.5 text-lg">
                                      <Zap size={16} className="text-dash-accent fill-current" /> {nft.price}
                                  </p>
                              </div>
                              <button 
                                onClick={() => handleBid(nft)}
                                className="px-6 py-2.5 rounded-xl bg-dash-accent text-black font-bold text-sm hover:bg-white transition-all shadow-lg shadow-dash-accent/20"
                              >
                                  Bid Now
                              </button>
                          </div>
                      </div>
                  </motion.div>
              ))}
          </div>
      </section>
    </div>
  );
}

function ArrowRightIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    )
}
