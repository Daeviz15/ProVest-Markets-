"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from './UserContext';
import { getTopCoins, CoinMarketData } from '@/lib/crypto';

interface Wallet {
    coin_symbol: string;
    balance: number;
}

interface BalanceContextType {
    balances: Wallet[];
    totalBalance: number;
    currency: string;
    loading: boolean;
    getSymbolBalance: (symbol: string) => number;
    refreshBalances: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: React.ReactNode }) {
    const { user, profile } = useUser();
    const [balances, setBalances] = useState<Wallet[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const currency = profile?.preferred_currency || 'usd';

    const calculateTotal = useCallback((wallets: Wallet[], marketData: CoinMarketData[]) => {
        const total = wallets.reduce((acc, curr) => {
            const coin = marketData.find(c => c.symbol.toLowerCase() === curr.coin_symbol.toLowerCase());
            return acc + (curr.balance * (coin?.current_price || 0));
        }, 0);
        setTotalBalance(total);
    }, []);

    const fetchBalances = useCallback(async () => {
        if (!user) {
            setBalances([]);
            setTotalBalance(0);
            setLoading(false);
            return;
        }

        try {
            const [walletRes, marketRes] = await Promise.all([
                supabase.from('wallets').select('coin_symbol, balance').eq('user_id', user.id),
                getTopCoins(100, currency)
            ]);

            if (walletRes.error) throw walletRes.error;

            const wallets = walletRes.data.map(w => ({ 
                coin_symbol: w.coin_symbol, 
                balance: Number(w.balance) 
            }));

            setBalances(wallets);
            calculateTotal(wallets, marketRes);
        } catch (error) {
            console.error('Error fetching balances:', error);
        } finally {
            setLoading(false);
        }
    }, [user, calculateTotal]);

    useEffect(() => {
        fetchBalances();

        if (user) {
            const subscription = supabase
                .channel(`public:wallets:user_id=eq.${user.id}`)
                .on('postgres_changes', { 
                    event: '*', 
                    schema: 'public', 
                    table: 'wallets', 
                    filter: `user_id=eq.${user.id}` 
                }, () => {
                    fetchBalances();
                })
                .subscribe();

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [user, fetchBalances]);

    const getSymbolBalance = (symbol: string) => {
        const wallet = balances.find(b => b.coin_symbol.toLowerCase() === symbol.toLowerCase());
        return wallet ? wallet.balance : 0;
    };

    const refreshBalances = async () => {
        setLoading(true);
        await fetchBalances();
    };

    return (
        <BalanceContext.Provider value={{ balances, totalBalance, currency, loading, getSymbolBalance, refreshBalances }}>
            {children}
        </BalanceContext.Provider>
    );
}

export function useBalance() {
    const context = useContext(BalanceContext);
    if (context === undefined) {
        throw new Error('useBalance must be used within a BalanceProvider');
    }
    return context;
}
