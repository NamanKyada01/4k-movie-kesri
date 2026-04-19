"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import BlurText from "@/components/ui/BlurText";


// Stats data
const stats = [
  { number: "500+",  label: "Events Covered" },
  { number: "10K+",  label: "Photos Delivered" },
  { number: "8+",    label: "Years Experience" },
  { number: "50+",   label: "Awards Won" },
];

// Background ambient orbs
function AmbientOrbs() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "50vw",
          height: "50vw",
          maxWidth: 700,
          maxHeight: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,85,10,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "40vw",
          height: "40vw",
          maxWidth: 600,
          maxHeight: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}

// Floating number animation
function AnimatedStat({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ textAlign: "center" }}
    >
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
          color: "var(--text-primary)",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {number}
      </div>
      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </div>
    </motion.div>
  );
}

export function HeroSection({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        background: "transparent",
        marginTop: "calc(var(--nav-height) * -1)",
        paddingTop: "var(--nav-height)",
      }}
    >
      {/* Main Content */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 3,
          textAlign: "center",
          paddingTop: "clamp(2rem, 6vw, 6rem)",
          paddingBottom: "clamp(2rem, 4vw, 4rem)",
        }}
      >
        {/* Pre-title badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{ marginBottom: "var(--space-5)", display: "flex", justifyContent: "center" }}
        >
          <span
            className="badge badge-accent"
            style={{ fontSize: "0.7rem", padding: "6px 16px" }}
          >
            ✦ Surat&apos;s Premier Photography Studio ✦
          </span>
        </motion.div>

        {/* Headline */}
        <div
          style={{
            marginBottom: "var(--space-5)",
            maxWidth: 900,
            marginInline: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {title || (
            <>
              <BlurText
                text="We Capture Moments"
                delay={0.06}
                animateBy="words"
                direction="bottom"
                className="hero-title-blur"
              />
              <BlurText
                text="That Last Forever"
                delay={0.06}
                animateBy="words"
                direction="bottom"
                className="hero-title-blur accent-text"
              />
            </>
          )}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            fontSize: "clamp(0.85rem, 1.8vw, 1.15rem)",
            color: "var(--text-muted)",
            marginBottom: "var(--space-8)",
            maxWidth: 520,
            marginInline: "auto",
            lineHeight: 1.5,
          }}
          className="hero-tagline"
        >
          {subtitle || (
            <>
              4K Cinematic Photography & Videography · Surat, Gujarat
              <br />
              Weddings · Events · Portraits · Corporate · Products
            </>
          )}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            display: "flex",
            gap: "var(--space-3)",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "var(--space-16)",
          }}
        >
          <Link href="/gallery" className="btn btn-primary hero-cta-btn">
            View Our Work
            <ArrowRight size={16} />
          </Link>
          <Link href="/contact" className="btn btn-ghost hero-cta-btn">
            Book a Session
          </Link>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "var(--space-6)",
            maxWidth: 600,
            marginInline: "auto",
            padding: "var(--space-6)",
            background: "var(--bg-glass)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid var(--bg-glass-border)",
            borderRadius: "var(--radius-2xl)",
          }}
          className="hero-stats"
        >
          {stats.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          color: "var(--text-muted)",
          opacity: scrollY > 50 ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>

      <style>{`
        .hero-title-blur {
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: clamp(2rem, 6vw, 4.2rem);
          line-height: 1.1;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: var(--text-primary);
          justify-content: center;
        }
        .hero-title-blur.accent-text {
          color: var(--accent);
        }
        @media (max-width: 768px) {
          .hero-title-blur { font-size: 2.2rem; }
          .hero-tagline { font-size: 0.85rem !important; max-width: 320px !important; }
          .hero-cta-btn { padding: 10px 20px !important; font-size: 0.82rem !important; height: auto !important; }
          .hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
           .hero-title-blur { font-size: 1.8rem; }
        }
      `}</style>
    </section>
  );
}
