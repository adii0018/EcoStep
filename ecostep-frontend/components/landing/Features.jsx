"use client";

import { motion } from "framer-motion";
import { Leaf, Brain, BarChart, Users, Trophy, MapPin } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Leaf className="w-6 h-6 text-emerald-400" />,
      title: "Track Activities",
      description: "Log travel, food, energy and shopping in seconds",
    },
    {
      icon: <Brain className="w-6 h-6 text-emerald-400" />,
      title: "AI-Powered Tips",
      description: "Get personalized suggestions from Claude AI to reduce your footprint",
    },
    {
      icon: <BarChart className="w-6 h-6 text-emerald-400" />,
      title: "Visual Dashboard",
      description: "Beautiful charts showing your weekly and monthly progress",
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      title: "Compare & Compete",
      description: "See how you compare to India and global averages",
    },
    {
      icon: <Trophy className="w-6 h-6 text-emerald-400" />,
      title: "Weekly Challenges",
      description: "Fun eco-challenges to build sustainable habits",
    },
    {
      icon: <MapPin className="w-6 h-6 text-emerald-400" />,
      title: "India-Specific Data",
      description: "Emission factors calibrated for Indian lifestyle and grid",
    },
  ];

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
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Everything you need to go green
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-zinc-400"
          >
            Simple tools. Powerful insights. Real impact.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-emerald-500/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
