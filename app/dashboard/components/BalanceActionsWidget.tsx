"use client";

import React from 'react';
import { motion } from 'motion/react';
import { ArrowDownLeft, Send, RefreshCw, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { useBalance } from '../context/BalanceContext';
import { formatCurrency } from '@/lib/currency';

export default function BalanceActionsWidget() {
  const { totalBalance, currency, loading } = useBalance();

  const actions = [
    { label: 'Deposit', icon: ArrowDownLeft, href: '/dashboard/deposit' },
    { label: 'Transfer', icon: Send, href: '/dashboard/transfer' },
    { label: 'Exchange', icon: RefreshCw, href: '/dashboard/trade' },
    { label: 'Withdraw', icon: ArrowDown, href: '/dashboard/withdraw' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#00C88C] rounded-[32px] p-8 flex flex-col gap-8 shadow-lg shadow-[#00C88C]/20"
    >
      <div className="flex flex-col">
        <h3 className="text-white/80 text-[11px] font-space uppercase tracking-widest mb-1">
          Total Balance
        </h3>
        <div className="flex items-baseline gap-2">
          <h2 className="text-5xl font-bold text-white font-outfit tracking-tighter">
            {loading ? '...' : formatCurrency(totalBalance, currency)}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="group bg-white rounded-2xl p-3 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
          >
            <action.icon className="w-4 h-4 text-[#00C88C]" />
            <span className="text-[#00C88C] font-bold text-xs font-outfit">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
