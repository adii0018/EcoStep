"use client";

import { motion } from "framer-motion";

export default function AuthCard({ children, shake }) {
  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    shake: {
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate={shake ? ["animate", "shake"] : "animate"}
      className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
