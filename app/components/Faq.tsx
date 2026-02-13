"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from "motion/react";

const faqData = [
  {
    question: "What makes ProvestMarkets institutional-grade?",
    answer: "Our platform is built on an LMAX-style matching engine with sub-millisecond latency. We provide SOC2 Type II compliant custody, institutional-only liquidity pools, and white-glove support for high-volume trading accounts."
  },
  {
    question: "How secure are my digital assets?",
    answer: "ProvestMarkets employs a multi-layer security architecture including FIPS 140-2 Level 3 hardware security modules, multi-party computation (MPC) for key management, and 100% insurance coverage on cold storage holdings."
  },
  {
    question: "What are the API rate limits?",
    answer: "We offer tiered API access. Standard accounts start at 100 requests/sec, while our institutional 'Elite' tier provides dedicated endpoints with customized rate limits and WebSocket support for low-latency market data."
  },
  {
    question: "Does ProvestMarkets support fiat on-ramps?",
    answer: "Yes, we support instant fiat settlement for USD, EUR, and GBP via SEPA, SWIFT, and FedWire. Our liquidity bridge ensures zero slippage for large fiat-to-crypto conversions."
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="faqs" className="relative bg-bg-primary py-32 overflow-hidden">
      {/* Premium High-Gloss Glowing Arc Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none -translate-y-[50%]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-[60px] drop-shadow-[0_0_20px_rgba(163,240,193,0.3)] filter blur-[0.5px]"
        >
          <defs>
            <linearGradient id="divider-grad-glow-faq" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--accent-green)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="divider-grad-core-faq" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--accent-green)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q600,0 1200,100"
            stroke="url(#divider-grad-glow-faq)"
            strokeWidth="6"
            fill="transparent"
            strokeLinecap="round"
          />
          <path
            d="M0,100 Q600,0 1200,100"
            stroke="url(#divider-grad-core-faq)"
            strokeWidth="1.5"
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="mx-auto px-6 sm:px-8 lg:px-12 max-w-[var(--container-max)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left: Section Header */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col items-start"
          >
            <span className="text-accent-green font-space text-[14px] font-medium tracking-[0.2em] uppercase mb-4 inline-block">
              Insight & Clarity
            </span>
            <h2 className="font-outfit text-white text-[44px] sm:text-[56px] font-bold leading-[1.05] tracking-tight mb-8">
              Frequently asked <br /> questions.
            </h2>
            <p className="text-white/40 text-[18px] leading-relaxed mb-10 max-w-lg">
              Everything you need to know about our institutional-grade infrastructure and specialized services.
            </p>
            <div className="p-1 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4 pr-6">
              <div className="w-12 h-12 rounded-xl bg-accent-green flex items-center justify-center text-bg-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white/60 font-medium">Still have questions? <a href="#contact" className="text-accent-green underline">Contact us</a></span>
            </div>
          </motion.div>

          {/* Right: Accordion */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7 flex flex-col gap-4"
          >
            {faqData.map((faq, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className={`overflow-hidden rounded-[24px] border transition-all duration-300 ${openIndex === i ? 'bg-[#0A0E1A]/60 border-accent-green/30' : 'bg-transparent border-white/5 hover:border-white/10'}`}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left"
                >
                  <span className={`text-[18px] sm:text-[20px] font-bold font-outfit transition-colors ${openIndex === i ? 'text-accent-green' : 'text-white'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${openIndex === i ? 'bg-accent-green border-accent-green text-bg-primary rotate-180' : 'bg-white/5 border-white/10 text-white'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <AnimatePresence mode="wait">
                  {openIndex === i && (
                    <motion.div 
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 sm:px-8 pb-8 text-white/40 text-[16px] leading-relaxed border-t border-white/5 pt-6">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
