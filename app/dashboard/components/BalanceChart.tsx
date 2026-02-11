"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '1.00', value: 16220 },
  { name: '5.00', value: 16350 },
  { name: '10.00', value: 16280 },
  { name: '13.00', value: 16420 },
  { name: '17.00', value: 16380 },
  { name: '20.00', value: 16500 },
  { name: '24.00', value: 16450 },
];

export default function BalanceChart() {
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
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            hide 
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#141822', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '12px',
              fontSize: '12px',
              color: '#fff'
            }}
            itemStyle={{ color: 'var(--dash-accent)' }}
            cursor={{ stroke: 'var(--dash-accent)', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="var(--dash-accent)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            dot={{ r: 4, fill: 'var(--dash-accent)', strokeWidth: 2, stroke: '#0A0D14' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
