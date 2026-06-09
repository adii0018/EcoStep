"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "I reduced my carbon footprint by 30% in just 2 months. The AI tips are incredibly actionable!",
      author: "Priya S.",
      city: "Bangalore",
      initial: "P",
      color: "bg-purple-500",
    },
    {
      quote: "Finally an app that understands Indian lifestyle. The LPG and local transport tracking is spot on.",
      author: "Arjun M.",
      city: "Mumbai",
      initial: "A",
      color: "bg-blue-500",
    },
    {
      quote: "The weekly challenges made sustainability fun. My whole family uses EcoStep now.",
      author: "Sneha K.",
      city: "Pune",
      initial: "S",
      color: "bg-emerald-500",
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Loved by eco-warriors
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-lg text-zinc-300 leading-relaxed mb-8">
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center text-white font-bold text-xl`}>
                  {testimonial.initial}
                </div>
                <div>
                  <h4 className="font-bold text-white">{testimonial.author}</h4>
                  <p className="text-sm text-zinc-500">{testimonial.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
