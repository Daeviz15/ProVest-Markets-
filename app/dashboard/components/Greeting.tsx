"use client";

import React from 'react';
import { useUser } from '../context/UserContext';
import { motion } from 'motion/react';

export default function Greeting() {
  const { profile, loading } = useUser();

  if (loading) {
    return (
      <div className="h-10 w-48 bg-white/5 animate-pulse rounded-lg" />
    );
  }

  const name = profile?.full_name || 'Valued Member';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-2"
    >
      <h1 className="text-3xl font-bold text-white font-outfit tracking-tight">
        Welcome, <span className="text-dash-accent">{name}</span>
      </h1>
      <p className="text-text-muted text-sm font-space">
        Here's what's happening with your portfolio today.
      </p>
    </motion.div>
  );
}
