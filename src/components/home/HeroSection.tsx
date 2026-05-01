"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  { number: "500+", label: "Events" },
  { number: "10K+", label: "Photos" },
  { number: "8+",   label: "Years" },
  { number: "50+",  label: "Awards" },
];

export function HeroSection({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero-section">
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 3,
          textAlign: "center",
          paddingTop: "clamp(1.5rem, 5vw, 5rem)",
          paddingBottom: "clamp(1.5rem, 4vw, 4rem)",
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.55 }}
          style={{ marginBottom: "var(--space-5)", display: "flex", justifyContent: "center" }}
        >
          <span className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Surat&apos;s Premier Photography Studio
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.65 }}
          style={{ marginBottom: "var(--space-4)", maxWidth: 820, marginInline: "auto" }}
        >
          {title ? (
            <h1 className="hero-headline">{title}</h1>
          ) : (
            <h1 className="hero-headline">
              <span className="hero-line1">We Capture Moments</span>
              <span className="hero-line2">That Last Forever</span>
            </h1>
          )}
        </motion.div>

        {/* Gold rule divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.38, duration: 0.6 }}
          className="hero-rule"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.55 }}
          className="hero-tagline"
        >
          {subtitle || "4K Cinematic Photography & Videography · Surat, Gujarat"}
          <br />
          <span className="hero-tagline-sub">
            Weddings · Events · Portraits · Corporate · Products
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.54, duration: 0.55 }}
          className="hero-ctas"
        >
          <Link href="/gallery" className="btn btn-primary hero-btn">
            View Our Work
            <ArrowRight size={15} />
          </Link>
          <Link href="/contact" className="btn btn-ghost hero-btn">
            Book a Session
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.55 }}
          className="hero-stats-wrap"
        >
          <div className="hero-stats">
            {stats.map((stat, i) => (
              <div key={stat.label} className="hero-stat" data-last={i === stats.length - 1}>
                <div className="hero-stat-num">{stat.number}</div>
                <div className="hero-stat-lbl">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollY > 60 ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="hero-scroll"
      >
        <span className="hero-scroll-txt">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ChevronDown size={15} />
        </motion.div>
      </motion.div>

      <style>{`
        /* ── Section ── */
        .hero-section {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          background: transparent;
          margin-top: calc(var(--nav-height) * -1);
          padding-top: var(--nav-height);
        }

        /* ── Eyebrow ── */
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.65rem;
          font-family: var(--font-body);
          font-weight: 600;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: var(--accent);
          padding: 6px 18px;
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-full);
          background: var(--accent-muted);
        }
        .hero-eyebrow-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
          box-shadow: 0 0 6px var(--accent);
        }

        /* ── Headline ── */
        .hero-headline {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: clamp(2.4rem, 7vw, 5.4rem);
          line-height: 1.06;
          letter-spacing: -0.01em;
          color: var(--text-primary);
        }
        .hero-line1 {
          display: block;
          color: var(--text-primary);
        }
        /* Line 2: gold shimmer italic — the money line */
        .hero-line2 {
          display: block;
          font-style: italic;
          background: linear-gradient(90deg, var(--accent) 0%, var(--gold) 40%, var(--accent) 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gold-shimmer 4s linear infinite;
        }

        /* ── Rule ── */
        .hero-rule {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), var(--gold), var(--accent), transparent);
          margin: var(--space-4) auto var(--space-5);
        }

        /* ── Tagline ── */
        .hero-tagline {
          font-size: clamp(0.85rem, 1.5vw, 1rem);
          color: var(--text-muted);
          margin-bottom: var(--space-8);
          max-width: 440px;
          margin-inline: auto;
          line-height: 1.7;
        }
        .hero-tagline-sub {
          color: var(--text-disabled);
          font-size: 0.76rem;
          letter-spacing: 0.07em;
        }

        /* ── CTAs ── */
        .hero-ctas {
          display: flex;
          gap: var(--space-3);
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: var(--space-12);
        }
        .hero-btn { min-width: 152px; }

        /* ── Stats ── */
        .hero-stats-wrap { display: flex; justify-content: center; }
        .hero-stats {
          display: inline-grid;
          grid-template-columns: repeat(4, 1fr);
          background: var(--bg-glass);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-2xl);
          overflow: hidden;
        }
        .hero-stat {
          padding: 18px 22px;
          text-align: center;
          border-right: 1px solid var(--border);
        }
        .hero-stat[data-last="true"] { border-right: none; }
        .hero-stat-num {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: clamp(1.3rem, 2.5vw, 1.9rem);
          color: var(--accent);
          line-height: 1;
          margin-bottom: 3px;
        }
        .hero-stat-lbl {
          font-size: 0.62rem;
          color: var(--text-muted);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-family: var(--font-body);
        }

        /* ── Scroll ── */
        .hero-scroll {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
        }
        .hero-scroll-txt {
          font-size: 0.58rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .hero-headline { font-size: clamp(1.9rem, 10vw, 2.8rem); }
          .hero-ctas { flex-direction: column; align-items: center; }
          .hero-btn  { width: 100%; max-width: 280px; }
          .hero-stats { grid-template-columns: repeat(2, 1fr); }
          .hero-stat:nth-child(2) { border-right: none; }
          .hero-stat:nth-child(1),
          .hero-stat:nth-child(2) { border-bottom: 1px solid var(--border); }
          .hero-stat { padding: 14px 16px; }
          .hero-eyebrow { font-size: 0.58rem; padding: 5px 12px; }
        }
        @media (max-width: 380px) {
          .hero-headline { font-size: 1.75rem; }
        }
      `}</style>
    </section>
  );
}
