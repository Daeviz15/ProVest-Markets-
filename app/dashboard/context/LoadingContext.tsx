"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'motion/react';
import NftSpinner from '../components/NftSpinner';

interface LoadingContextType {
  setIsLoading: (loading: boolean, message?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoadingState] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined);
  const pathname = usePathname();

  // Show page transition loader on path change
  useEffect(() => {
    // Only show if not already loading a specific action
    if (!isLoading) {
        setIsLoadingState(true);
        setLoadingMessage("Navigating...");
        
        const timer = setTimeout(() => {
            setIsLoadingState(false);
            setLoadingMessage(undefined);
        }, 1200); // Smooth transition duration

        return () => clearTimeout(timer);
    }
  }, [pathname]);

  const setIsLoading = (loading: boolean, message?: string) => {
    setIsLoadingState(loading);
    setLoadingMessage(message);
  };

  return (
    <LoadingContext.Provider value={{ setIsLoading }}>
      {children}
      <AnimatePresence>
        {isLoading && (
          <NftSpinner overlay message={loadingMessage} />
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
