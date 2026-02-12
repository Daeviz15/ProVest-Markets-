"use client";

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCoinHistory } from '@/lib/crypto';

export default function BalanceChart({ 
  coinId = 'bitcoin', 
  days = '7' 
}: { 
  coinId?: string, 
  days?: string 
}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const history = await getCoinHistory(coinId, parseInt(days));
        // Map [timestamp, price] to { time, value }
        const formattedData = history.prices.map(([time, price]: [number, number]) => {
            const date = new Date(time);
            let timeLabel = '';
            
            if (days === '1') {
                timeLabel = date.getHours() + ':00';
            } else if (days === '365') {
                timeLabel = date.toLocaleDateString(undefined, { month: 'short' });
            } else {
                timeLabel = date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
            }

            return {
                time: timeLabel,
                value: price
            };
        });
        setData(formattedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [coinId, days]);

  if (loading) return (
    <div className="w-full h-[300px] mt-8 flex items-center justify-center border border-white/5 rounded-3xl bg-white/[0.02] animate-pulse">
        <span className="text-xs font-space text-text-muted uppercase tracking-widest">Gathering Institutional Data...</span>
    </div>
  );

  return (
    <div className="w-full h-[300px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--dash-accent)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--dash-accent)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="rgba(255,255,255,0.05)" 
          />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }} 
            dy={10}
            minTickGap={20}
          />
          <YAxis 
            hide 
            domain={['dataMin', 'dataMax']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#141822', 
              border: 'none', 
              borderRadius: '12px',
              fontSize: '12px',
              color: '#fff',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
            itemStyle={{ color: 'var(--dash-accent)', fontWeight: 700 }}
            labelStyle={{ display: 'none' }}
            cursor={{ stroke: 'var(--dash-accent)', strokeWidth: 1, strokeDasharray: '4 4' }}
            formatter={(val: any) => [`$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Price']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="var(--dash-accent)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            dot={false}
            activeDot={{ r: 6, fill: 'var(--dash-accent)', strokeWidth: 2, stroke: '#0C101A' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
