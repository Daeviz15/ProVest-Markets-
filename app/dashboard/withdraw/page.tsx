"use client";

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  Check, 
  Send,
  Scan,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

// Mock data (shared with Deposit for consistency)
const SUPPORTED_COINS = [
    { 
        id: 'bitcoin', 
        symbol: 'BTC', 
        name: 'Bitcoin', 
        network: 'Bitcoin', 
        balance: 0.00,
        price: 48250.00,
        icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
    },
    { 
        id: 'ethereum', 
        symbol: 'ETH', 
        name: 'Ethereum', 
        network: 'ERC20', 
        balance: 0.00,
        price: 2850.50,
        icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
    },
    { 
        id: 'solana', 
        symbol: 'SOL', 
        name: 'Solana', 
        network: 'Solana', 
        balance: 0.00,
        price: 98.75,
        icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
    },
    { 
        id: 'tether', 
        symbol: 'USDT', 
        name: 'Tether', 
        network: 'TRC20', 
        balance: 0.00,
        price: 1.00,
        icon: 'https://assets.coingecko.com/coins/images/325/large/tether.png'
    }
];

export default function WithdrawPage() {
  const [selectedCoin, setSelectedCoin] = useState(SUPPORTED_COINS[0]);
  const [showCoinSelector, setShowCoinSelector] = useState(false);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectCoin = (coin: typeof SUPPORTED_COINS[0]) => {
      setSelectedCoin(coin);
      setShowCoinSelector(false);
      setAmount(''); // Reset amount on change
  };

  const handleMax = () => {
    setAmount(selectedCoin.balance.toString());
  };

  const handlePaste = async () => {
      try {
          const text = await navigator.clipboard.readText();
          setAddress(text);
      } catch (err) {
          console.error('Failed to read clipboard', err);
      }
  };

  const usdValue = amount && !isNaN(parseFloat(amount)) 
    ? (parseFloat(amount) * selectedCoin.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

  const networkFee = 0.00005; // Dummy fixed fee
  const totalDeduction = amount && !isNaN(parseFloat(amount)) ? parseFloat(amount) + networkFee : 0;

  return (
    <div className="min-h-screen bg-dash-bg font-outfit text-white pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 sm:p-6 lg:p-8">
        <Link href="/dashboard/wallets" className="p-2 -ml-2 text-text-muted hover:text-white transition-colors">
            <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Withdraw Assets</h1>
      </div>

      {/* Main Container */}
      <div className="max-w-md mx-auto px-4">
        
        {/* Coin Selector */}
        <div className="space-y-2 mb-6 relative z-30">
            <label className="text-xs text-text-muted font-bold ml-1 uppercase tracking-wider">Select Asset</label>
            <button 
                onClick={() => setShowCoinSelector(!showCoinSelector)}
                className="w-full flex items-center justify-between bg-[#141822] rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative overflow-hidden">
                        <Image src={selectedCoin.icon} alt={selectedCoin.symbol} fill className="object-contain p-1" />
                    </div>
                    <div className="text-left">
                        <span className="font-bold text-sm block">{selectedCoin.symbol}</span>
                        <span className="text-xs text-text-muted">{selectedCoin.name}</span>
                    </div>
                </div>
                <ChevronDown size={16} className={`text-text-muted transition-transform duration-300 ${showCoinSelector ? 'rotate-180' : ''}`} />
            </button>

             {/* Dropdown */}
             <AnimatePresence>
                {showCoinSelector && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#141822] border border-white/10 rounded-2xl shadow-xl overflow-hidden"
                    >
                        {SUPPORTED_COINS.map((coin) => (
                            <button
                                key={coin.id}
                                onClick={() => handleSelectCoin(coin)}
                                className={`w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors ${selectedCoin.id === coin.id ? 'bg-white/5' : ''}`}
                            >
                                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative overflow-hidden">
                                     <Image src={coin.icon} alt={coin.symbol} fill className="object-contain p-0.5" />
                                </div>
                                <div className="text-left">
                                    <span className="font-bold text-sm block">{coin.symbol}</span>
                                    <span className="text-xs text-text-muted">Balance: {coin.balance}</span>
                                </div>
                                {selectedCoin.id === coin.id && <Check size={16} className="ml-auto text-dash-accent" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Address Input */}
        <div className="space-y-2 mb-6">
            <label className="text-xs text-text-muted font-bold ml-1 uppercase tracking-wider">Recipient Address</label>
            <div className="relative group">
                <input 
                    type="text" 
                    placeholder={`Enter ${selectedCoin.symbol} Address`}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#141822] rounded-xl py-4 pl-4 pr-20 text-white font-mono text-sm outline-none border border-white/5 focus:border-dash-accent/50 transition-all placeholder:text-text-muted/40"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button 
                        onClick={handlePaste}
                        className="px-2 py-1.5 rounded-lg bg-white/5 text-[10px] font-bold text-dash-accent hover:bg-dash-accent hover:text-black transition-colors"
                    >
                        PASTE
                    </button>
                    <button className="p-2 text-text-muted hover:text-white transition-colors">
                        <Scan size={16} />
                    </button>
                </div>
            </div>
            {address && address.length < 20 && (
                 <div className="flex items-center gap-2 text-dash-error text-xs mt-1 ml-1">
                    <AlertCircle size={12} />
                    <span>Invalid address format</span>
                 </div>
            )}
        </div>

        {/* Amount Input */}
        <div className="space-y-2 mb-8">
            <div className="flex justify-between items-center px-1">
                <label className="text-xs text-text-muted font-bold uppercase tracking-wider">Amount</label>
                <div className="text-[10px] text-text-muted">
                    Available: <span className="text-white font-bold">{selectedCoin.balance} {selectedCoin.symbol}</span>
                </div>
            </div>
            
            <div className="relative">
                <input 
                    type="number" 
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#141822] rounded-xl py-4 pl-4 pr-16 text-white font-bold text-lg outline-none border border-white/5 focus:border-dash-accent/50 transition-all placeholder:text-text-muted/40"
                />
                <button 
                    onClick={handleMax}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-dash-accent hover:text-white transition-colors"
                >
                    MAX
                </button>
            </div>
            <div className="px-1 flex justify-between items-center">
                 <p className="text-xs text-text-muted">≈ ${usdValue}</p>
                 {parseFloat(amount || '0') > selectedCoin.balance && (
                     <p className="text-xs text-dash-error font-bold">Insufficient balance</p>
                 )}
            </div>
        </div>

        {/* Summary Card */}
        <div className="bg-[#141822]/50 rounded-2xl p-4 border border-white/5 space-y-3 mb-8">
            <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">Network Fee</span>
                <span className="text-white font-mono">{networkFee} {selectedCoin.symbol}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">Network</span>
                <span className="text-white font-bold">{selectedCoin.network}</span>
            </div>
            <div className="h-px bg-white/5 my-2" />
            <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-text-muted">Total</span>
                <span className="text-white">{totalDeduction.toFixed(6)} {selectedCoin.symbol}</span>
            </div>
        </div>

        {/* Action Button */}
        <button 
            disabled={!address || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > selectedCoin.balance}
            className="w-full py-4 bg-dash-accent text-bg-primary font-bold rounded-2xl hover:bg-white transition-all active:scale-[0.98] shadow-lg shadow-dash-accent/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            <Send size={18} strokeWidth={2.5} />
            Withdraw {selectedCoin.symbol}
        </button>

      </div>
    </div>
  );
}
