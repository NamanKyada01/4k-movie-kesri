"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { SplitTextReveal } from "@/components/scroll/SplitTextReveal";
import { ScrollParticles } from "@/components/scroll/ScrollParticles";

export function ScrollCta({ text }: { text?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-10%" });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (isInView && !revealed) setRevealed(true);
  }, [isInView, revealed]);

  return (
    <section ref={sectionRef} className="scroll-cta-section">
      {/* ── Atmospheric Onyx Sparks (Drifting, not following cursor) ── */}
      <ScrollParticles count={60} />

      {/* Static ambient glow instead of mouse flare */}
      <div className="cta-ambient-glow" />

      {/* Top glow line */}
      <div className="scroll-cta-topline" />

      {/* ── Clip-path circle reveal ── */}
      <motion.div
        className="scroll-cta-reveal-mask"
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={revealed ? { clipPath: "circle(150% at 50% 50%)" } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="scroll-cta-reveal-bg" />
      </motion.div>

      <div className="container scroll-cta-inner">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <br />
          <span className="badge badge-accent" style={{ fontSize: "0.72rem", padding: "7px 18px" }}>
            ✦ Limited Slots Available for 2026
          </span>
        </motion.div>

        {/* Headline */}
        <h2 className="scroll-cta-headline">
          <SplitTextReveal text="Ready to Tell" delay={0.4} stagger={0.09} />
          <br />
          <span className="text-gradient-gold">
            <SplitTextReveal text="Your Story?" delay={0.7} stagger={0.09} />
          </span>
        </h2>

        {/* Subtext */}
        <motion.p
          className="scroll-cta-subtext"
          initial={{ opacity: 0, y: 16 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {text || "Wedding, corporate, portrait or live event — we'd love to capture your moments in cinematic 4K."}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="scroll-cta-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
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
          animate={revealed ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.1 }}
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
        .cta-ambient-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 800px; height: 400px;
          background: radial-gradient(ellipse, rgba(212,160,23,0.04) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          filter: blur(80px);
        }
        .scroll-cta-reveal-mask {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .scroll-cta-reveal-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 100%, rgba(212,160,23,0.06) 0%, transparent 70%);
        }
        .cta-scene-label {
          display: inline-block;
          font-size: 0.6rem;
          font-weight: 800;
          color: #060606;
          background: var(--gold);
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-2);
        }
        .scroll-cta-section {
          position: relative;
          overflow: hidden;
          padding-block: clamp(6rem, 15vw, 10rem);
          text-align: center;
          background: #030303;
        }
        .scroll-cta-topline {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), var(--gold), var(--accent), transparent);
          z-index: 2;
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
          font-size: clamp(2rem, 6vw, 3.8rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.04em;
        }
        .scroll-cta-subtext {
          color: var(--text-muted);
          font-size: 1.1rem;
          max-width: 550px;
          line-height: 1.7;
        }
        .scroll-cta-buttons {
          display: flex;
          gap: var(--space-4);
          justify-content: center;
          flex-wrap: wrap;
          align-items: center;
          margin-top: var(--space-4);
        }
        .scroll-cta-btn-primary {
          border-radius: var(--radius-full) !important;
          box-shadow: 0 15px 45px rgba(212,160,23,0.2) !important;
          position: relative;
          z-index: 1;
        }
        .scroll-cta-proof {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-wrap: wrap;
          justify-content: center;
          margin-top: var(--space-4);
        }
      `}</style>
    </section>
  );
}
