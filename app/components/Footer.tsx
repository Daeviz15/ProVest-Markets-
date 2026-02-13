"use client";

import React from 'react';
import { motion, Variants } from "motion/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const }
    }
  };

  return (
    <footer className="relative bg-[#05080F] pt-20 pb-12 overflow-hidden">
      <div className="mx-auto px-6 sm:px-8 lg:px-12 max-w-[var(--container-max)]">
        
        {/* Newsletter Subscription Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mb-24 rounded-[40px] bg-accent-green p-8 sm:p-12 lg:p-16 overflow-hidden shadow-[0_20px_50px_-10px_rgba(163,240,193,0.3)]"
        >
          {/* Decorative Pattern / Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-full bg-white/10 -skew-x-[30deg] translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="font-outfit text-[#05080F] text-[36px] sm:text-[48px] font-bold leading-tight mb-4">
                Subscribe to our newsletter
              </h2>
              <p className="text-[#05080F]/60 text-[16px] sm:text-[18px] font-medium">
                Be the first to receive institutional market updates, platform features, and Alpha reports.
              </p>
            </div>

            <div className="w-full lg:w-auto flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white/20 border border-white/20 text-[#05080F] placeholder:text-[#05080F]/40 outline-none rounded-2xl py-4 px-6 min-w-0 sm:min-w-[320px] font-outfit focus:bg-white/30 transition-all"
                />
                <button className="bg-[#05080F] text-white font-bold font-outfit py-4 px-10 rounded-2xl hover:bg-white hover:text-[#05080F] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl">
                  Subscribe
                </button>
              </div>
              <p className="text-[#05080F]/40 text-[12px] font-medium text-center lg:text-left">
                By subscribing, you agree to our <span className="underline cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20"
        >
          
          {/* Brand Column */}
          <motion.div variants={fadeInUp} className="lg:col-span-5 flex flex-col items-start gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-accent-green drop-shadow-[0_0_8px_rgba(163,240,193,0.3)]"
                >
                  <path
                    d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4ZM16 7C20.9706 7 25 11.0294 25 16C25 20.9706 20.9706 25 16 25C11.0294 25 7 20.9706 7 16C7 11.0294 11.0294 7 16 7Z"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M21 16C21 18.7614 18.7614 21 16 21C13.2386 21 11 18.7614 11 16C11 13.2386 13.2386 11 16 11"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex items-center transform translate-y-1">
                <span className="font-pacifico text-[26px] font-normal tracking-wide bg-gradient-to-t from-accent-green from-[35%] to-white to-[35%] bg-clip-text text-transparent">
                  Provest
                </span>
                <span className="font-outfit text-[26px] font-bold tracking-tight text-white mb-1 -ml-1.5">
                  Markets
                </span>
              </div>
            </div>
            <p className="max-w-xs text-white/40 text-[16px] leading-relaxed">
              Institutional-grade digital asset infrastructure. Speed, security, and precision for the modern capital markets.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-4">
              {[
                { name: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { name: 'Instagram', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 21h9a4.5 4.5 0 004.5-4.5v-9A4.5 4.5 0 0016.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21z' },
                { name: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:bg-accent-green hover:text-[#05080F] hover:scale-110 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links Columns */}
          <motion.div variants={fadeInUp} className="lg:col-span-2 flex flex-col gap-6">
            <h4 className="text-white font-outfit text-[18px] font-bold">Features</h4>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Market Features', href: '#features' },
                { name: 'Platform Benefits', href: '#benefits' },
                { name: 'Expert Services', href: '#services' },
                { name: 'Alpha Analytics', href: '#services' }
              ].map(link => (
                <a key={link.name} href={link.href} className="text-white/40 hover:text-accent-green text-[15px] transition-colors">{link.name}</a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="lg:col-span-2 flex flex-col gap-6">
            <h4 className="text-white font-outfit text-[18px] font-bold">Support</h4>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Contact Us', href: '#contact' },
                { name: 'FAQ Center', href: '#faqs' },
                { name: 'API Docs', href: '#' },
                { name: 'Status', href: '#' }
              ].map(link => (
                <a key={link.name} href={link.href} className="text-white/40 hover:text-accent-green text-[15px] transition-colors">{link.name}</a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="lg:col-span-3 flex flex-col gap-6">
            <h4 className="text-white font-outfit text-[18px] font-bold">Legal</h4>
            <div className="flex flex-col gap-4">
              {['Terms of Service', 'Privacy Policy', 'Cookie Preference', 'Compliance'].map(link => (
                <a key={link} href="#" className="text-white/40 hover:text-accent-green text-[15px] transition-colors">{link}</a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <p className="text-white/20 text-[14px]">
            © {currentYear} ProvestMarkets Technologies Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-white/20 text-[14px]">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
