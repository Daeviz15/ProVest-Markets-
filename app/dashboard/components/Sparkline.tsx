"use client";

import React, { useMemo } from 'react';

interface SparklineProps {
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
  isPositive?: boolean;
}

export default function Sparkline({ 
  data = [], 
  color, 
  width = 100, 
  height = 30,
  isPositive = true
}: SparklineProps) {
    
  // Generate fake data if none provided (for visual flair without heavy API)
  // or use provided data.
  const points = useMemo(() => {
    if (data.length > 0) return data;
    // Generate a sleek random walk standard for crypto look
    let current = 50;
    return Array.from({ length: 20 }, () => {
        current += (Math.random() - 0.5) * 10;
        return current;
    });
  }, [data]);

  const path = useMemo(() => {
    if (points.length < 2) return "";

    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    const stepX = width / (points.length - 1);

    return points.map((val, i) => {
        const x = i * stepX;
        const normalizedY = (val - min) / range;
        const y = height - (normalizedY * height); // Invert Y for SVG
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
  }, [points, width, height]);

  const strokeColor = color || (isPositive ? '#00E396' : '#FF4560'); // Default Green/Red

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" className="overflow-visible">
      <path 
        d={path} 
        stroke={strokeColor} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
