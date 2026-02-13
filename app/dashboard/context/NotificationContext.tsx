"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface NotificationContextType {
    addNotification: (message: string, type?: ToastType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addNotification = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className={`
                                flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[320px]
                                ${toast.type === 'success' ? 'bg-[#00C896]/10 border-[#00C896]/20 text-[#00C896]' : ''}
                                ${toast.type === 'error' ? 'bg-[#FF4D4D]/10 border-[#FF4D4D]/20 text-[#FF4D4D]' : ''}
                                ${toast.type === 'info' ? 'bg-dash-accent/10 border-dash-accent/20 text-dash-accent' : ''}
                                ${toast.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : ''}
                            `}>
                                {toast.type === 'success' && <CheckCircle2 size={20} />}
                                {toast.type === 'error' && <AlertCircle size={20} />}
                                {(toast.type === 'info' || toast.type === 'warning') && <Info size={20} />}
                                
                                <span className="flex-1 font-outfit text-sm font-medium">{toast.message}</span>
                                
                                <button 
                                    onClick={() => removeToast(toast.id)}
                                    className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <X size={16} className="opacity-50 hover:opacity-100" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
