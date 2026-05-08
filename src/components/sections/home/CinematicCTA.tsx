"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CinematicCTA() {
  return (
    <section className="py-32 bg-[#060606] relative overflow-hidden flex items-center justify-center min-h-[80vh]">
      {/* Ghost Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-[family-name:var(--font-heading)] font-black text-white/[0.03] whitespace-nowrap pointer-events-none select-none z-0">
        LEGACY
      </div>

      {/* Gold Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A017] to-transparent opacity-50" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F5D76E] to-transparent blur-[2px] opacity-80" />

      <div className="container relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#C8102E]/20 border border-[#C8102E]/50 text-[#C8102E] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8">
            <span className="animate-pulse">✦</span>
            Limited Slots Available for 2026
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-[80px] font-[family-name:var(--font-heading)] text-[#FAFAF8] leading-tight mb-8">
            Ready to Tell <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] via-[#F5D76E] to-[#D4A017] animate-gold-shimmer">
              Your Story?
            </span>
          </h2>

          <p className="text-[#C8C0B0] text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light">
            Don't let your memories fade. Secure your date with Surat's most trusted cinematic storytelling team.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link href="/contact" className="btn btn-primary btn-xl rounded-full w-full sm:w-auto">
              Book a Session
            </Link>
            <Link href="/portfolio" className="btn btn-ghost btn-xl rounded-full w-full sm:w-auto border-[#D4A017]/30 text-white hover:border-[#D4A017]">
              View Portfolio
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className="text-[#D4A017] drop-shadow-[0_0_8px_rgba(212,160,23,0.5)]">★</span>
              ))}
            </div>
            <p className="text-[#6B6358] text-sm">Rated 5/5 by 500+ clients across Gujarat</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}