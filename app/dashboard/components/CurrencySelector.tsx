"use client";

import React, { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import { supabase } from '@/lib/supabase';
import { useBalance } from '../context/BalanceContext';

const currencies = [
  { code: 'usd', label: 'US Dollar', symbol: '$' },
  { code: 'eur', label: 'Euro', symbol: '€' },
  { code: 'gbp', label: 'British Pound', symbol: '£' },
  { code: 'jpy', label: 'Japanese Yen', symbol: '¥' },
  { code: 'ngn', label: 'Nigerian Naira', symbol: '₦' },
  { code: 'inr', label: 'Indian Rupee', symbol: '₹' },
  { code: 'aed', label: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'ars', label: 'Argentine Peso', symbol: '$' },
  { code: 'aud', label: 'Australian Dollar', symbol: 'A$' },
  { code: 'bdt', label: 'Bangladeshi Taka', symbol: '৳' },
  { code: 'bhd', label: 'Bahraini Dinar', symbol: '.د.ب' },
  { code: 'bmd', label: 'Bermudian Dollar', symbol: '$' },
  { code: 'brl', label: 'Brazilian Real', symbol: 'R$' },
  { code: 'cad', label: 'Canadian Dollar', symbol: 'C$' },
  { code: 'chf', label: 'Swiss Franc', symbol: 'Fr.' },
  { code: 'clp', label: 'Chilean Peso', symbol: '$' },
  { code: 'cny', label: 'Chinese Yuan', symbol: '¥' },
  { code: 'czk', label: 'Czech Koruna', symbol: 'Kč' },
  { code: 'dkk', label: 'Danish Krone', symbol: 'kr' },
  { code: 'gel', label: 'Georgian Lari', symbol: '₾' },
  { code: 'hkd', label: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'huf', label: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'idr', label: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'ils', label: 'Israeli Shekel', symbol: '₪' },
  { code: 'krw', label: 'South Korean Won', symbol: '₩' },
  { code: 'kwd', label: 'Kuwaiti Dinar', symbol: 'د.ك' },
  { code: 'lkr', label: 'Sri Lankan Rupee', symbol: 'Rs' },
  { code: 'mmk', label: 'Burmese Kyat', symbol: 'K' },
  { code: 'mxn', label: 'Mexican Peso', symbol: '$' },
  { code: 'myr', label: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'nok', label: 'Norwegian Krone', symbol: 'kr' },
  { code: 'nzd', label: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'php', label: 'Philippine Peso', symbol: '₱' },
  { code: 'pkr', label: 'Pakistani Rupee', symbol: 'Rs' },
  { code: 'pln', label: 'Polish Zloty', symbol: 'zł' },
  { code: 'rub', label: 'Russian Ruble', symbol: '₽' },
  { code: 'sar', label: 'Saudi Riyal', symbol: 'ر.س' },
  { code: 'sek', label: 'Swedish Krona', symbol: 'kr' },
  { code: 'sgd', label: 'Singapore Dollar', symbol: 'S$' },
  { code: 'thb', label: 'Thai Baht', symbol: '฿' },
  { code: 'try', label: 'Turkish Lira', symbol: '₺' },
  { code: 'twd', label: 'Taiwan Dollar', symbol: 'NT$' },
  { code: 'uah', label: 'Ukrainian Hryvnia', symbol: '₴' },
  { code: 'vef', label: 'Venezuelan Bolívar', symbol: 'Bs' },
  { code: 'vnd', label: 'Vietnamese Dong', symbol: '₫' },
  { code: 'zar', label: 'South African Rand', symbol: 'R' },
];

export default function CurrencySelector() {
  const { profile, user, fetchUser } = useUser();
  const { refreshBalances } = useBalance();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentCurrency = profile?.preferred_currency || 'usd';

  const handleSelect = async (code: string) => {
    if (code === currentCurrency || !user || isUpdating) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ preferred_currency: code })
        .eq('id', user.id);

      if (error) throw error;
      
      await fetchUser(); // Update context
      await refreshBalances(); // Refresh prices in new currency
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to update currency:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-bold text-white uppercase tracking-wider"
      >
        <Globe size={14} className="text-dash-accent" />
        {currentCurrency}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-56 bg-[#0C101A] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Select Currency</span>
            </div>
            <div className="p-1 max-h-[300px] overflow-y-auto custom-scrollbar">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => handleSelect(curr.code)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                    currentCurrency === curr.code ? 'bg-dash-accent/10 border border-dash-accent/20' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white uppercase font-mono">{curr.code}</span>
                    <span className="text-[10px] text-text-muted font-medium">{curr.label}</span>
                  </div>
                  {currentCurrency === curr.code ? (
                    <Check size={14} className="text-dash-accent" />
                  ) : (
                    <span className="text-xs font-bold text-white/20 group-hover:text-white/40">{curr.symbol}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="p-2 bg-white/[0.02] border-t border-white/5 text-[10px] text-center text-text-muted italic">
              Prices estimated via CoinGecko
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
