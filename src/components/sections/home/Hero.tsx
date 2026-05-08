"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useScrollPercent } from "@/components/ui/ScrollProgress";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full h-[100svh] flex flex-col justify-center overflow-hidden bg-[#060606]">
      {/* Background Image & Ken Burns */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 15, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/80 via-[#060606]/60 to-[#060606] z-10" />
        <img
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80"
          alt="Cinematic Wedding"
          className="object-cover w-full h-full opacity-60"
        />
      </motion.div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="cinema-orb orb-gold orb-pulse w-[400px] h-[400px] top-[10%] left-[15%]" />
        <div className="cinema-orb orb-amber orb-pulse-delayed w-[500px] h-[500px] bottom-[10%] right-[10%]" />
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <span className="text-[12px] uppercase tracking-[0.15em] text-[#D4A017] font-semibold flex items-center gap-2 justify-center">
            <span className="w-8 h-[1px] bg-[#D4A017]/50" />
            Surat's Premier Studio
            <span className="w-8 h-[1px] bg-[#D4A017]/50" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-[80px] leading-[1.1] tracking-[-0.03em] text-[#FAFAF8] mb-6 max-w-4xl"
        >
          We Don't Just Capture Moments. <br />
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] via-[#F5D76E] to-[#D4A017] animate-gold-shimmer">
            We Direct Them.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-[family-name:var(--font-body)] text-lg md:text-xl text-[#C8C0B0] max-w-2xl mb-10 font-light"
        >
          Cinema-grade 4K photography & videography for weddings, corporate events, and portraits across Gujarat.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6"
        >
          <Link href="/contact" className="btn btn-primary btn-lg rounded-full">
            Book a Session →
          </Link>
          <Link href="/portfolio" className="btn btn-ghost btn-lg rounded-full border-[#D4A017]/30 text-white hover:border-[#D4A017]">
            View Portfolio
          </Link>
        </motion.div>
      </div>

      {/* Floating Stats Glass Card */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-10 left-4 md:left-10 z-20 hidden md:block"
      >
        <div className="glass rounded-[20px] p-4 flex items-center gap-4 text-sm font-[family-name:var(--font-body)] text-[#FAFAF8] border-[#D4A017]/20 border">
          <div className="flex flex-col border-r border-[#D4A017]/20 pr-4">
            <span className="font-bold text-[#D4A017]">500+</span>
            <span className="text-xs text-[#6B6358] uppercase tracking-wider">Events</span>
          </div>
          <div className="flex flex-col border-r border-[#D4A017]/20 pr-4">
            <span className="font-bold text-[#D4A017]">4K</span>
            <span className="text-xs text-[#6B6358] uppercase tracking-wider">Quality</span>
          </div>
          <div className="flex flex-col border-r border-[#D4A017]/20 pr-4">
            <span className="font-bold text-[#D4A017]">5★</span>
            <span className="text-xs text-[#6B6358] uppercase tracking-wider">Rated</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#D4A017]">48h</span>
            <span className="text-xs text-[#6B6358] uppercase tracking-wider">Delivery</span>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-[#D4A017]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="text-[#D4A017]" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
