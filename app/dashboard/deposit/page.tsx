"use client";

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  ChevronDown, 
  Edit2, 
  Download, 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

// Mock data for deposit options
const SUPPORTED_COINS = [
    { 
        id: 'bitcoin', 
        symbol: 'BTC', 
        name: 'Bitcoin', 
        network: 'Bitcoin', 
        address: 'WpEZ73CNmQviecrnyiWrnqRhWNLy',
        icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
    },
    { 
        id: 'ethereum', 
        symbol: 'ETH', 
        name: 'Ethereum', 
        network: 'ERC20', 
        address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
    },
    { 
        id: 'solana', 
        symbol: 'SOL', 
        name: 'Solana', 
        network: 'Solana', 
        address: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrp',
        icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
    },
    { 
        id: 'tether', 
        symbol: 'USDT', 
        name: 'Tether', 
        network: 'TRC20', 
        address: 'T9yD14Nj9j7xAB4dbGeiX9h8luTaKxekyh',
        icon: 'https://assets.coingecko.com/coins/images/325/large/tether.png'
    }
];

export default function DepositPage() {
  const [selectedCoin, setSelectedCoin] = useState(SUPPORTED_COINS[0]);
  const [showCoinSelector, setShowCoinSelector] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedCoin.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectCoin = (coin: typeof SUPPORTED_COINS[0]) => {
      setSelectedCoin(coin);
      setShowCoinSelector(false);
  };

  return (
    <div className="min-h-screen bg-dash-bg font-outfit text-white pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 sm:p-6 lg:p-8">
        <Link href="/dashboard/wallets" className="p-2 -ml-2 text-text-muted hover:text-white transition-colors">
            <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Deposit</h1>
      </div>

      {/* Main Container */}
      <div className="max-w-md mx-auto px-4">
        
        {/* Coin Header / Selector */}
        <div className="relative mb-8 z-20">
            <button 
                onClick={() => setShowCoinSelector(!showCoinSelector)}
                className="w-full flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative overflow-hidden">
                        <Image src={selectedCoin.icon} alt={selectedCoin.symbol} fill className="object-contain p-1.5" />
                    </div>
                    <div className="text-left">
                        <h2 className="font-bold text-lg leading-none">{selectedCoin.symbol}</h2>
                        <p className="text-text-muted text-xs font-medium">{selectedCoin.name}</p>
                    </div>
                </div>
                <div className="p-2 text-text-muted hover:text-white transition-colors">
                    <ChevronDown size={20} className={`transition-transform duration-300 ${showCoinSelector ? 'rotate-180' : ''}`} />
                </div>
            </button>
            
            {/* Dropdown */}
            <AnimatePresence>
                {showCoinSelector && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#141822] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-30"
                    >
                        {SUPPORTED_COINS.map((coin) => (
                            <button
                                key={coin.id}
                                onClick={() => handleSelectCoin(coin)}
                                className={`w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors ${selectedCoin.id === coin.id ? 'bg-white/5' : ''}`}
                            >
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative overflow-hidden">
                                     <Image src={coin.icon} alt={coin.symbol} fill className="object-contain p-1" />
                                </div>
                                <div className="text-left">
                                    <span className="font-bold text-sm block">{coin.symbol}</span>
                                    <span className="text-xs text-text-muted">{coin.name}</span>
                                </div>
                                {selectedCoin.id === coin.id && <Check size={16} className="ml-auto text-dash-accent" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Content */}
        <motion.div 
            key={selectedCoin.id} // Animate on coin change
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Network Selector (Visual) */}
            <div className="space-y-2">
                <label className="text-xs text-text-muted font-bold ml-1">Network</label>
                <div className="w-full flex items-center justify-between bg-[#141822] rounded-xl p-4 border border-white/5">
                    <span className="font-bold text-sm">{selectedCoin.network}</span>
                    <div className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-text-muted font-bold uppercase tracking-wider border border-white/5">
                        Default
                    </div>
                </div>
            </div>

            {/* Address Display */}
            <div className="space-y-2">
                <label className="text-xs text-text-muted font-bold ml-1">Deposit Address</label>
                <div className="w-full flex items-center justify-between bg-[#141822] rounded-xl p-4 border border-white/5 group">
                    <p className="font-mono text-sm text-white/80 truncate pr-4">{selectedCoin.address}</p>
                    <button 
                        onClick={handleCopy}
                        className="text-text-muted hover:text-white transition-colors relative"
                    >
                        {copied ? <Check size={18} className="text-[#00C896]" /> : <Copy size={18} />}
                    </button>
                </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-3xl mx-auto w-64 h-64 flex items-center justify-center relative shadow-lg shadow-white/5 mt-4">
                {/* Visual QR Code Generator based on coin ID/address (simulated visual difference) */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                    {/* Basic QR pattern */}
                    <path d="M0 0h24v24H0V0zm6 6v12h12V6H6zm24 0h24v24H30V0zm6 6v12h12V6H36zM0 30h24v24H0V30zm6 6v12h12V36H6zm24 6h6v6h-6v-6zm6 6h6v6h-6v-6zm-6 6h6v6h-6v-6zm12-12h6v6h-6v-6zm6 6h6v6h-6v-6zm-6 6h6v6h-6v-6zM60 0h24v24H60V0zm6 6v12h12V6H66zm24 30h-6v6h6v-6zm-6 6h-6v6h6v-6zM0 60h24v24H0V60zm6 6v12h12V66H6zm30 0h6v6h-6v-6zm6 6h6v6h-6v-6zm-6 6h6v6h-6v-6zm12-12h6v6h-6v-6zm6 6h6v6h-6v-6zm-6 6h6v6h-6v-6zM60 60h24v24H60V60zm6 6v12h12V66H66z" />
                    {/* Randomize inner bits based on coin ID length to "simulate" different QR */}
                    {selectedCoin.id.length % 2 === 0 && <rect x="35" y="35" width="10" height="10" />}
                    {selectedCoin.id.length % 3 === 0 && <rect x="55" y="55" width="10" height="10" />}
                    {selectedCoin.symbol === 'ETH' && <rect x="20" y="70" width="10" height="10" />}
                    {selectedCoin.symbol === 'BTC' && <rect x="70" y="20" width="10" height="10" />}
                    {selectedCoin.symbol === 'SOL' && <rect x="45" y="45" width="10" height="10" />}
                    </svg>
            </div>
            
            <p className="text-center text-xs text-text-muted max-w-[200px] mx-auto leading-relaxed">
                Send only <span className="text-white font-bold">{selectedCoin.name} ({selectedCoin.network})</span> to this address.
            </p>

            {/* Action */}
            <button className="w-full py-4 bg-[#00C896] text-black font-bold rounded-2xl hover:bg-[#00b084] transition-all active:scale-[0.98] shadow-lg shadow-[#00C896]/20 flex items-center justify-center gap-2 mt-4">
                <Download size={18} strokeWidth={2.5} />
                Save QR Code
            </button>
        </motion.div>

      </div>
    </div>
  );
}
