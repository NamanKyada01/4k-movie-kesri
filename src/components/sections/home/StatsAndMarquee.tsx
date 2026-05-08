"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Counter({ end, label, suffix = "" }: { end: number, label: string, suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 2000;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);

      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end]);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-2">
        <div className="absolute inset-0 bg-[#D4A017] opacity-20 blur-xl rounded-full" />
        <span className="relative font-[family-name:var(--font-heading)] text-5xl md:text-6xl text-[#F5D76E] font-bold">
          {count}{suffix}
        </span>
      </div>
      <span className="font-[family-name:var(--font-body)] text-[#C8C0B0] text-sm uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function StatCounters() {
  return (
    <section className="section bg-[#060606] relative z-10 border-b border-[#D4A017]/10">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#D4A017]/10">
          <Counter end={500} label="Events" suffix="+" />
          <Counter end={4} label="Resolution" suffix="K" />
          <Counter end={5} label="Rating" suffix="★" />
          <Counter end={48} label="Delivery" suffix="h" />
        </div>
      </div>
    </section>
  );
}

const row1 = [
  { icon: "💍", name: "Weddings" },
  { icon: "💑", name: "Pre-Wedding" },
  { icon: "🏢", name: "Corporate" },
  { icon: "📸", name: "Portraits" },
  { icon: "🛍️", name: "Products" },
  { icon: "🎬", name: "Videography" },
];

const row2 = [
  { icon: "📺", name: "LED Screens" },
  { icon: "🎥", name: "Crane Shots" },
  { icon: "📡", name: "Live Telecast" },
  { icon: "▶️", name: "YouTube Live" },
  { icon: "👥", name: "Facebook Live" },
  { icon: "✨", name: "Post-Wedding" },
];

export function InfiniteMarquee() {
  return (
    <section className="py-16 bg-[#060606] border-b border-[#D4A017]/10 overflow-hidden relative">
      {/* Row 1 - Left */}
      <div className="flex mb-8 w-[200%] animate-[slide_40s_linear_infinite]">
        {[...row1, ...row1, ...row1].map((item, i) => (
          <div key={`r1-${i}`} className="flex-none px-4">
            <div className="px-6 py-3 rounded-full bg-[#141414] border border-[#D4A017]/20 flex items-center gap-3 hover:border-[#D4A017]/50 transition-colors">
              <span className="text-xl">{item.icon}</span>
              <span className="font-[family-name:var(--font-body)] text-[#FAFAF8] font-medium">{item.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 - Right */}
      <div className="flex w-[200%] animate-[slide-right_40s_linear_infinite]">
        {[...row2, ...row2, ...row2].map((item, i) => (
          <div key={`r2-${i}`} className="flex-none px-4">
            <div className="px-6 py-3 rounded-full bg-[#141414] border border-[#D4A017]/20 flex items-center gap-3 hover:border-[#D4A017]/50 transition-colors">
              <span className="text-xl">{item.icon}</span>
              <span className="font-[family-name:var(--font-body)] text-[#FAFAF8] font-medium">{item.name}</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes slide-right {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}