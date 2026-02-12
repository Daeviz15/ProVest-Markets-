"use client";

import React from 'react';
import Image from 'next/image';
import { FileText } from 'lucide-react';

export default function PaymentHistory() {
  const history: any[] = []; // Empty state

  return (
    <div className="bg-[#0C101A] rounded-[32px] p-8 h-full flex flex-col shadow-2xl">
      <h3 className="text-lg font-bold text-white mb-6 font-outfit tracking-tight">Payment History</h3>
      
      <div className="flex-1 overflow-auto flex flex-col">
        {history.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] text-text-muted uppercase font-space tracking-widest">
                <th className="pb-4 font-normal">Name</th>
                <th className="pb-4 font-normal">Price</th>
                <th className="pb-4 font-normal">Status</th>
                <th className="pb-4 font-normal text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dash-border">
              {history.map((item, index) => (
                <tr key={index} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center">
                          <Image src={item.icon} alt={item.name} width={18} height={18} />
                      </div>
                      <span className="text-sm font-bold text-white font-outfit">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 font-outfit text-sm text-text-secondary">{item.price}</td>
                  <td className="py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                      item.status === 'Successful' ? 'bg-dash-accent/10 text-dash-accent' :
                      item.status === 'Pending' ? 'bg-orange-500/10 text-orange-400' :
                      'bg-dash-error/10 text-dash-error'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-outfit text-sm text-white font-bold">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted opacity-60">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <FileText size={32} />
            </div>
            <p className="text-sm font-bold">No recent transactions</p>
          </div>
        )}
      </div>
    </div>
  );
}
