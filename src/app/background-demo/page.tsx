'use client';

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ArtisticBackground from "@/components/ui/ArtisticBackground";
import { useState } from "react";
import { Shield, Sparkles } from "lucide-react";

export default function BackgroundDemo() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Background is already in Layout, but we can double up or just show the interaction */}
      <main className="flex-grow flex items-center justify-center p-6 relative">
        <div className="max-w-md w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-10 rounded-3xl border border-white/20 dark:border-slate-800/50 shadow-2xl text-center space-y-8 animate-fade-in">
          <div className="w-20 h-20 bg-sky-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-sky-600/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Artistic Background
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Click to interact and see how the matte organic shapes blend with your theme.
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => setCount(prev => prev + 1)}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-xl shadow-sky-600/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Interaction Counter: {count}
            </button>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
              Shapes refresh randomly on theme toggle
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
