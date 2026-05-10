"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Star } from "lucide-react";
import { ScrollParticles } from "@/components/scroll/ScrollParticles";
import { SplitTextReveal } from "@/components/scroll/SplitTextReveal";

export function ScrollCta({ text }: { text?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15% 0px -15% 0px" });

  return (
    <section ref={sectionRef} className="scroll-cta-section">
      {/* Floating gold particles */}
      <ScrollParticles count={32} />

      {/* Top glow line */}
      <div className="scroll-cta-topline" />

      {/* Radial vignette that pulses on entry */}
      <motion.div
        className="scroll-cta-vignette"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: [0, 0.55, 0.35] } : {}}
        transition={{ duration: 2.2, times: [0, 0.4, 1], ease: "easeOut" }}
      />

      <div className="container scroll-cta-inner">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="badge badge-accent" style={{ fontSize: "0.72rem", padding: "7px 18px" }}>
            ✦ Limited Slots Available for 2026
          </span>
        </motion.div>

        {/* Headline — word split reveal */}
        <h2 className="scroll-cta-headline">
          <SplitTextReveal text="Ready to Tell" delay={0.25} stagger={0.09} />
          <br />
          <span className="text-gradient-gold">
            <SplitTextReveal text="Your Story?" delay={0.55} stagger={0.09} />
          </span>
        </h2>

        {/* Subtext */}
        <motion.p
          className="scroll-cta-subtext"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {text || "Wedding, corporate, portrait or live event — we'd love to capture your moments in cinematic 4K."}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="scroll-cta-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.72 }}
        >
          <Link href="/contact" className="btn btn-primary btn-xl scroll-cta-btn-primary">
            Book a Session <ArrowRight size={16} />
          </Link>
          <Link href="/portfolio" className="btn btn-ghost btn-xl">
            View Portfolio
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="scroll-cta-proof"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
        >
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />
            ))}
          </div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Rated 5/5 by <strong style={{ color: "var(--gold)", fontWeight: 700 }}>500+ clients</strong> across Gujarat
          </span>
        </motion.div>
      </div>

      <style>{`
        .scroll-cta-section {
          position: relative;
          overflow: hidden;
          padding-block: clamp(5rem, 12vw, 9rem);
          text-align: center;
        }
        .scroll-cta-topline {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), var(--gold), var(--accent), transparent);
          z-index: 2;
        }
        .scroll-cta-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(212,160,23,0.06) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .scroll-cta-inner {
          position: relative;
          z-index: 3;
          max-width: 760px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-6);
        }
        .scroll-cta-headline {
          font-family: var(--font-heading);
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 700;
          line-height: 1.0;
          letter-spacing: -0.03em;
        }
        .scroll-cta-subtext {
          color: var(--text-muted);
          font-size: 1.05rem;
          max-width: 520px;
          line-height: 1.7;
        }
        .scroll-cta-buttons {
          display: flex;
          gap: var(--space-4);
          justify-content: center;
          flex-wrap: wrap;
        }
        .scroll-cta-btn-primary {
          border-radius: var(--radius-full) !important;
          box-shadow: 0 12px 40px rgba(212,160,23,0.35) !important;
        }
        .scroll-cta-proof {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-wrap: wrap;
          justify-content: center;
        }
      `}</style>
    </section>
  );
}
