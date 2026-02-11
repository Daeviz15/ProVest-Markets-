"use client";

import React from 'react';
import { motion, Variants } from "motion/react";

export default function Contact() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const }
    }
  };

  return (
    <section id="contact" className="relative bg-bg-primary py-32 overflow-hidden">
      {/* Premium High-Gloss Glowing Arc Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none -translate-y-[50%]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-[60px] drop-shadow-[0_0_20px_rgba(163,240,193,0.3)] filter blur-[0.5px]"
        >
          <defs>
            <linearGradient id="divider-grad-glow-contact" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--accent-green)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="divider-grad-core-contact" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--accent-green)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q600,0 1200,100"
            stroke="url(#divider-grad-glow-contact)"
            strokeWidth="6"
            fill="transparent"
            strokeLinecap="round"
          />
          <path
            d="M0,100 Q600,0 1200,100"
            stroke="url(#divider-grad-core-contact)"
            strokeWidth="1.5"
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="mx-auto px-6 sm:px-8 lg:px-12 max-w-[var(--container-max)]">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Content Area */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="lg:w-1/2 flex flex-col gap-10"
          >
            <div>
              <span className="text-accent-green font-space text-[14px] font-medium tracking-[0.2em] uppercase mb-4 inline-block">
                Get in touch
              </span>
              <h2 className="font-outfit text-white text-[44px] sm:text-[56px] font-bold leading-[1.05] tracking-tight mb-6">
                Start your <span className="text-accent-green">Alpha</span> journey today.
              </h2>
              <p className="text-white/40 text-[18px] leading-relaxed max-w-lg">
                Have questions about our institutional services or API implementation? Our specialist team is ready to assist.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {[
                { label: "Institutional Inquiries", value: "institutional@auratrade.io" },
                { label: "Technical Support", value: "dev-support@auratrade.io" }
              ].map((info, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-white/20 text-[12px] font-space font-bold uppercase tracking-widest">{info.label}</span>
                  <a href={`mailto:${info.value}`} className="text-white text-[20px] font-bold font-outfit hover:text-accent-green transition-colors">{info.value}</a>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Premium Glass Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:w-1/2 w-full max-w-[540px] relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-accent-green/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[40px]" />
            <div className="relative bg-[#0A0E1A]/40 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 sm:p-12 shadow-2xl flex flex-col gap-8 transition-all duration-500 group-hover:border-white/20">
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-white/30 text-[12px] font-space uppercase font-bold px-2">Your Name</label>
                    <input type="text" placeholder="John Doe" className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 outline-none focus:border-accent-green/50 transition-all font-outfit" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-white/30 text-[12px] font-space uppercase font-bold px-2">Work Email</label>
                    <input type="email" placeholder="john@company.com" className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 outline-none focus:border-accent-green/50 transition-all font-outfit" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white/30 text-[12px] font-space uppercase font-bold px-2">Subject</label>
                  <input type="text" placeholder="How can we help?" className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 outline-none focus:border-accent-green/50 transition-all font-outfit" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white/30 text-[12px] font-space uppercase font-bold px-2">Message</label>
                  <textarea rows={4} placeholder="Your message here..." className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 outline-none focus:border-accent-green/50 transition-all font-outfit resize-none"></textarea>
                </div>
              </div>
              <button className="w-full py-5 rounded-2xl bg-accent-green text-bg-primary font-bold text-[17px] hover:bg-white transition-all transform active:scale-[0.98] shadow-[0_20px_40px_-10px_rgba(163,240,193,0.3)]">
                Send Inquiry
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
