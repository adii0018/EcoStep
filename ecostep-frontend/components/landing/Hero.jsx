"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, BarChart, Leaf, Target } from "lucide-react";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background glow & pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[120px] opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm font-medium text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              🌍 Join 10,000+ eco-conscious users
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
          >
            Track your <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">carbon.</span>
            <br />
            Save the <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">planet.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            EcoStep helps you understand your daily carbon footprint, get AI-powered insights, and take small actions that create big impact.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Link
              href="/register"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)] w-full sm:w-auto justify-center"
            >
              Start for free <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
            >
              <Play className="w-5 h-5 fill-white/80" /> See how it works
            </a>
          </motion.div>

          <motion.p variants={itemVariants} className="text-sm text-zinc-500">
            No credit card required &middot; Free forever plan
          </motion.p>
        </motion.div>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-2 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="rounded-xl overflow-hidden bg-zinc-950 border border-white/5 aspect-video flex flex-col">
              {/* Mockup Header */}
              <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                </div>
                <div className="mx-auto w-48 h-6 bg-zinc-900 rounded-md border border-white/5" />
              </div>
              {/* Mockup Content */}
              <div className="flex-1 p-8 grid grid-cols-3 gap-6 opacity-80">
                <div className="col-span-2 space-y-6">
                  <div className="h-48 bg-zinc-900 rounded-xl border border-white/5 p-4 flex items-end gap-2 justify-between">
                    {[40, 70, 45, 90, 65, 30, 85].map((h, i) => (
                      <div key={i} className="w-full bg-emerald-500/20 rounded-t-sm" style={{ height: `${h}%` }}>
                        <div className="w-full bg-emerald-500 rounded-t-sm" style={{ height: '4px' }} />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-24 bg-zinc-900 rounded-xl border border-white/5 p-4 flex items-center gap-4">
                       <div className="p-3 bg-blue-500/10 rounded-lg"><BarChart className="w-6 h-6 text-blue-500" /></div>
                       <div><div className="w-20 h-4 bg-zinc-800 rounded mb-2"/><div className="w-12 h-6 bg-zinc-700 rounded"/></div>
                    </div>
                    <div className="h-24 bg-zinc-900 rounded-xl border border-white/5 p-4 flex items-center gap-4">
                       <div className="p-3 bg-emerald-500/10 rounded-lg"><Leaf className="w-6 h-6 text-emerald-500" /></div>
                       <div><div className="w-24 h-4 bg-zinc-800 rounded mb-2"/><div className="w-16 h-6 bg-zinc-700 rounded"/></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-full bg-zinc-900 rounded-xl border border-white/5 p-4 flex flex-col gap-4">
                    <div className="w-32 h-5 bg-zinc-800 rounded" />
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-zinc-800" />
                         <div className="space-y-2 flex-1"><div className="w-full h-3 bg-zinc-800 rounded"/><div className="w-2/3 h-3 bg-zinc-800 rounded"/></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
