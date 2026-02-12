import React from 'react';

export function CoinSkeleton() {
  return (
    <div className="flex items-center justify-between animate-pulse px-2">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/[0.03]" />
        <div className="space-y-2">
          <div className="w-12 h-4 bg-white/[0.03] rounded" />
          <div className="w-8 h-3 bg-white/[0.02] rounded" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <div className="w-16 h-4 bg-white/[0.03] rounded ml-auto" />
        <div className="w-10 h-3 bg-white/[0.02] rounded ml-auto" />
      </div>
    </div>
  );
}
