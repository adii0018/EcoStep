"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Log Your Day",
      description: "Add your travel, meals, and energy use. Takes under 60 seconds.",
    },
    {
      number: "02",
      title: "Get Insights",
      description: "Our AI analyzes your habits and shows exactly where to cut down.",
    },
    {
      number: "03",
      title: "Take Action",
      description: "Follow personalized tips and watch your footprint shrink week by week.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Start reducing in 3 simple steps
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-white/10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-zinc-950 border border-emerald-500/30 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)] mb-8">
                  <span className="text-4xl font-bold bg-gradient-to-br from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
