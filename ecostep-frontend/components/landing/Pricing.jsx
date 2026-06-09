"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "FREE",
      price: "₹0",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "Track up to 50 activities/month",
        "Basic dashboard",
        "3 AI tips/week",
        "Community access",
      ],
      buttonText: "Get started free",
      buttonStyle: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
      href: "/register",
      popular: false,
    },
    {
      name: "PRO",
      price: "₹199",
      period: "/month",
      description: "For serious eco-warriors",
      features: [
        "Unlimited tracking",
        "Full AI insights & analysis",
        "Weekly challenges",
        "Export reports",
        "Priority support",
      ],
      buttonText: "Start free trial",
      buttonStyle: "bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]",
      href: "/register",
      popular: true,
    },
    {
      name: "TEAMS",
      price: "₹499",
      period: "/user/month",
      description: "For small businesses",
      features: [
        "Everything in Pro",
        "Up to 10 members",
        "Team leaderboard",
        "Corporate reports",
        "Dedicated account manager",
      ],
      buttonText: "Contact us",
      buttonStyle: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
      href: "#contact",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5, delay: 0.1 }}
             className="text-xl text-zinc-400"
          >
            Choose the plan that fits your eco-journey
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: plan.popular ? 1.05 : 1.02 }}
              className={`relative rounded-3xl p-8 backdrop-blur-sm transition-transform ${
                plan.popular 
                  ? "bg-zinc-900 border border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.15)] md:-my-4" 
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-zinc-400 text-sm mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-zinc-500">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
