"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Wallet, TrendingUp, Clock,
  X, Plus, Minus, Replace, Search,
  ChevronLeft, ChevronRight, DollarSign, Coins, ChevronDown, RefreshCw, Signal, Globe
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import {
  getAdminUsers, getUserWallets, getUserPortfolioValue, getAdminMarketData, updateUserBalance, updatePortfolioBalance, getAdminStats, updateUserSignalStrength, updateUserCurrency,
  type AdminUser, type UserWallet, type AdminStats,
} from '../actions';

// ============================================
// Stat Card
// ============================================
function StatCard({ icon: Icon, label, value, accent }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="bg-[#0C101A] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon size={16} />
        </div>
      </div>
      <span className="text-2xl font-bold text-white font-mono">{value}</span>
    </div>
  );
}

// ============================================
// Pagination Controls
// ============================================
function Pagination({
  page, totalPages, total, pageSize, onPageChange
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06]">
      <span className="text-xs text-text-muted">
        Showing <strong className="text-white">{from}–{to}</strong> of <strong className="text-white">{total}</strong> users
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
            if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('ellipsis');
            acc.push(p);
            return acc;
          }, [])
          .map((item, i) =>
            item === 'ellipsis' ? (
              <span key={`e-${i}`} className="px-2 text-xs text-text-muted">…</span>
            ) : (
              <button
                key={item}
                onClick={() => onPageChange(item as number)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  page === item
                    ? 'bg-dash-accent/10 text-dash-accent border border-dash-accent/20'
                    : 'text-text-muted hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item}
              </button>
            )
          )
        }
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

