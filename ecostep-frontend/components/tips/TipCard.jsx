"use client";

export default function TipCard({ tip }) {
  return (
    <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="flex items-start gap-4 relative z-10">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner group-hover:bg-zinc-800/80 transition-colors">
          {tip.icon || "🌿"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <h3 className="text-base font-semibold text-white">{tip.title}</h3>
            {tip.savingKg != null && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                Save {tip.savingKg.toFixed(1)} kg CO₂
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{tip.description}</p>
        </div>
      </div>
    </div>
  );
}
