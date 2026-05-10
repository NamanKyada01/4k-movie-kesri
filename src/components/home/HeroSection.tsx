"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Camera } from "lucide-react";
import { SplitTextReveal } from "@/components/scroll/SplitTextReveal";

// Dynamic import — Three.js must NOT run on SSR
const Camera3D = dynamic(
  () => import("@/components/three/Camera3D").then((m) => ({ default: m.Camera3D })),
  { ssr: false, loading: () => <div className="camera3d-ssr-placeholder" /> }
);

// ── Film Curtain ─────────────────────────────────────────────────────────────
// Two black panels that retract (top up, bottom down) on mount like a film curtain.
function FilmCurtain() {
  return (
    <>
      <motion.div
        className="curtain-panel curtain-top"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      />
      <motion.div
        className="curtain-panel curtain-bottom"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      />
    </>
  );
}

// ── Lens Flare ───────────────────────────────────────────────────────────────
// Decorative animated flare that drifts on its own (no cursor tracking — per design rules)
function LensFlare() {
  return (
    <div className="lens-flare-wrap" aria-hidden="true">
      <div className="lens-flare lens-flare-main" />
      <div className="lens-flare lens-flare-secondary" />
      <div className="lens-flare lens-flare-streak" />
    </div>
  );
}



interface HeroStats {
  clientsCount?: string | number;
  resolution?: string | number;
  eventsCount?: string | number;
  deliveryHours?: string | number;
}

