"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Leaf, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/50 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
              <Leaf className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">EcoStep</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-white hover:text-emerald-400 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-zinc-300 hover:text-emerald-400 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-white/10 w-full my-2" />
              <Link
                href="/login"
                className="text-lg font-medium text-white hover:text-emerald-400 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-center text-lg font-medium bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-2"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
