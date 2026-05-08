"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function TrustBar() {
  const items = [
    "50+ Industry Awards",
    "Sony & Canon Cinema Gear",
    "500+ Events Delivered",
    "48-Hour Turnaround",
    "4K Cinematic Quality",
    "5-Star Rated Studio"
  ];

  return (
    <div className="w-full bg-[#0C0C0C] border-y border-[#D4A017]/20 py-6 overflow-hidden relative">
      <div className="flex w-[200%] animate-[slide_30s_linear_infinite]">
        <div className="flex w-1/2 justify-around items-center px-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-[#D4A017]">✦</span>
              <span className="font-[family-name:var(--font-mono)] text-sm text-[#C8C0B0] uppercase tracking-wider">{item}</span>
            </div>
          ))}
        </div>
        <div className="flex w-1/2 justify-around items-center px-4">
          {items.map((item, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-[#D4A017]">✦</span>
              <span className="font-[family-name:var(--font-mono)] text-sm text-[#C8C0B0] uppercase tracking-wider">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export function ThreeDScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const textScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.5, 2]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);
  const yPos = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={containerRef} className="relative h-[150vh] bg-[#060606] overflow-hidden">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Parallax layers could go here */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,160,23,0.15)_0%,rgba(6,6,6,1)_70%)]" />

        <motion.div
          style={{ scale: textScale, opacity: textOpacity, y: yPos }}
          className="z-10 perspective-[1000px]"
        >
          <h2
            className="font-[family-name:var(--font-heading)] font-black text-[15vw] leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#F5D76E] to-[#D4A017]/30 text-center"
            style={{ transformStyle: "preserve-3d", transform: "rotateX(20deg)" }}
          >
            KESRI
          </h2>
        </motion.div>

        {/* Cinematic Letterbox Bars */}
        <div className="absolute top-0 left-0 right-0 h-[10vh] bg-black z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-[10vh] bg-black z-20" />
      </div>
    </section>
  );
}