export function HeroSection({ title, subtitle, stats }: { title?: string; subtitle?: string; stats?: HeroStats | null }) {


  const STAGGER = {
    container: { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.6 } } },
    item: {
      hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
      show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] as const } },
    },
  };

  return (
    <section className="hero-section" style={{ position: "relative" }}>
      <FilmCurtain />

      {/* ── Background (parallax) ── */}
      <motion.div
        className="hero-bg"
        style={{ willChange: "transform" }}
      >
        <div className="hero-ken-burns">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2400"
            alt="4K Movie Kesri – Cinematic Wedding Photography Surat"
            className="hero-img"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero-overlay" />
        <div className="hero-grain" />
      </motion.div>

      {/* ── Lens Flare ── */}
      <LensFlare />



      {/* ── Content (parallax mid-layer) ── */}
      <motion.div
        className="container hero-content"
        style={{ willChange: "transform" }}
      >
        <motion.div
          variants={STAGGER.container}
          initial="hidden"
          animate="show"
          className="hero-text-block"
        >
          {/* Eyebrow badge */}
          <motion.div variants={STAGGER.item} className="hero-eyebrow-wrap">
            <span className="hero-scene-label">SCENE 01</span>
            <span className="hero-eyebrow-dot" />
            <span className="hero-eyebrow">Photography &amp; Videography · Surat, Gujarat</span>
          </motion.div>

          {/* Headline — word-split reveal */}
          <motion.h1 variants={STAGGER.item} className="hero-headline">
            {title ? (
              <SplitTextReveal text={title} delay={0.2} stagger={0.05} />
            ) : (
              <>
                <SplitTextReveal text="Capture the moment." delay={0.2} stagger={0.05} />
                <br />
                <em className="hero-headline-accent">
                  <SplitTextReveal text="Keep the memory." delay={0.6} stagger={0.05} />
                </em>
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
            <Link href="/portfolio" className="hero-btn-ghost">
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
              <strong>{stats?.clientsCount || "500+"}</strong> happy clients across Gujarat
            </span>
          </motion.div>
        </motion.div>

        {/* ── Right panel: 3D Camera + Stats card ── */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="hero-right-panel"
        >
          {/* 3D Camera */}
          <Camera3D />

          {/* Stats card — sits below the 3D scene */}
          <div className="hero-stats-card">
            <div className="hero-stat">
              <span className="hero-stat-num">{stats?.resolution || "4K"}</span>
              <span className="hero-stat-label">Cinema Quality</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">{stats?.eventsCount || "500+"}</span>
              <span className="hero-stat-label">Events Shot</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">{stats?.deliveryHours || "48h"}</span>
              <span className="hero-stat-label">Delivery</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
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
        transition={{ delay: 1.4, duration: 0.6 }}
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

        /* ── Curtain panels ── */
        .curtain-panel {
          position: absolute;
          inset-inline: 0;
          height: 50%;
          background: #060606;
          z-index: 20;
          transform-origin: top;
          pointer-events: none;
        }
        .curtain-top    { top: 0; transform-origin: top; }
        .curtain-bottom { bottom: 0; transform-origin: bottom; }

        /* ── Background ── */
        .hero-bg {
          position: absolute;
          inset: -15%;
          z-index: 0;
          will-change: transform;
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
          animation: kenBurns 35s ease-in-out infinite alternate;
          transform-origin: center center;
        }

        @keyframes kenBurns {
          0%   { transform: scale(1.0) translateX(0px); }
          100% { transform: scale(1.08) translateX(-30px); }
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to right,  rgba(6,6,6,0.85) 0%, rgba(6,6,6,0.55) 45%, rgba(6,6,6,0.12) 100%),
            linear-gradient(to bottom, rgba(6,6,6,0.30) 0%, rgba(6,6,6,0) 40%, rgba(6,6,6,0.70) 100%);
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.028;
          mix-blend-mode: overlay;
          pointer-events: none;
        }

        /* ── Lens flare ── */
        .lens-flare-wrap {
          position: absolute;
          top: 18%;
          right: 30%;
          z-index: 1;
          pointer-events: none;
        }
        .lens-flare {
          position: absolute;
          border-radius: 50%;
          mix-blend-mode: screen;
        }
        .lens-flare-main {
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(212,160,23,0.22) 0%, rgba(212,160,23,0.06) 50%, transparent 70%);
          filter: blur(18px);
          animation: lensFloat 8s ease-in-out infinite;
        }
        .lens-flare-secondary {
          width: 80px; height: 80px;
          top: 30px; left: 60px;
          background: radial-gradient(circle, rgba(255,220,100,0.35) 0%, transparent 60%);
          filter: blur(8px);
          animation: lensFloat 6s ease-in-out infinite reverse;
        }
        .lens-flare-streak {
          width: 300px; height: 2px;
          top: 90px; left: -60px;
          background: linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent);
          filter: blur(2px);
          animation: streakPulse 4s ease-in-out infinite;
        }
        @keyframes lensFloat {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(12px, -18px) scale(1.05); }
          66%       { transform: translate(-8px, 10px) scale(0.96); }
        }
        @keyframes streakPulse {
          0%, 100% { opacity: 0.6; transform: scaleX(1); }
          50%       { opacity: 1.0; transform: scaleX(1.12); }
        }

        /* ── Scroll depth bar (right edge) ── */
        .scroll-depth-track {
          position: fixed;
          right: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: rgba(255,255,255,0.06);
          z-index: 50;
          pointer-events: none;
        }
        .scroll-depth-fill {
          position: absolute;
          inset-inline: 0;
          top: 0;
          bottom: 0;
          background: linear-gradient(to bottom, var(--accent), var(--gold));
          transform-origin: top;
          border-radius: 0 0 2px 2px;
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
          gap: var(--space-3);
          background: rgba(212,160,23,0.06);
          border: 1px solid rgba(212,160,23,0.15);
          border-radius: var(--radius-full);
          padding: 6px 16px 6px 12px;
          margin-bottom: var(--space-6);
          backdrop-filter: blur(8px);
        }
        .hero-scene-label {
          font-size: 0.62rem;
          font-weight: 800;
          color: #060606;
          background: var(--gold);
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
          margin-right: 2px;
        }
        .hero-eyebrow-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px 2px rgba(212,160,23,0.6);
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
          line-height: 1.15;
          color: #FAFAF8;
          margin-bottom: var(--space-6);
          letter-spacing: -0.02em;
          font-style: italic;
        }
        .hero-headline-accent {
          display: inline-block;
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
        .hero-proof-avatars { display: flex; }
        .hero-avatar {
          width: 30px; height: 30px;
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
        .hero-proof-text { font-size: 0.78rem; color: rgba(250,250,248,0.6); }
        .hero-proof-text strong { color: var(--gold); font-weight: 700; }

        /* ── Right panel ── */
        .hero-right-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
          flex-shrink: 0;
        }

        /* SSR placeholder matches canvas size */
        .camera3d-ssr-placeholder {
          width: 420px; height: 420px; flex-shrink: 0;
        }

        /* ── Stats card ── */
        .hero-stats-card {
          display: flex;
          flex-direction: row;
          gap: var(--space-5);
          align-items: center;
          background: rgba(10,10,10,0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212,160,23,0.15);
          border-radius: var(--radius-2xl);
          padding: var(--space-4) var(--space-7);
          width: 100%;
          max-width: 420px;
          justify-content: center;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,160,23,0.08);
        }
        .hero-stat { text-align: center; }
        .hero-stat-num {
          display: block;
          font-family: var(--font-heading);
          font-size: 1.9rem;
          font-weight: 700;
          color: var(--accent);
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .hero-stat-label {
          display: block;
          font-size: 0.62rem;
          color: rgba(250,250,248,0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 4px;
          font-weight: 500;
        }
        .hero-stat-divider {
          width: 1px; height: 36px;
          background: rgba(212,160,23,0.15);
          flex-shrink: 0;
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
          width: 1px; height: 40px;
          background: rgba(250,250,248,0.15);
          position: relative;
          overflow: hidden;
        }
        .hero-scroll-line-inner {
          position: absolute;
          inset-inline: 0;
          top: 0; bottom: 0;
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
          right: calc(var(--space-6) + 12px); /* offset from scroll-depth bar */
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
          .hero-right-panel { display: none; }
          .hero-stats-card  { display: none; }
          .camera3d-ssr-placeholder { display: none; }
          .hero-content { justify-content: flex-start; }
          .scroll-depth-track { display: none; }
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
          .lens-flare-wrap { display: none; }
        }
      `}</style>
    </section>
  );
}
