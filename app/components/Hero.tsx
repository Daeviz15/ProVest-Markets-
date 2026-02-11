"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "motion/react";

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const }
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-bg-primary">
      {/* Ambient background glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--accent-green) 0%, transparent 70%)",
        }}
      />

      {/* Content container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center lg:items-center gap-16 lg:gap-12"
        style={{
          maxWidth: "var(--container-max)",
          paddingTop: "var(--nav-height)",
        }}
      >
        {/* Left Column — Text Content */}
        <div className="flex-1 flex flex-col items-start gap-8 max-w-xl lg:max-w-[620px] py-8">
          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="font-outfit text-[52px] sm:text-[62px] lg:text-[76px] font-medium leading-[1.05] tracking-tight text-white"
          >
            Fast & Secure <br />
            Cryptocurrency <br />
            Exchange
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-text-secondary text-[17px] sm:text-[19px] leading-[1.7] max-w-lg tracking-tight"
          >
            Trade cryptocurrencies with ease, security, and advanced features on our cutting-edge platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-xl bg-accent-green text-bg-primary text-[17px] font-bold transition-all duration-300 active:scale-95 shadow-[0_0_40px_rgba(163,240,193,0.15)]"
            >
              Get Started
            </Link>
            <Link
              href="/signin"
              className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-xl border-2 border-[#A3F0C1] text-[#A3F0C1] text-[17px] font-bold transition-all duration-300 active:scale-95 shadow-[0_0_40px_rgba(163,240,193,0.15)]"
            >
              Sign in
            </Link>
          </motion.div>
        </div>

        {/* Right Column — Hero Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex-1 flex items-center justify-center lg:justify-end relative"
        >
          <div className="relative w-full max-w-[640px] lg:max-w-[760px] group">
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 pointer-events-none blur-[100px]"
              style={{
                background: "radial-gradient(circle, var(--accent-green) 0%, transparent 70%)"
              }}
            />

            <div 
              className="relative z-10"
              style={{
                maskImage: "radial-gradient(circle at 30% 50%, black 20%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(circle at 30% 50%, black 20%, transparent 75%)"
              }}
            >
              <Image
                src="/hero.png"
                alt="Crypto Portfolio Display"
                width={800}
                height={800}
                priority
                className="relative w-full h-auto object-contain transition-all duration-700 ease-out lg:scale-125 hover:scale-[1.28]"
                quality={100}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
