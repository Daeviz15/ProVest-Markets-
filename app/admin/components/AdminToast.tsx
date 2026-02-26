"use client";

import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

interface AdminToastProps {
  show: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function AdminToast({ 
  show, 
  message, 
  type = 'info', 
  onClose,
  duration = 5000 
}: AdminToastProps) {
  
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const configs = {
    success: {
      icon: CheckCircle2,
      color: 'text-dash-accent',
      border: 'border-dash-accent/20',
      bg: 'bg-[#0F1D1A]'
    },
    error: {
      icon: AlertCircle,
      color: 'text-dash-error',
      border: 'border-dash-error/20',
      bg: 'bg-[#201114]'
    },
    info: {
      icon: Info,
      color: 'text-blue-400',
      border: 'border-blue-400/20',
      bg: 'bg-[#0E1525]'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className={`fixed bottom-8 right-8 z-[110] flex items-center gap-3 px-5 py-4 rounded-2xl border ${config.border} ${config.bg} shadow-2xl min-w-[320px] max-w-md`}
        >
          <div className={`${config.color} shrink-0`}>
            <Icon size={20} />
          </div>
          <p className="flex-1 text-sm font-semibold text-white">{message}</p>
          <button 
            onClick={onClose}
            className="p-1 text-text-muted hover:text-white transition-all rounded-lg hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
