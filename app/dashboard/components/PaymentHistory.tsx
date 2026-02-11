"use client";

import React from 'react';
import Image from 'next/image';

const history = [
  { name: 'Achain', price: '$14,750', status: 'Successful', amount: '21 ACT', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a6353054d9072017cf627ccda0689531c3bf108/128/color/act.png' },
  { name: 'Cardano', price: '$24,000', status: 'Pending', amount: '0.35 ADA', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a6353054d9072017cf627ccda0689531c3bf108/128/color/ada.png' },
  { name: 'Digibyte', price: '$200.00', status: 'Successful', amount: '14 DGB', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a6353054d9072017cf627ccda0689531c3bf108/128/color/dgb.png' },
  { name: 'Ethereum', price: '$750.75', status: 'Cancel', amount: '0.24 ETH', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a6353054d9072017cf627ccda0689531c3bf108/128/color/eth.png' },
];

export default function PaymentHistory() {
  return (
    <div className="bg-dash-surface/50 border border-dash-border rounded-[32px] p-8 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-6 font-outfit">Payment History</h3>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] text-text-muted uppercase font-space tracking-widest border-b border-dash-border">
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
      </div>
    </div>
  );
}
