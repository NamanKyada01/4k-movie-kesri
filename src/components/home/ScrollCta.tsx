"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

import { ArrowRight, Star } from "lucide-react";
import { SplitTextReveal } from "@/components/scroll/SplitTextReveal";
import { ScrollParticles } from "@/components/scroll/ScrollParticles";

export function ScrollCta({ text }: { text?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);


  return (
    <section className="scroll-cta-section">
      {/* Golden Sparks Background */}
      <ScrollParticles count={40} />

      {/* Interactive Mouse Flare */}
      <motion.div 
        className="cta-mouse-flare"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />


      {/* Top glow line */}
      <div className="scroll-cta-topline" />



      <div className="container scroll-cta-inner">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="cta-scene-label">SCENE 04</div>
          <br />
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {text || "Wedding, corporate, portrait or live event — we'd love to capture your moments in cinematic 4K."}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="scroll-cta-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
          animate={{ opacity: 1 }}
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
        .cta-mouse-flare {
          position: fixed;
          top: 0; left: 0;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(212,160,23,0.06) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          filter: blur(80px);
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
          line-height: 1.15;
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
