import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30 font-sans dark relative overflow-hidden flex flex-col">
      {/* Background glow & pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <header className="relative z-10 w-full p-6 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        
        <Link href="/" className="flex items-center gap-2 group absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
            <Leaf className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white hidden sm:block">EcoStep</span>
        </Link>
        
        <div className="w-24 hidden md:block" /> {/* Balancer */}
      </header>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {children}
      </main>
    </div>
  );
}