const fiatCurrencies = [
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

// ============================================
// Balance Modal — Tabbed (Portfolio + Coins)
// ============================================
function BalanceModal({
  user, wallets, loading, onClose, onRefresh
}: {
  user: AdminUser;
  wallets: UserWallet[];
  loading: boolean;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'coins'>('portfolio');
  const [action, setAction] = useState<'set' | 'add' | 'subtract'>('add');
  const [coinSymbol, setCoinSymbol] = useState('');
  const [amount, setAmount] = useState(''); // This will be USD for BOTH tabs now
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [portfolioValue, setPortfolioValue] = useState<number | null>(null);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [signalValue, setSignalValue] = useState(user.signal_strength ?? 0);
  const [signalSaving, setSignalSaving] = useState(false);
  const [userCurrency, setUserCurrency] = useState(user.preferred_currency || 'usd');
  const [currencySaving, setCurrencySaving] = useState(false);

  const handleCurrencyChange = async (val: string) => {
    setUserCurrency(val);
    setCurrencySaving(true);
    const result = await updateUserCurrency(user.id, val);
    if (!result.success) {
      setFeedback({ type: 'error', msg: result.error || 'Failed to update user currency' });
    } else {
      onRefresh(); // Refresh user list to show new currency
    }
    setCurrencySaving(false);
  };

  const handleSignalChange = async (val: number) => {
    setSignalValue(val);
    setSignalSaving(true);
    const result = await updateUserSignalStrength(user.id, val);
    if (!result.success) {
      setFeedback({ type: 'error', msg: result.error || 'Failed to update signal strength' });
    }
    setSignalSaving(false);
  };

  // Fetch real portfolio value and market data for dropdown/conversion
  useEffect(() => {
    const loadModalData = async () => {
      try {
        const [portfolio, markets] = await Promise.all([
          getUserPortfolioValue(user.id),
          getAdminMarketData()
        ]);
        setPortfolioValue(portfolio);
        setMarketData(markets);
        
        // If coinSymbol is empty, initialize it with the first coin from market data
        if (markets.length > 0 && !coinSymbol) {
          setCoinSymbol(markets[0].symbol.toUpperCase());
        }
      } catch (err) {
        console.error("Modal data load error:", err);
        setPortfolioValue(0);
        // Set basic default if everything fails
        setCoinSymbol('BTC');
      }
    };
    loadModalData();
  }, [user.id, coinSymbol]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const portfolio = await getUserPortfolioValue(user.id);
      setPortfolioValue(portfolio);
      onRefresh(); // Refresh wallets in parent
    } finally {
      setTimeout(() => setRefreshing(false), 600); // Small delay for visual feedback
    }
  };

  // Derived: Current price of selected coin
  const selectedCoinData = marketData.find(c => c.symbol.toUpperCase() === coinSymbol.toUpperCase());
  const currentPrice = selectedCoinData?.current_price || 0;
  const convertedCoinAmount = amount && currentPrice ? (parseFloat(amount) / currentPrice) : 0;

  const handlePortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setSubmitting(true);
    setFeedback(null);

    const result = await updatePortfolioBalance(
      user.id,
      parseFloat(amount),
      action,
      note
    );

    if (result.success) {
      setFeedback({ type: 'success', msg: `Portfolio balance ${action === 'set' ? 'set to' : action === 'add' ? 'increased by' : 'decreased by'} $${parseFloat(amount).toLocaleString()}` });
      setAmount('');
      setNote('');
      onRefresh();
    } else {
      setFeedback({ type: 'error', msg: result.error || 'Failed to update balance' });
    }

    setSubmitting(false);
  };

  const handleCoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coinSymbol || !amount || !currentPrice) return;

    setSubmitting(true);
    setFeedback(null);

    // Convert USD to coin units
    const coinAmount = action === 'set' ? convertedCoinAmount : convertedCoinAmount;

    const result = await updateUserBalance(
      user.id,
      coinSymbol.toUpperCase(),
      coinAmount,
      action,
      note
    );

    if (result.success) {
      setFeedback({ 
        type: 'success', 
        msg: `${coinSymbol.toUpperCase()} balance ${action === 'set' ? 'set to' : action === 'add' ? 'increased by' : 'decreased by'} ${coinAmount.toFixed(8)} (${parseFloat(amount).toLocaleString()} USD)` 
      });
      setAmount('');
      setNote('');
      onRefresh();
    } else {
      setFeedback({ type: 'error', msg: result.error || 'Failed to update balance' });
    }

    setSubmitting(false);
  };

  const actionConfig = {
    set: { icon: Replace, label: 'Set', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    add: { icon: Plus, label: 'Add', color: 'text-dash-accent bg-dash-accent/10 border-dash-accent/20' },
    subtract: { icon: Minus, label: 'Subtract', color: 'text-dash-error bg-dash-error/10 border-dash-error/20' },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-[#0C101A] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06] shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">{user.full_name || 'Unnamed User'}</h2>
            <p className="text-xs text-text-muted mt-0.5">{user.email}</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-white rounded-xl hover:bg-white/5 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Signal Strength Control */}
        <div className="px-6 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Signal size={14} className="text-blue-400" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Signal Strength</span>
            </div>
            <span className={`text-sm font-bold font-mono ${
              signalValue >= 70 ? 'text-dash-accent' : signalValue >= 40 ? 'text-yellow-400' : 'text-dash-error'
            }`}>
              {signalValue}%
              {signalSaving && <span className="ml-1 text-[10px] text-text-muted">saving...</span>}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={signalValue}
            onChange={(e) => setSignalValue(Number(e.target.value))}
            onMouseUp={(e) => handleSignalChange(Number((e.target as HTMLInputElement).value))}
            onTouchEnd={(e) => handleSignalChange(Number((e.target as HTMLInputElement).value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${signalValue >= 70 ? '#10b981' : signalValue >= 40 ? '#eab308' : '#ef4444'} 0%, ${signalValue >= 70 ? '#10b981' : signalValue >= 40 ? '#eab308' : '#ef4444'} ${signalValue}%, rgba(255,255,255,0.06) ${signalValue}%, rgba(255,255,255,0.06) 100%)`,
            }}
          />
        </div>

        {/* Preferred Currency Control */}
        <div className="px-6 py-4 border-b border-white/[0.06] shrink-0 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-dash-accent" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Preferred Currency</span>
            </div>
            {currencySaving && <span className="text-[10px] text-dash-accent animate-pulse font-bold uppercase tracking-tighter">Saving...</span>}
          </div>
          <div className="relative group">
            <select
              value={userCurrency.toLowerCase()}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full bg-[#161C2A] border border-white/[0.06] rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-dash-accent/30 transition-all font-mono appearance-none cursor-pointer relative z-10"
            >
              {fiatCurrencies.map((curr) => (
                <option key={curr.code} value={curr.code} className="bg-[#161C2A] text-white py-2">
                  {curr.label} ({curr.code.toUpperCase()}) — {curr.symbol}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.06] shrink-0">
          <button
            onClick={() => { setActiveTab('portfolio'); setFeedback(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'portfolio'
                ? 'text-dash-accent border-b-2 border-dash-accent bg-dash-accent/[0.03]'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <DollarSign size={14} />
            Portfolio Balance
          </button>
          <button
            onClick={() => { setActiveTab('coins'); setFeedback(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'coins'
                ? 'text-dash-accent border-b-2 border-dash-accent bg-dash-accent/[0.03]'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <Coins size={14} />
            Coin Wallets
          </button>
        </div>

        {/* Content — scrollable */}
        <div className="overflow-y-auto flex-1">
          {activeTab === 'portfolio' ? (
            /* ======================== PORTFOLIO TAB ======================== */
            <div className="p-6">
              {/* Current Portfolio Balance */}
              <div className="bg-gradient-to-br from-dash-accent/[0.08] to-transparent border border-dash-accent/10 rounded-2xl p-5 mb-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Current Portfolio Value</span>
                <button 
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  className={`p-1.5 rounded-lg bg-white/5 text-text-muted hover:text-dash-accent hover:bg-dash-accent/10 transition-all ${refreshing ? 'animate-spin' : ''}`}
                  title="Refresh balance"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
              <p className="text-3xl font-bold text-white font-mono">
                {portfolioValue !== null && !refreshing
                  ? `$${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : <span className="inline-block w-32 h-8 bg-white/[0.04] rounded-lg animate-pulse" />
                }
              </p>
                <span className="text-[10px] text-text-muted mt-1 block">Calculated from all coin holdings × market prices</span>
              </div>

              <form onSubmit={handlePortfolioSubmit} className="space-y-5">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Modify Portfolio</h3>

                {/* Action Selector */}
                <div className="flex gap-2">
                  {(Object.keys(actionConfig) as Array<keyof typeof actionConfig>).map(key => {
                    const config = actionConfig[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setAction(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                          action === key ? config.color : 'text-text-muted bg-white/[0.02] border-white/[0.06] hover:border-white/10'
                        }`}
                      >
                        <config.icon size={14} />
                        {config.label}
                      </button>
                    );
                  })}
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    {action === 'set' ? 'New Balance (USD)' : 'Amount (USD)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm font-mono">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                      min="0"
                      step="any"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3 pl-8 pr-4 text-white text-sm outline-none focus:border-dash-accent/30 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Note */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Note (Optional)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Reason for modification..."
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-dash-accent/30 transition-all font-outfit"
                  />
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-3 rounded-xl text-xs font-semibold ${
                        feedback.type === 'success'
                          ? 'bg-dash-accent/10 text-dash-accent border border-dash-accent/20'
                          : 'bg-dash-error/10 text-dash-error border border-dash-error/20'
                      }`}
                    >
                      {feedback.msg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || !amount}
                  className="w-full py-3 rounded-xl bg-dash-accent text-[#0A0D14] font-bold text-sm hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                  {submitting ? 'Updating...' : `${actionConfig[action].label} Portfolio Balance`}
                </button>
              </form>
            </div>
          ) : (
            /* ======================== COINS TAB ======================== */
            <div>
              {/* Current Wallets */}
              <div className="p-6 border-b border-white/[0.06]">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Current Wallets</h3>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-dash-accent/30 border-t-dash-accent rounded-full animate-spin" />
                  </div>
                ) : wallets.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {wallets.map(w => (
                      <button
                        key={w.id}
                        onClick={() => setCoinSymbol(w.coin_symbol)}
                        className={`p-3 rounded-xl border transition-all text-left ${
                          coinSymbol.toUpperCase() === w.coin_symbol.toUpperCase()
                            ? 'bg-dash-accent/10 border-dash-accent/30'
                            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-text-muted uppercase">{w.coin_symbol}</span>
                        <p className="text-sm font-bold text-white font-mono mt-1">{w.balance.toLocaleString(undefined, { maximumFractionDigits: 8 })}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <Wallet size={24} className="text-text-muted mx-auto mb-2" />
                    <p className="text-xs text-text-muted">No wallets found</p>
                  </div>
                )}
              </div>

              {/* Modify Coin Balance Form */}
              <form onSubmit={handleCoinSubmit} className="p-6 space-y-5">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Modify Coin Balance</h3>

                {/* Action Selector */}
                <div className="flex gap-2">
                  {(Object.keys(actionConfig) as Array<keyof typeof actionConfig>).map(key => {
                    const config = actionConfig[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setAction(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                          action === key ? config.color : 'text-text-muted bg-white/[0.02] border-white/[0.06] hover:border-white/10'
                        }`}
                      >
                        <config.icon size={14} />
                        {config.label}
                      </button>
                    );
                  })}
                </div>

                {/* Coin Dropdown */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Select Asset</label>
                  <div className="relative group">
                    <select
                      value={coinSymbol.toUpperCase() || 'BTC'}
                      onChange={(e) => setCoinSymbol(e.target.value)}
                      disabled={marketData.length === 0}
                      className="w-full bg-[#161C2A] border border-white/[0.06] rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-dash-accent/30 transition-all font-mono appearance-none cursor-pointer disabled:opacity-50 relative z-10"
                    >
                      {marketData.length === 0 ? (
                        <option value="BTC" className="bg-[#0C101A] text-white">Loading assets...</option>
                      ) : (
                        marketData.map((c: any) => (
                          <option key={c.id} value={c.symbol.toUpperCase()} className="bg-[#161C2A] text-white py-2">
                            {c.name} ({c.symbol.toUpperCase()}) — ${c.current_price.toLocaleString()}
                          </option>
                        ))
                      )}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                {/* Amount in USD */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      {action === 'set' ? 'New Balance (USD)' : 'Amount (USD)'}
                    </label>
                    {amount && currentPrice > 0 && (
                      <span className="text-[10px] font-bold text-dash-accent font-mono">
                        ≈ {convertedCoinAmount.toFixed(8)} {coinSymbol.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm font-mono">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                      min="0"
                      step="any"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3 pl-8 pr-4 text-white text-sm outline-none focus:border-dash-accent/30 transition-all font-mono"
                    />
                  </div>
                  {currentPrice > 0 && (
                    <p className="text-[10px] text-text-muted font-mono mt-1 px-1">
                      Current Price: ${currentPrice.toLocaleString()} / {coinSymbol.toUpperCase()}
                    </p>
                  )}
                </div>

                {/* Note */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Note (Optional)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Reason for modification..."
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-dash-accent/30 transition-all font-outfit"
                  />
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-3 rounded-xl text-xs font-semibold ${
                        feedback.type === 'success'
                          ? 'bg-dash-accent/10 text-dash-accent border border-dash-accent/20'
                          : 'bg-dash-error/10 text-dash-error border border-dash-error/20'
                      }`}
                    >
                      {feedback.msg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || !coinSymbol || !amount}
                  className="w-full py-3 rounded-xl bg-dash-accent text-[#0A0D14] font-bold text-sm hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                  {submitting ? 'Updating...' : `${actionConfig[action].label} — ${coinSymbol.toUpperCase() || '...'}`}
                </button>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// Main Users Page — Paginated
// ============================================
export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userWallets, setUserWallets] = useState<UserWallet[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(false);
  const pageSize = 15;
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchUsers = useCallback(async (p: number, search: string) => {
    setLoading(true);
    try {
      const data = await getAdminUsers(p, pageSize, search);
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalUsers(data.total);
      setPage(data.page);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchUsers(1, '');
    fetchStats();
  }, [fetchUsers, fetchStats]);

  // Debounced search
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchUsers(1, query);
    }, 400);
  };

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage, searchQuery);
  };

  const fetchWallets = useCallback(async (userId: string) => {
    setWalletsLoading(true);
    try {
      const data = await getUserWallets(userId);
      setUserWallets(data);
    } catch (err) {
      console.error('Failed to fetch wallets:', err);
    } finally {
      setWalletsLoading(false);
    }
  }, []);

  const handleSelectUser = (user: AdminUser) => {
    setSelectedUser(user);
    fetchWallets(user.id);
  };

  const handleRefreshWallets = () => {
    if (selectedUser) {
      fetchWallets(selectedUser.id);
      fetchUsers(page, searchQuery);
      fetchStats();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Topbar inside page for search integration */}
      <AdminTopbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by name or email..."
      />

      <div className="mt-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-sm text-text-muted mt-1">View and modify user wallet balances</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? '—'} accent="bg-blue-500/10 text-blue-400" />
          <StatCard icon={Wallet} label="Active Wallets" value={stats?.activeWallets ?? '—'} accent="bg-dash-accent/10 text-dash-accent" />
          <StatCard icon={TrendingUp} label="Funded Users" value={stats?.fundedUsers ?? '—'} accent="bg-amber-500/10 text-amber-400" />
          <StatCard icon={Clock} label="New Today" value={stats?.newToday ?? '—'} accent="bg-purple-500/10 text-purple-400" />
        </div>

        {/* Users Table */}
        <div className="bg-[#0C101A] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
          {/* ... (rest of the table content) */}
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">All Users</span>
                <span className="text-xs text-text-muted bg-white/[0.04] px-2.5 py-0.5 rounded-full font-mono">
                  {totalUsers}
                </span>
              </div>
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); fetchUsers(1, ''); }}
                  className="text-xs text-dash-accent hover:underline font-semibold"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="text-left text-[10px] font-bold text-text-muted uppercase tracking-wider px-6 py-3">User</th>
                    <th className="text-left text-[10px] font-bold text-text-muted uppercase tracking-wider px-6 py-3 hidden sm:table-cell">Email</th>
                    <th className="text-center text-[10px] font-bold text-text-muted uppercase tracking-wider px-6 py-3">Wallets</th>
                    <th className="text-left text-[10px] font-bold text-text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">Joined</th>
                    <th className="text-center text-[10px] font-bold text-text-muted uppercase tracking-wider px-6 py-3">Role</th>
                    <th className="text-right text-[10px] font-bold text-text-muted uppercase tracking-wider px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/[0.03]">
                        {[70, 85, 50, 65, 45, 60].map((w, j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="h-4 bg-white/[0.04] rounded-lg animate-pulse" style={{ width: `${w}%` }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : users.length > 0 ? (
                    users.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group cursor-pointer"
                        onClick={() => handleSelectUser(user)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-dash-accent/20 to-dash-accent/5 border border-white/[0.06] flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-dash-accent">
                                {(user.full_name || user.email).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-white group-hover:text-dash-accent transition-colors truncate max-w-[140px]">
                              {user.full_name || 'Unnamed'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className="text-xs text-text-muted font-mono truncate max-w-[200px] block">{user.email}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-bold text-white font-mono">{user.wallet_count}</span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-xs text-text-muted">
                            {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                            user.is_admin
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-white/[0.04] text-text-muted border border-white/[0.06]'
                          }`}>
                            {user.is_admin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSelectUser(user); }}
                            className="text-xs font-bold text-dash-accent opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                          >
                            Manage
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <Search size={28} className="text-text-muted mx-auto mb-3" />
                        <p className="text-sm font-bold text-white">No users found</p>
                        <p className="text-xs text-text-muted mt-1">Try a different search term</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                total={totalUsers}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            )}
        </div>
      </div>

      {/* Balance Modal */}
      <AnimatePresence>
        {selectedUser && (
          <BalanceModal
            user={selectedUser}
            wallets={userWallets}
            loading={walletsLoading}
            onClose={() => setSelectedUser(null)}
            onRefresh={handleRefreshWallets}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
