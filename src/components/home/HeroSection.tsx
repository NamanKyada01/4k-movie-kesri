"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Camera } from "lucide-react";

const STAGGER = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } },
  item: {
    hidden: { opacity: 0, y: 32 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" as const } },
  },
};

export function HeroSection({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <section className="hero-section">
      {/* ── Background Image with Ken Burns ── */}
      <div className="hero-bg">
        <div className="hero-ken-burns">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2400"
            alt="4K Movie Kesri – Cinematic Wedding Photography Surat"
            className="hero-img"
          />
        </div>
        {/* Multi-stop cinematic gradient overlay */}
        <div className="hero-overlay" />
        {/* Noise grain texture */}
        <div className="hero-grain" />
      </div>

      {/* ── Content ── */}
      <div className="container hero-content">
        <motion.div
          variants={STAGGER.container}
          initial="hidden"
          animate="show"
          className="hero-text-block"
        >
          {/* Eyebrow badge */}
          <motion.div variants={STAGGER.item} className="hero-eyebrow-wrap">
            <span className="hero-eyebrow-dot" />
            <span className="hero-eyebrow">Photography &amp; Videography · Surat, Gujarat</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={STAGGER.item} className="hero-headline">
            {title ? (
              title
            ) : (
              <>
                Capture<br />
                the moment.<br />
                <em className="hero-headline-accent">Keep the memory.</em>
              </>
            )}
          </motion.h1>

          {/* Tagline */}
          <motion.p variants={STAGGER.item} className="hero-tagline">
            {subtitle ||
              "Premium 4K photography and videography in Surat. Every frame treated with cinematic precision — your story told beautifully, forever."}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={STAGGER.item} className="hero-ctas">
            <Link href="/contact" className="hero-btn-primary">
              Book a Session <ArrowRight size={16} />
            </Link>
            <Link href="/gallery" className="hero-btn-ghost">
              View Our Work
            </Link>
          </motion.div>

          {/* Social proof strip */}
          <motion.div variants={STAGGER.item} className="hero-proof">
            <div className="hero-proof-avatars">
              {["P","A","R","S","M"].map((initial, i) => (
                <div key={i} className="hero-avatar" style={{ "--i": i } as React.CSSProperties}>
                  {initial}
                </div>
              ))}
            </div>
            <span className="hero-proof-text">
              <strong>500+</strong> happy clients across Gujarat
            </span>
          </motion.div>
        </motion.div>

        {/* ── Floating stats card ── */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hero-stats-card"
        >
          <div className="hero-stat">
            <span className="hero-stat-num">4K</span>
            <span className="hero-stat-label">Cinema Quality</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-num">500+</span>
            <span className="hero-stat-label">Events Shot</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-num">48h</span>
            <span className="hero-stat-label">Delivery</span>
          </div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="hero-scroll"
      >
        <div className="hero-scroll-line">
          <motion.div
            className="hero-scroll-line-inner"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </div>
        <span className="hero-scroll-txt">Scroll</span>
      </motion.div>

      {/* ── Camera icon badge ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="hero-badge"
      >
        <Camera size={14} />
        <span>Shot in 4K</span>
      </motion.div>

      <style>{`
        /* ── Section ── */
        .hero-section {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          margin-top: calc(var(--nav-height) * -1);
          padding-top: calc(var(--nav-height) + var(--space-8));
          overflow: hidden;
        }

        /* ── Background ── */
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-ken-burns {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          animation: kenBurns 22s ease-in-out infinite alternate;
          transform-origin: center center;
        }

        @keyframes kenBurns {
          0%   { transform: scale(1.0) translateX(0px); }
          100% { transform: scale(1.06) translateX(-20px); }
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to right,  rgba(6,6,6,0.82) 0%, rgba(6,6,6,0.55) 45%, rgba(6,6,6,0.10) 100%),
            linear-gradient(to bottom, rgba(6,6,6,0.25) 0%, rgba(6,6,6,0) 40%, rgba(6,6,6,0.65) 100%);
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
          mix-blend-mode: overlay;
          pointer-events: none;
        }

        /* ── Content ── */
        .hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-8);
          padding-block: var(--space-16);
        }

        .hero-text-block {
          max-width: 640px;
          flex-shrink: 0;
        }

        /* Eyebrow */
        .hero-eyebrow-wrap {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          background: rgba(212,160,23,0.1);
          border: 1px solid rgba(212,160,23,0.25);
          border-radius: var(--radius-full);
          padding: 5px 14px 5px 10px;
          margin-bottom: var(--space-5);
        }
        .hero-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px 2px rgba(212,160,23,0.5);
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
        .hero-eyebrow {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--accent);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-family: var(--font-body);
        }

        /* Headline */
        .hero-headline {
          font-family: 'Playfair Display', var(--font-heading), Georgia, serif;
          font-size: clamp(3rem, 8vw, 6.5rem);
          font-weight: 700;
          line-height: 1.0;
          color: #FAFAF8;
          margin-bottom: var(--space-6);
          letter-spacing: -0.02em;
          font-style: italic;
        }
        .hero-headline-accent {
          font-style: italic;
          background: linear-gradient(110deg, var(--gold) 0%, var(--accent) 50%, var(--gold) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gold-shimmer 4s linear infinite;
        }

        /* Tagline */
        .hero-tagline {
          font-size: clamp(0.95rem, 1.5vw, 1.1rem);
          color: rgba(250,250,248,0.7);
          line-height: 1.75;
          margin-bottom: var(--space-8);
          max-width: 480px;
          font-weight: 400;
        }

        /* CTAs */
        .hero-ctas {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
          margin-bottom: var(--space-8);
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--accent) 0%, var(--gold) 100%);
          color: #060606;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.75rem 1.75rem;
          border-radius: var(--radius-full);
          text-decoration: none;
          letter-spacing: 0.02em;
          box-shadow: 0 8px 30px rgba(212,160,23,0.35), 0 2px 8px rgba(0,0,0,0.4);
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 40px rgba(212,160,23,0.50), 0 4px 16px rgba(0,0,0,0.5);
        }
        .hero-btn-primary:active { transform: translateY(0) scale(0.99); }

        .hero-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #FAFAF8;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0.75rem 1.75rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255,255,255,0.15);
          text-decoration: none;
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .hero-btn-ghost:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        /* Social proof */
        .hero-proof {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .hero-proof-avatars {
          display: flex;
        }
        .hero-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent) 0%, var(--gold) 100%);
          border: 2px solid rgba(6,6,6,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          font-weight: 800;
          color: #060606;
          margin-left: -8px;
          flex-shrink: 0;
        }
        .hero-avatar:first-child { margin-left: 0; }
        .hero-proof-text {
          font-size: 0.78rem;
          color: rgba(250,250,248,0.6);
        }
        .hero-proof-text strong {
          color: var(--gold);
          font-weight: 700;
        }

        /* ── Stats card ── */
        .hero-stats-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
          background: rgba(10,10,10,0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212,160,23,0.15);
          border-radius: var(--radius-2xl);
          padding: var(--space-6) var(--space-8);
          min-width: 180px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,160,23,0.08);
        }
        .hero-stat { text-align: center; }
        .hero-stat-num {
          display: block;
          font-family: var(--font-heading);
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--accent);
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .hero-stat-label {
          display: block;
          font-size: 0.68rem;
          color: rgba(250,250,248,0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 4px;
          font-weight: 500;
        }
        .hero-stat-divider {
          height: 1px;
          background: rgba(212,160,23,0.1);
        }

        /* ── Scroll indicator ── */
        .hero-scroll {
          position: absolute;
          bottom: var(--space-6);
          left: var(--space-6);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: rgba(250,250,248,0.5);
        }
        .hero-scroll-line {
          width: 1px;
          height: 40px;
          background: rgba(250,250,248,0.15);
          position: relative;
          overflow: hidden;
        }
        .hero-scroll-line-inner {
          position: absolute;
          inset-inline: 0;
          top: 0;
          bottom: 0;
          background: var(--accent);
          transform-origin: top;
        }
        .hero-scroll-txt {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          writing-mode: vertical-rl;
        }

        /* ── Shot badge ── */
        .hero-badge {
          position: absolute;
          bottom: var(--space-6);
          right: var(--space-6);
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(10,10,10,0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(212,160,23,0.15);
          border-radius: var(--radius-full);
          padding: 6px 12px;
          font-size: 0.68rem;
          font-weight: 600;
          color: var(--accent);
          letter-spacing: 0.08em;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .hero-stats-card { display: none; }
          .hero-content { justify-content: flex-start; }
        }
        @media (max-width: 768px) {
          .hero-overlay {
            background:
              linear-gradient(to bottom, rgba(6,6,6,0.55) 0%, rgba(6,6,6,0.4) 40%, rgba(6,6,6,0.8) 100%),
              linear-gradient(to right, rgba(6,6,6,0.6) 0%, rgba(6,6,6,0.2) 100%);
          }
          .hero-text-block { text-align: center; margin: 0 auto; }
          .hero-eyebrow-wrap { justify-content: center; }
          .hero-ctas { justify-content: center; }
          .hero-proof { justify-content: center; }
          .hero-scroll { left: 50%; transform: translateX(-50%); }
          .hero-badge { display: none; }
        }
      `}</style>
    </section>
  );
}
