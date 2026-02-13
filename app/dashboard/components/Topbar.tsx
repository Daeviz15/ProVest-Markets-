import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Menu, ShieldCheck, X, TrendingUp, TrendingDown } from 'lucide-react';
import Image from 'next/image';
import { useSidebar } from '../context/SidebarContext';
import { useUser } from '../context/UserContext';
import { useBalance } from '../context/BalanceContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { getTopCoins, CoinMarketData } from '@/lib/crypto';
import { useRouter } from 'next/navigation';

export default function Topbar() {
  const router = useRouter();
  const { toggle } = useSidebar();
  const { user } = useUser();
  const { totalUsdBalance } = useBalance();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CoinMarketData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const fullName = user?.user_metadata?.full_name || "David Ukata";
  const avatarUrl = user?.user_metadata?.avatar_url || "/nft-one.png";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const coins = await getTopCoins(100);
        const filtered = coins.filter(c => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6);
        setSearchResults(filtered);
        setShowResults(true);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectCoin = (coinId: string) => {
    setSearchQuery('');
    setShowResults(false);
    router.push(`/dashboard/trade?coin=${coinId}`);
  };

  return (
    <header className="h-[70px] sm:h-[90px] w-full flex items-center justify-between px-3 sm:px-8 bg-dash-bg/40 backdrop-blur-2xl sticky top-0 z-40 transition-all border-b border-dash-border/30">
      {/* Left Section: Mobile Toggle & Logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button 
            onClick={toggle}
            className="p-1.5 sm:p-2 text-text-muted hover:text-white bg-white/5 rounded-xl border border-white/5 transition-all active:scale-95 shadow-sm"
        >
            <Menu size={18} className="sm:w-[20px] sm:h-[20px]" />
        </button>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-1 sm:gap-2">
            <ShieldCheck className="text-dash-accent shrink-0" size={20} />
            <div className="flex items-center">
                <span className="font-pacifico text-[16px] sm:text-[18px] text-dash-accent">Provest</span>
                <span className="font-outfit text-[16px] sm:text-[18px] font-bold text-white -ml-0.5 hidden xs:inline">Markets</span>
            </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center w-[400px] relative group" ref={searchRef}>
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${showResults ? 'text-dash-accent' : 'text-text-muted'}`} size={18} />
          <input 
            type="text" 
            placeholder="Search coins, news etc"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            className="w-full bg-white/[0.02] rounded-xl py-2.5 pl-12 pr-10 text-white placeholder:text-text-muted outline-none border border-white/5 focus:border-dash-accent/30 transition-all font-outfit text-sm shadow-inner"
          />
          {searchQuery && (
            <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
            >
                <X size={14} />
            </button>
          )}

          {/* Search Results Dropdown remains same... */}
          <AnimatePresence>
            {showResults && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-3 bg-[#0C101A] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 flex flex-col"
              >
                <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Asset Results</span>
                    {isSearching && (
                        <div className="w-3 h-3 border-2 border-dash-accent/30 border-t-dash-accent rounded-full animate-spin" />
                    )}
                </div>
                <div className="p-1">
                    {searchResults.length > 0 ? (
                        searchResults.map(coin => (
                            <button
                                key={coin.id}
                                onClick={() => handleSelectCoin(coin.id)}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 relative">
                                        <Image src={coin.image} alt={coin.name} fill className="object-contain" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-white uppercase group-hover:text-dash-accent transition-colors">{coin.symbol}</div>
                                        <div className="text-[10px] text-text-muted font-medium">{coin.name}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-white font-mono">${coin.current_price.toLocaleString()}</div>
                                    <div className={`text-[10px] font-bold flex items-center justify-end gap-1 ${coin.price_change_percentage_24h >= 0 ? 'text-dash-accent' : 'text-dash-error'}`}>
                                        {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="py-8 px-4 text-center">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                <Search size={18} className="text-text-muted" />
                            </div>
                            <p className="text-xs font-bold text-white">No assets found</p>
                            <p className="text-[10px] text-text-muted mt-1">Try a different search term</p>
                        </div>
                    )}
                </div>
                <Link 
                    href="/dashboard/trade" 
                    onClick={() => setShowResults(false)}
                    className="p-3 bg-white/[0.02] border-t border-white/5 text-center group"
                >
                    <span className="text-[10px] font-black text-dash-accent group-hover:text-white transition-colors uppercase tracking-[0.25em]">View Market Terminal</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-6">
        <div className="flex flex-col items-end pr-2 sm:pr-4 border-r border-dash-border/30">
            <span className="text-[8px] sm:text-[9px] text-text-muted font-bold uppercase tracking-[0.15em] mb-0.5 sm:mb-1 opacity-60 hidden xs:block">Balance</span>
            <span className="text-xs sm:text-base font-bold text-white font-mono tracking-tight">
                ${totalUsdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        </div>

        <Link href="/dashboard/wallets">
          <button className="flex items-center gap-2 px-2 sm:px-5 py-1.5 sm:py-2.5 bg-dash-accent text-bg-primary rounded-full font-bold text-xs sm:text-sm hover:shadow-lg hover:shadow-dash-accent/20 transition-all active:scale-95">
            <Plus size={14} className="sm:w-[16px] sm:h-[16px]" />
            <span className="hidden xs:inline">Fund</span>
            <span className="hidden sm:inline">Wallet</span>
          </button>
        </Link>

        {/* Profile */}
        <Link href="/dashboard/profile" className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2 cursor-pointer group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-dash-accent/30 overflow-hidden group-hover:border-dash-accent transition-all relative">
             <Image 
                src={avatarUrl} 
                alt="Profile" 
                fill 
                className="object-cover"
                sizes="(max-width: 640px) 32px, 40px"
             />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-white font-outfit leading-none">{fullName}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
