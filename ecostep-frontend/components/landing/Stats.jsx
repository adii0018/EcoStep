"use client";

import { motion } from "framer-motion";

export default function Stats() {
  const stats = [
    { label: "Active Users", value: "10,000+" },
    { label: "CO₂ Tracked", value: "2.4M kg" },
    { label: "Countries", value: "180+" },
    { label: "App Rating", value: "4.9★" },
  ];

  return (
    <section className="py-12 border-y border-white/10 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
