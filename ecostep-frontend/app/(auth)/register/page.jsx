"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";
import { Leaf } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [shake, setShake] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    const token = Cookies.get("ecostep_token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleError = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400); // Reset shake after animation
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 p-4 pt-12 lg:pt-4">
      {/* Left side: Decorative section (Desktop only) */}
      <div className="hidden lg:flex flex-1 flex-col justify-center relative min-h-[600px]">
        <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
            Join 10,000+ <br /> eco warriors 🌍
          </h1>
          <p className="text-lg text-zinc-400 mb-10 max-w-md">
            Start tracking your carbon footprint today. Free forever.
          </p>

          {/* Benefit Pills */}
          <div className="flex flex-col gap-3">
            {[
              "✅ Free forever plan",
              "🤖 AI-powered insights",
              "📊 Beautiful dashboard"
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="w-fit px-4 py-2 bg-white/5 border border-white/10 rounded-full text-zinc-300 font-medium backdrop-blur-sm shadow-sm"
              >
                {stat}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating preview element */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-12 top-1/2 -translate-y-1/2 w-64 h-80 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl hidden xl:flex flex-col gap-4"
        >
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-500" />
             </div>
             <div>
                <div className="w-20 h-3 bg-zinc-800 rounded-full mb-1" />
                <div className="w-12 h-2 bg-zinc-800 rounded-full" />
             </div>
          </div>
          <div className="flex-1 bg-zinc-800/50 rounded-xl border border-white/5 p-4 flex flex-col gap-2">
             <div className="w-full h-4 bg-zinc-700 rounded-sm" />
             <div className="w-3/4 h-4 bg-zinc-700 rounded-sm" />
             <div className="w-1/2 h-4 bg-zinc-700 rounded-sm" />
          </div>
          <div className="h-24 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-end p-2 gap-1">
             <div className="flex-1 bg-emerald-500/40 rounded-t h-[30%]" />
             <div className="flex-1 bg-emerald-500/60 rounded-t h-[60%]" />
             <div className="flex-1 bg-emerald-500 rounded-t h-[90%]" />
             <div className="flex-1 bg-emerald-500/50 rounded-t h-[40%]" />
          </div>
        </motion.div>
      </div>

      {/* Right side: Register Form */}
      <div className="flex-1 w-full max-w-md mx-auto relative z-10">
        {/* Mobile Logo Header */}
        <div className="flex lg:hidden justify-center items-center gap-2 mb-8">
          <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
            <Leaf className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">EcoStep</span>
        </div>

        <AuthCard shake={shake}>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
            <p className="text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Sign in &rarr;
              </Link>
            </p>
          </div>
          <RegisterForm onError={handleError} />
        </AuthCard>
      </div>
    </div>
  );
}
