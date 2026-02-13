"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Benefits", href: "#benefits" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
  { name: "FAQs", href: "#faqs" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/70 backdrop-blur-lg border-b border-border-subtle shadow-sm">
      <div
        className="mx-auto flex items-center justify-between px-6 sm:px-8 lg:px-12"
        style={{ maxWidth: "var(--container-max)", height: "var(--nav-height)" }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-80">
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
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-14">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-space text-[15px] text-text-secondary hover:text-white transition-colors duration-200 font-medium tracking-tight"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            href="#get-started"
            className="font-space inline-flex items-center justify-center px-8 py-3 rounded-lg bg-accent-green text-bg-primary text-[15px] font-bold hover:bg-white hover:shadow-[0_0_30px_rgba(163,240,193,0.2)] transition-all duration-300"
          >
           Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-text-primary transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-text-primary transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-text-primary transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-bg-primary/98 backdrop-blur-xl ${mobileMenuOpen ? "max-h-96 py-6 border-t border-border-subtle" : "max-h-0"}`}
      >
        <div className="flex flex-col gap-2 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-space text-[15px] text-text-secondary hover:text-accent-green transition-colors duration-200 font-medium py-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/signup"
            className="font-space inline-flex items-center justify-center mt-4 px-9 py-3.5 rounded-lg bg-accent-green text-bg-primary text-[15px] font-bold hover:bg-white transition-all duration-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
