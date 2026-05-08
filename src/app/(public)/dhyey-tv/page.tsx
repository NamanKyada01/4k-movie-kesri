"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { PL_SCHEDULE } from "@/lib/data/placeholder";

export default function DhyeyTVPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(PL_SCHEDULE.map(s => s.type)))];
  const filteredSchedule = activeFilter === "All" ? PL_SCHEDULE : PL_SCHEDULE.filter(s => s.type === activeFilter);

  // Global Saffron Color override for this specific page
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-2', '#E8550A');
    document.documentElement.style.setProperty('--accent-2-muted', 'rgba(232, 85, 10, 0.1)');
    return () => {
      document.documentElement.style.setProperty('--accent-2', '#C8102E'); // Revert to Crimson
      document.documentElement.style.setProperty('--accent-2-muted', 'rgba(200, 16, 46, 0.1)');
    };
  }, []);

  return (
    <main className="bg-[#060606] min-h-screen text-[#FAFAF8] relative overflow-hidden">

      {/* Three.js Style CSS Particle System approximation for Hero */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(232,85,10,0.15),transparent_60%)] blur-3xl" />
        <div className="absolute top-[20%] left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(212,160,23,0.1),transparent_60%)] blur-3xl" />
      </div>

      <section className="pt-32 pb-20 relative z-10 text-center">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* LIVE Badge */}
            <div className="inline-flex items-center gap-2 bg-[#C8102E] px-4 py-1.5 rounded-full mb-8 shadow-[0_0_20px_rgba(200,16,46,0.5)]">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-bold uppercase tracking-widest">LIVE 24×7</span>
            </div>

            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-[90px] mb-4 text-transparent bg-clip-text bg-gradient-to-b from-[#D4A017] to-[#E8550A] leading-tight drop-shadow-lg">
              DHYEY TV
            </h1>

            <h2 className="font-[family-name:var(--font-body)] text-[#C8C0B0] text-lg md:text-xl font-medium tracking-wide mb-12">
              ॥ ધ્યેય ટીવી ॥ <span className="mx-2 opacity-50">•</span> Gujarati Religious Channel
            </h2>

            {/* Video Player Embed */}
            <div className="w-full max-w-[900px] mx-auto rounded-[20px] bg-[#141414] border border-[#D4A017]/30 border-t-[#D4A017] border-t-2 shadow-[0_0_50px_rgba(232,85,10,0.15)] overflow-hidden relative group">
              <div className="aspect-video relative">
                {/* Fallback Image */}
                <img
                  src="https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&q=80&w=1200"
                  alt="Dhyey TV Live Stream"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#E8550A] flex items-center justify-center cursor-pointer transform transition-transform group-hover:scale-110 shadow-[0_0_30px_rgba(232,85,10,0.5)]">
                    <Play fill="white" className="text-white ml-1 w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="bg-[#1C1C1C] px-6 py-4 flex justify-between items-center border-t border-[#333]">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Dhyey TV Live</span>
                </div>
                <Link href="#" className="text-[#D4A017] text-sm font-medium hover:text-white transition-colors flex items-center gap-1">
                  Watch on YouTube <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Strip */}
      <section className="py-12 border-y border-[#333] bg-[#0A0A0A] relative z-10">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-x divide-[#333]">
            {[
              { label: "Channel", val: "Dhyey TV" },
              { label: "Broadcast", val: "24×7 Live" },
              { label: "Content", val: "Religious" },
              { label: "Programs", val: "6 Shows" },
              { label: "Coverage", val: "Bhajan & Katha" }
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col items-center text-center ${i === 0 ? '' : 'pl-6'}`}>
                <span className="text-[#6B6358] text-xs uppercase tracking-widest font-semibold mb-2">{stat.label}</span>
                <span className="text-[#FAFAF8] font-medium">{stat.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Grid */}
      <section className="py-24 relative z-10">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-[#E8550A] text-sm font-semibold uppercase tracking-widest mb-2 block">Daily Broadcast</span>
              <h3 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl">Program Schedule</h3>
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeFilter === cat
                      ? 'bg-[#E8550A] text-white shadow-[0_0_15px_rgba(232,85,10,0.4)]'
                      : 'bg-[#141414] text-[#C8C0B0] border border-[#333] hover:border-[#E8550A]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredSchedule.map((prog, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={prog.id}
                  className="bg-[#141414] rounded-2xl p-6 relative overflow-hidden border border-[#333]"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    prog.color === 'gold' ? 'bg-[#D4A017]' :
                    prog.color === 'saffron' ? 'bg-[#E8550A]' :
                    'bg-[#8B5CF6]'
                  }`} />

                  <div className="flex justify-between items-start mb-4">
                    <span className="font-[family-name:var(--font-mono)] text-[#C8C0B0] font-medium tracking-wide">
                      {prog.time}
                    </span>
                    <span className="bg-[#1C1C1C] border border-[#333] px-2 py-1 rounded text-[10px] uppercase font-bold text-[#6B6358]">
                      Today
                    </span>
                  </div>

                  <h4 className="font-[family-name:var(--font-heading)] text-xl text-[#FAFAF8] mb-6 pr-4">
                    {prog.title}
                  </h4>

                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${
                    prog.color === 'gold' ? 'bg-[#D4A017]/10 text-[#D4A017]' :
                    prog.color === 'saffron' ? 'bg-[#E8550A]/10 text-[#E8550A]' :
                    'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                  }`}>
                    {prog.type}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-[#0A0A0A] border-t border-[#333] text-center relative z-10">
        <div className="container max-w-3xl">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[#E8550A] mb-8">
            ॥ ધ્યેય ટીવી ॥
          </h2>
          <p className="text-[#C8C0B0] text-lg font-light leading-relaxed mb-10">
            Dhyey TV is a 24/7 Gujarati devotional channel bringing the profound spiritual heritage of India directly to your screens. From live Ram Katha to mesmerizing Bhajans and Sant Vani, experience divine connection continuously.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#" className="btn rounded-full bg-[#E8550A] text-white hover:bg-[#C2410C] px-8 py-3 font-semibold shadow-[0_0_20px_rgba(232,85,10,0.3)]">
              Watch on YouTube →
            </Link>
            <Link href="/contact" className="btn rounded-full border border-[#333] hover:border-[#E8550A]/50 text-white px-8 py-3 font-semibold">
              Contact Studio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}