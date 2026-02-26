"use client";

import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X, Check, AlertTriangle, Info } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'success' | 'info' | 'warning';
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  loading = false
}: ConfirmModalProps) {
  
  const variants = {
    danger: {
      icon: AlertTriangle,
      color: 'text-dash-error',
      bg: 'bg-dash-error/10',
      border: 'border-dash-error/20',
      button: 'bg-dash-error hover:brightness-110 text-white'
    },
    success: {
      icon: Check,
      color: 'text-dash-accent',
      bg: 'bg-dash-accent/10',
      border: 'border-dash-accent/20',
      button: 'bg-dash-accent hover:brightness-110 text-[#0A0D14]'
    },
    warning: {
      icon: AlertCircle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      button: 'bg-yellow-500 hover:brightness-110 text-black'
    },
    info: {
      icon: Info,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/20',
      button: 'bg-blue-400 hover:brightness-110 text-black'
    }
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-[#0C101A] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${config.bg} ${config.color} border ${config.border}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{message}</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 text-text-muted hover:text-white rounded-xl hover:bg-white/5 transition-all outline-none"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-text-muted font-bold text-sm hover:text-white hover:bg-white/10 transition-all active:scale-[0.98] outline-none"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none outline-none ${config.button}`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
