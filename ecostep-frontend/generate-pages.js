const fs = require('fs');
const path = require('path');

const pages = ['about', 'blog', 'careers', 'press', 'changelog', 'privacy', 'terms', 'cookies'];

pages.forEach(p => {
  const dir = path.join('app', p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const title = p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' ');
  const componentName = title.replace(' ', '') + 'Page';
  
  const content = `"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ${componentName}() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden dark">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">${title}</h1>
        <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
          <p className="text-xl text-zinc-400 mb-4">We're still working on this page.</p>
          <p className="text-zinc-500">Check back soon for updates regarding our ${title.toLowerCase()}.</p>
        </div>

        <div className="pt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, 'page.jsx'), content);
});
console.log("Created 8 placeholder pages successfully.");
