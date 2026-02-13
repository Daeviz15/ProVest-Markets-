"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, RefreshCw, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getTopCoins, CoinMarketData } from '@/lib/crypto';
import { useBalance } from '../context/BalanceContext';
import { useNotification } from '../context/NotificationContext';
import { supabase } from '@/lib/supabase';
import { useUser } from '../context/UserContext';
import { useLoading } from '../context/LoadingContext';

export default function QuickTrade() {
  const [side, setSide] = useState('buy');
  const [coins, setCoins] = useState<CoinMarketData[]>([]);
  const [spendCoin, setSpendCoin] = useState<CoinMarketData | null>(null);
  const [receiveCoin, setReceiveCoin] = useState<CoinMarketData | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { getSymbolBalance, refreshBalances, totalUsdBalance } = useBalance();
  const { addNotification } = useNotification();
  const { user } = useUser();
  const { setIsLoading } = useLoading();

  const currentBalance = side === 'buy' ? totalUsdBalance : (spendCoin ? getSymbolBalance(spendCoin.symbol) : 0);

  useEffect(() => {
    const loadCoins = async () => {
      try {
        const topCoins = await getTopCoins(20);
        setCoins(topCoins);
        // Default to USDT or first coin for spend, BTC/ETH for receive
        const usdt = topCoins.find(c => c.symbol.toLowerCase() === 'usdt') || topCoins[0];
        const btc = topCoins.find(c => c.symbol.toLowerCase() === 'btc') || topCoins[1];
        setSpendCoin(usdt);
        setReceiveCoin(btc);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCoins();
  }, []);

  const receiveAmount = (spendCoin && receiveCoin && amount && !isNaN(parseFloat(amount))) 
    ? (parseFloat(amount) * spendCoin.current_price / receiveCoin.current_price).toFixed(6)
    : '0';

  const handleExecute = async () => {
    const spendAmount = parseFloat(amount);
    if (!spendAmount || isNaN(spendAmount) || !spendCoin || !receiveCoin || !user) return;

    if (spendAmount > currentBalance) {
      addNotification(`Insufficient ${spendCoin.symbol.toUpperCase()} balance.`, 'error');
      return;
    }

    setIsLoading(true, `Executing Quick ${side.toUpperCase()} Order`);

    try {
        const receiveAmountNum = parseFloat(receiveAmount);
        
        // 1. Update/Add balances
        // For QuickTrade, we always assume the 'quote' is the spend coin if selling, or quote is what we spend if buying
        // Actually, let's keep it simple: swap balances directly
        
        const { data: spendWallet } = await supabase.from('wallets').select('*').eq('user_id', user.id).eq('coin_symbol', spendCoin.symbol.toLowerCase()).single();
        const { data: receiveWallet } = await supabase.from('wallets').select('*').eq('user_id', user.id).eq('coin_symbol', receiveCoin.symbol.toLowerCase()).single();

        // Deduct from spend
        await supabase.from('wallets').update({ balance: (spendWallet?.balance || 0) - spendAmount }).eq('user_id', user.id).eq('coin_symbol', spendCoin.symbol.toLowerCase());
        
        // Add to receive
        if (receiveWallet) {
            await supabase.from('wallets').update({ balance: receiveWallet.balance + receiveAmountNum }).eq('user_id', user.id).eq('coin_symbol', receiveCoin.symbol.toLowerCase());
        } else {
            await supabase.from('wallets').insert({ user_id: user.id, coin_symbol: receiveCoin.symbol.toLowerCase(), balance: receiveAmountNum });
        }

        // 2. Log Trade
        await supabase.from('trades').insert({
            user_id: user.id,
            coin_symbol: receiveCoin.symbol.toLowerCase(),
            coin_name: receiveCoin.name,
            type: side as 'buy' | 'sell',
            amount_usd: side === 'buy' ? spendAmount : receiveAmountNum * receiveCoin.current_price, // roughly
            amount_coin: receiveAmountNum,
            price_at_execution: receiveCoin.current_price
        });

        await refreshBalances();
        addNotification(`Quick ${side.toUpperCase()} executed successfully!`, 'success');
        setAmount('');
    } catch (error) {
        console.error('Quick Trade execution failed:', error);
        addNotification('Execution failed. Please try again.', 'error');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0C101A] rounded-[32px] p-8 h-full shadow-2xl">
      <h3 className="text-lg font-bold text-white mb-6 font-outfit tracking-tight">Make Quick Trades</h3>
      
      {/* Buy/Sell Toggle */}
      <div className="flex bg-[#141822]/80 backdrop-blur-md p-1 rounded-xl mb-8 shadow-inner">
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
                <span>{side === 'buy' ? 'Spend' : 'Sell'}</span>
                <div className="flex items-center gap-2">
                    <span>Balance: {side === 'buy' ? '$' : ''}{currentBalance.toLocaleString(undefined, { maximumFractionDigits: side === 'buy' ? 2 : 6 })}</span>
                    <Link href="/dashboard/wallets" className="text-dash-accent hover:text-white flex items-center gap-0.5 transition-colors">
                        Portfolio <ArrowUpRight size={10} />
                    </Link>
                </div>
            </div>
            <div className="relative group">
                <input 
                    type="number" 
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#141822]/50 rounded-xl py-4 pl-4 pr-32 text-white font-outfit outline-none focus:bg-[#141822]/80 transition-all shadow-inner"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    {spendCoin && (
                        <>
                            <div className="relative w-[18px] h-[18px]">
                                <Image src={spendCoin.image} fill alt={spendCoin.name} className="object-contain" />
                            </div>
                            <span className="text-xs font-bold text-white uppercase">{spendCoin.symbol}</span>
                            <ChevronDown size={14} className="text-text-muted" />
                        </>
                    )}
                </div>
            </div>
        </div>

        {/* Swap Icon */}
        <div className="flex justify-center -my-2 relative z-10">
            <button 
                onClick={() => {
                    const temp = spendCoin;
                    setSpendCoin(receiveCoin);
                    setReceiveCoin(temp);
                }}
                className="w-10 h-10 bg-dash-bg border border-dash-border rounded-full flex items-center justify-center text-dash-accent hover:rotate-180 transition-transform duration-500 shadow-xl"
            >
                <RefreshCw size={18} />
            </button>
        </div>

        {/* Receive */}
        <div className="space-y-2">
            <div className="text-[11px] text-text-muted uppercase font-space tracking-wider px-1">
                {side === 'buy' ? 'Receive' : 'For'}
            </div>
            <div className="relative group">
                <input 
                    type="number" 
                    placeholder="0"
                    value={receiveAmount}
                    readOnly
                    className="w-full bg-[#141822]/50 rounded-xl py-4 pl-4 pr-32 text-white font-outfit outline-none transition-all shadow-inner"
                />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                   {receiveCoin && (
                        <>
                            <div className="relative w-[18px] h-[18px]">
                                <Image src={receiveCoin.image} fill alt={receiveCoin.name} className="object-contain" />
                            </div>
                            <span className="text-xs font-bold text-white uppercase">{receiveCoin.symbol}</span>
                            <ChevronDown size={14} className="text-text-muted" />
                        </>
                    )}
                </div>
            </div>
        </div>

        <button 
            disabled={!amount || loading}
            onClick={handleExecute}
            className={`w-full py-4 rounded-2xl font-bold text-[15px] transition-all transform active:scale-95 shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed ${
            side === 'buy' ? 'bg-dash-accent text-bg-primary hover:bg-white' : 'bg-dash-error text-bg-primary hover:bg-white'
        }`}>
            {loading ? 'Refreshing...' : side === 'buy' ? 'Execute Buy Order' : 'Execute Sell Order'}
        </button>
      </div>
    </div>
  );
}
