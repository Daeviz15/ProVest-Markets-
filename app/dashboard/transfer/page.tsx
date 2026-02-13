"use client";

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  ArrowLeft, 
  ChevronDown, 
  Search, 
  AlertCircle,
  Clock,
  CheckCircle2,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useBalance } from '../context/BalanceContext';
import { useNotification } from '../context/NotificationContext';
import { useUser } from '../context/UserContext';
import { useLoading } from '../context/LoadingContext';
import { supabase } from '@/lib/supabase';
import { getTopCoins, CoinMarketData } from '@/lib/crypto';

export default function TransferPage() {
  const { user } = useUser();
  const { balances, getSymbolBalance, refreshBalances } = useBalance();
  const { addNotification } = useNotification();
  const { setIsLoading } = useLoading();

  const [coins, setCoins] = useState<CoinMarketData[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinMarketData | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAssets, setShowAssets] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentCoinBalance = selectedCoin ? getSymbolBalance(selectedCoin.symbol) : 0;

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const data = await getTopCoins(50);
        setCoins(data);
        // Default to USDT or BTC
        const defaultCoin = data.find(c => c.symbol.toLowerCase() === 'usdt') || data[0];
        setSelectedCoin(defaultCoin);
      } catch (error) {
        console.error("Failed to load assets", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const handleTransfer = async () => {
    if (!user || !selectedCoin || !recipient || !amount) {
      addNotification('Please fill in all fields', 'error');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      addNotification('Enter a valid amount', 'error');
      return;
    }

    if (transferAmount > currentCoinBalance) {
      addNotification(`Insufficient ${selectedCoin.symbol.toUpperCase()} balance`, 'error');
      return;
    }

    if (recipient.toLowerCase() === user.email?.toLowerCase()) {
      addNotification("You can't transfer to yourself", 'error');
      return;
    }

    setIsLoading(true, 'Processing Transfer...');

    try {
      // 1. Check if recipient exists (Internal Transfer)
      const { data: recipientUser, error: recipientError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('email', recipient.toLowerCase())
        .single();

      // For this implementation, we simulate external if not found internal
      // But we focus on the logic for the sender deduction
      
      const { data: senderWallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('coin_symbol', selectedCoin.symbol.toLowerCase())
        .single();

      if (!senderWallet || senderWallet.balance < transferAmount) {
         throw new Error('Verification failed: Insufficient balance');
      }

      // Deduct from sender
      const { error: deductError } = await supabase
        .from('wallets')
        .update({ balance: senderWallet.balance - transferAmount })
        .eq('user_id', user.id)
        .eq('coin_symbol', selectedCoin.symbol.toLowerCase());

      if (deductError) throw deductError;

      // If recipient is internal, add to them
      if (recipientUser) {
        const { data: recWallet } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', recipientUser.id)
          .eq('coin_symbol', selectedCoin.symbol.toLowerCase())
          .single();

        if (recWallet) {
           await supabase
            .from('wallets')
            .update({ balance: recWallet.balance + transferAmount })
            .eq('user_id', recipientUser.id)
            .eq('coin_symbol', selectedCoin.symbol.toLowerCase());
        } else {
           await supabase
            .from('wallets')
            .insert({ 
               user_id: recipientUser.id, 
               coin_symbol: selectedCoin.symbol.toLowerCase(), 
               balance: transferAmount 
            });
        }
      }

      // 2. Log Transfer
      await supabase.from('transfers').insert({
        sender_id: user.id,
        recipient_email: recipient.toLowerCase(),
        coin_symbol: selectedCoin.symbol.toLowerCase(),
        amount: transferAmount,
        type: recipientUser ? 'internal' : 'external',
        status: 'completed'
      });

      await refreshBalances();
      addNotification(`Transfer of ${transferAmount} ${selectedCoin.symbol.toUpperCase()} successful!`, 'success');
      setAmount('');
      setRecipient('');
    } catch (error: any) {
      console.error('Transfer failed:', error);
      addNotification(error.message || 'Transfer failed. Check recipient details.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto pb-20 font-outfit px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sm:mb-12 pt-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/wallets">
            <button className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Transfer Assets</h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-dash-accent/10 border border-dash-accent/20 rounded-full">
            <ShieldCheck size={16} className="text-dash-accent" />
            <span className="text-xs font-bold text-dash-accent uppercase tracking-widest">Secure Internal Transfer</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0C101A] rounded-[32px] p-6 sm:p-10 border border-white/5 shadow-2xl space-y-8 relative">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-dash-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            {/* Step 1: Asset Selection (Horizontal Scroll) */}
            <div className="space-y-6 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
                <div className="space-y-3 flex-1">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">1. Select Asset</label>
                    <div className="relative w-full sm:max-w-xs group">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-dash-accent transition-colors" />
                        <input 
                            type="text"
                            placeholder="Search coins..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#141822] border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-dash-accent/30 transition-all font-outfit"
                        />
                    </div>
                </div>
                <div className="text-[10px] font-bold text-dash-accent/60 uppercase tracking-widest bg-dash-accent/5 px-2 py-1 rounded-md self-start sm:self-auto">
                    Balance: <span className="text-white font-mono">{currentCoinBalance.toFixed(6)}</span> {selectedCoin?.symbol.toUpperCase()}
                </div>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-4 pt-1 no-scrollbar -mx-2 px-2 mask-fade-edges min-h-[140px]">
                {filteredCoins.length > 0 ? (
                  filteredCoins.map(coin => (
                  <motion.button
                    key={coin.id}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCoin(coin)}
                    className={`flex-shrink-0 min-w-[100px] p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${
                      selectedCoin?.id === coin.id 
                        ? 'bg-dash-accent/10 border-dash-accent shadow-lg shadow-dash-accent/10' 
                        : 'bg-[#141822] border-white/5 hover:border-white/20'
                    }`}
                  >
                    {selectedCoin?.id === coin.id && (
                        <motion.div 
                            layoutId="active-bg"
                            className="absolute inset-0 bg-gradient-to-br from-dash-accent/5 to-transparent"
                        />
                    )}
                    <div className="w-10 h-10 relative z-10">
                      <Image src={coin.image} alt={coin.name} fill className="object-contain filter grayscale-[0.3] group-hover:grayscale-0 transition-all" />
                    </div>
                    <div className="text-center z-10">
                      <div className={`text-xs font-black uppercase tracking-widest ${selectedCoin?.id === coin.id ? 'text-dash-accent' : 'text-white/60'}`}>
                        {coin.symbol}
                      </div>
                      <div className="text-[9px] text-text-muted font-bold mt-0.5 truncate max-w-[70px]">
                        ${coin.current_price.toLocaleString()}
                      </div>
                    </div>
                  </motion.button>
                ))
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-6 text-center border-2 border-dashed border-white/5 rounded-2xl min-w-[300px]">
                      <Search size={20} className="text-text-muted mb-2" />
                      <p className="text-xs font-bold text-white">No assets found</p>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-[10px] text-dash-accent font-bold mt-1 hover:underline"
                      >
                        Clear search
                      </button>
                  </div>
              )}
              </div>
            </div>

            {/* Step 2: Recipient */}
            <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">2. Recipient</label>
                    <span className="text-[10px] text-dash-accent/60 font-medium flex items-center gap-1"><AlertCircle size={10} /> Enter Email or Address</span>
                </div>
                <div className="relative group">
                    <input 
                        type="text" 
                        placeholder="recipient@example.com or 0x..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full bg-[#141822] border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-dash-accent/40 focus:bg-white/[0.04] transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/5 rounded-lg text-text-muted hover:text-white cursor-pointer transition-colors">
                        <QrCode size={18} />
                    </div>
                </div>
            </div>

            {/* Step 3: Amount */}
            <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">3. Amount</label>
                    <button 
                        onClick={() => setAmount(currentCoinBalance.toString())}
                        className="text-[10px] px-2 py-1 bg-dash-accent/10 text-dash-accent rounded-md font-bold hover:bg-dash-accent hover:text-bg-primary transition-all uppercase tracking-wider"
                    >
                        Max
                    </button>
                </div>
                <div className="relative group">
                    <input 
                        type="number" 
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-[#141822] border border-white/5 rounded-2xl py-5 px-6 text-2xl font-bold text-white outline-none focus:border-dash-accent/40 focus:bg-white/[0.04] transition-all font-mono"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className="text-sm font-bold text-text-muted uppercase tracking-widest">{selectedCoin?.symbol}</span>
                    </div>
                </div>
                {selectedCoin && (
                    <div className="flex justify-between items-center text-[11px] font-medium px-1">
                        <span className="text-text-muted">Estimated Fee: <span className="text-white font-mono">0.00 {selectedCoin.symbol.toUpperCase()}</span></span>
                        <span className="text-text-muted">Approx. USD: <span className="text-dash-accent font-mono">${(parseFloat(amount || '0') * selectedCoin.current_price).toLocaleString()}</span></span>
                    </div>
                )}
            </div>

            {/* Action Button */}
            <button 
                onClick={handleTransfer}
                className="w-full relative group overflow-hidden bg-dash-accent py-5 rounded-2xl font-black text-bg-primary uppercase tracking-[0.25em] text-sm shadow-xl shadow-dash-accent/20 active:scale-[0.98] transition-all"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                    <Send size={18} />
                    Execute Transfer
                </span>
            </button>
          </div>
        </div>

        {/* Right Column: Info & History */}
        <div className="lg:col-span-5 space-y-8">
            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-dash-accent/10 to-transparent border border-dash-accent/10 rounded-3xl p-8 space-y-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-3">
                    <CheckCircle2 size={22} className="text-dash-accent" />
                    Security Notice
                </h4>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-dash-accent shrink-0" />
                        <p className="text-sm text-text-muted leading-relaxed">External wallet transfers are irreversible once confirmed. Please double check the address.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-dash-accent shrink-0" />
                        <p className="text-sm text-text-muted leading-relaxed">Internal transfers between ProvestMarkets accounts are instant and free of network fees.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-dash-accent shrink-0" />
                        <p className="text-sm text-text-muted leading-relaxed">Multi-factor authentication may be required for high-volume transactions.</p>
                    </div>
                </div>
            </div>

            {/* Transfer Stats (Placeholder for recent) */}
            <div className="bg-[#141822]/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 space-y-6">
                 <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white flex items-center gap-2">
                        <Clock size={18} className="text-text-muted" />
                        Recent Transfers
                    </h4>
                    <button className="text-[10px] font-bold text-dash-accent uppercase tracking-wider hover:text-white transition-colors">View All</button>
                 </div>
                 
                 <div className="space-y-4">
                     <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4 border-2 border-dashed border-white/5 rounded-2xl">
                         <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-text-muted">
                             <Clock size={24} />
                         </div>
                         <div>
                             <p className="text-sm font-bold text-white">No Recent Transfers</p>
                             <p className="text-xs text-text-muted mt-1">Your transaction history will appear here once you execute a transfer.</p>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
