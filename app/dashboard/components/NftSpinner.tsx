"use client";

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

interface NftSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    overlay?: boolean;
    message?: string;
    image?: string;
}

export default function NftSpinner({ 
    size = 'md', 
    overlay = false, 
    message, 
    image = "/nft-one.png" 
}: NftSpinnerProps) {
    
    const sizeClasses = {
        sm: 'w-20 h-20',
        md: 'w-32 h-32',
        lg: 'w-44 h-44',
        xl: 'w-64 h-64'
    };

    const containerSize = sizeClasses[size];

    const spinnerContent = (
        <div className="flex flex-col items-center justify-center gap-10">
            {/* SVG Filter Definitions */}
            <svg className="fixed invisible w-0 h-0">
                <defs>
                    {/* Morphing Liquid Filter for smooth movement */}
                    <filter id="liquid-filter" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
                    </filter>
                </defs>
            </svg>

            <div className={`relative ${containerSize} flex items-center justify-center`}>
                {/* 1. The Realistic Flaming Fire Border */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                        duration: 8, 
                        repeat: Infinity, 
                        ease: "linear" 
                    }}
                    className="absolute inset-[-20px] z-0 overflow-visible pointer-events-none"
                    style={{ filter: 'url(#liquid-filter)' }}
                >
                    {/* Layer 1: Core Intense Flame - Fluid Animation */}
                    <motion.div 
                        animate={{ 
                            opacity: [0.6, 0.9, 0.6],
                            y: [0, -5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-gradient-to-t from-dash-accent via-emerald-400 to-transparent blur-[4px]"
                    />
                    
                    {/* Layer 2: White-Hot Core - Fast Pulse */}
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute inset-4 rounded-full bg-gradient-to-t from-white via-dash-accent to-transparent blur-[2px] mix-blend-screen"
                    />

                    {/* Layer 3: Outer Distant Glow - Soft Pulse */}
                    <motion.div 
                        animate={{ 
                            scale: [0.9, 1.1, 0.9]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-15px] rounded-full bg-dash-accent/30 blur-[45px]"
                    />
                </motion.div>

                {/* 2. Standard Circular Spinner Elements (Semi-Transparent) */}
                <div className="relative z-10 w-full h-full">
                    {/* Outer Ring - Clockwise */}
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-t-2 border-r-2 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    />
                    {/* Inner Ring - Counter Clockwise */}
                    <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 rounded-full border-b-2 border-l-2 border-white/10"
                    />
                    
                    {/* Central NFT Image Container */}
                    <div className="absolute inset-8 rounded-full overflow-hidden border-2 border-white/20 bg-black shadow-2xl">
                        {/* Inner Shadow for Depth */}
                        <div className="absolute inset-0 z-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] rounded-full" />
                        <Image 
                            src={image} 
                            alt="Loading" 
                            fill 
                            className="object-cover opacity-90 scale-105"
                        />
                    </div>
                </div>

                {/* Flame Particles (Micro glows) */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-dash-accent"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                            opacity: [0, 0.7, 0],
                            scale: [0.5, 1.2, 0.5],
                            y: [-60, -180],
                            x: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 120]
                        }}
                        transition={{ 
                            duration: 4 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeOut"
                        }}
                        style={{ filter: 'blur(3px)' }}
                    />
                ))}
            </div>
            
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2 relative z-10"
                >
                    <h3 className="text-xl font-bold text-white font-outfit tracking-tight">{message}</h3>
                    <div className="flex justify-center gap-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                className="w-1.5 h-1.5 rounded-full bg-dash-accent"
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );

    if (overlay) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
            >
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-dash-accent/10 blur-[100px] rounded-full opacity-50" />
                
                <div className="relative">
                    {spinnerContent}
                </div>
            </motion.div>
        );
    }

    return spinnerContent;
}
