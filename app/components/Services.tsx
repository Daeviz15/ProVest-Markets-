"use client";

import React from 'react';
import { motion, Variants } from "motion/react";

const services = [
  {
    title: "Institutional Custody",
    description: "Multi-sig cold storage and insurance coverage for large-scale digital asset holdings.",
    stats: "100% Secure",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: "Alpha Analytics",
    description: "Proprietary market intelligence and predictive signals powered by machine learning.",
    stats: "89% Accuracy",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    )
  },
  {
    title: "Global Liquidity",
    description: "Deep order books and efficient trade execution across 50+ global venues.",
    stats: "Sub-ms Latency",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
];

export default function Services() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const }
    }
  };

  return (
    <section id="services" className="relative bg-bg-primary py-32 overflow-hidden">
      {/* Premium High-Gloss Glowing Arc Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none -translate-y-[50%]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-[60px] drop-shadow-[0_0_20px_rgba(163,240,193,0.3)] filter blur-[0.5px]"
        >
          <defs>
            <linearGradient id="divider-grad-glow-services" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--accent-green)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="divider-grad-core-services" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--accent-green)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q600,0 1200,100"
            stroke="url(#divider-grad-glow-services)"
            strokeWidth="6"
            fill="transparent"
            strokeLinecap="round"
          />
          <path
            d="M0,100 Q600,0 1200,100"
            stroke="url(#divider-grad-core-services)"
            strokeWidth="1.5"
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="mx-auto px-6 sm:px-8 lg:px-12 max-w-[var(--container-max)]">
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-col items-center text-center mb-24"
        >
          <span className="text-accent-green font-space text-[14px] font-medium tracking-[0.2em] uppercase mb-4">
            Our Ecosystem
          </span>
          <h2 className="font-outfit text-white text-[44px] sm:text-[56px] font-bold leading-[1.05] tracking-tight max-w-3xl">
            A specialized infrastructure <br className="hidden sm:block" /> for modern finance.
          </h2>
        </motion.div>

        {/* Services Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {services.map((service, i) => (
            <motion.div 
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-start group"
            >
              {/* Icon & Glow */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-accent-green/20 blur-2xl rounded-full scale-50 group-hover:scale-110 transition-transform duration-500" />
                <div className="relative w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-green group-hover:border-accent-green/40 transition-all duration-300">
                  {service.icon}
                </div>
              </div>

              {/* Text Info */}
              <div className="flex flex-col items-start gap-4">
                <span className="px-3 py-1 rounded-full bg-accent-green/10 text-accent-green text-[12px] font-bold font-space uppercase tracking-wider">
                  {service.stats}
                </span>
                <h3 className="text-white text-[24px] font-bold font-outfit group-hover:text-accent-green transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/30 text-[16px] leading-relaxed">
                  {service.description}
                </p>
                <a href="#" className="flex items-center gap-2 text-white text-[15px] font-bold hover:text-accent-green transition-colors mt-2">
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic CTA Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-32 p-8 sm:p-12 rounded-[40px] bg-white/[0.02] border border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-green opacity-[0.03] blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="max-w-xl text-center md:text-left relative z-10">
            <h3 className="text-white text-[32px] font-bold font-outfit mb-4 tracking-tight">Need custom infrastructure?</h3>
            <p className="text-white/40 text-[17px]">We provide tailored API solutions and liquidity pools for hedge funds and high-volume institutional traders.</p>
          </div>
          <button className="whitespace-nowrap px-10 py-5 rounded-2xl bg-white text-bg-primary font-bold text-[17px] hover:bg-accent-green transition-all shadow-xl relative z-10">
            Consult Specialist
          </button>
        </motion.div>
      </div>
    </section>
  );
}
