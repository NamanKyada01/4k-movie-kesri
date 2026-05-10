"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Camera } from "lucide-react";
import { SplitTextReveal } from "@/components/scroll/SplitTextReveal";
import { StarBorder } from "@/components/ui/StarBorder";
import { Particles } from "@/components/ui/Particles";

// Dynamic import — Three.js must NOT run on SSR
const Camera3D = dynamic(
  () => import("@/components/three/Camera3D").then((m) => ({ default: m.Camera3D })),
  { ssr: false, loading: () => <div className="camera3d-ssr-placeholder" /> }
);
// ── Film Curtain ─────────────────────────────────────────────────────────────
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

interface HeroStats {
  clientsCount?: string | number;
  resolution?: string | number;
  eventsCount?: string | number;
  deliveryHours?: string | number;
}

function HeroGoldenSparks() {
  return (
    <div className="hero-sparks-container" aria-hidden>
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="hero-spark"
          initial={{ 
            opacity: 0,
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: [null, `${Math.random() * -200}px`],
            opacity: [0, 0.8, 0],
            scale: [null, Math.random() * 1.2 + 0.5]
          }}
          transition={{ 
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            backgroundColor: "var(--gold)",
            boxShadow: "0 0 10px var(--accent)",
            borderRadius: "50%",
            position: "absolute",
            zIndex: 1
          }}
        />
      ))}
    </div>
  );
}
function PolaroidCard({ 
  src, 
  rotate = 0, 
  x = 0, 
  y = 0, 
  delay = 0, 
  label 
}: { 
  src: string; 
  rotate?: number; 
  x: number | string; 
  y: number | string; 
  delay?: number;
  label?: string;
}) {
  return (
    <motion.div
      className="hero-polaroid"
      initial={{ opacity: 0, scale: 0.8, rotate: rotate - 10, x, y }}
      animate={{ opacity: 1, scale: 1, rotate: rotate, x, y }}
      transition={{ 
        duration: 1.2, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{ scale: 1.05, rotate: rotate + 2, zIndex: 10, transition: { duration: 0.4 } }}
    >
      <div className="polaroid-inner">
        <div className="polaroid-image-wrap">
          <Image src={src} alt="" fill className="polaroid-img" sizes="300px" />
          <div className="polaroid-tape" />
        </div>
        {label && <div className="polaroid-caption">{label}</div>}
      </div>
    </motion.div>
  );
}

export function HeroSection({ title, subtitle, stats }: { title?: string; subtitle?: string; stats?: HeroStats | null }) {
  const STAGGER = {
    container: { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } },
    item: {
      hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
      show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    },
  };

  return (
    <section className="hero-section">
      <FilmCurtain />
      <HeroGoldenSparks />

      {/* ── Background Layer ── */}
      <div className="hero-bg-layer">
        <div className="projector-beam beam-left" />
        <div className="projector-beam beam-right" />
        <div className="hero-grain" />
        <div className="hero-paper-texture" />
      </div>

      {/* ── Scattered Polaroids (Braai Style) ── */}
      <div className="hero-scatter-container" aria-hidden="true">
        <PolaroidCard 
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600" 
          rotate={-8} x="-22vw" y="-12vh" delay={0.8} label="Est. 2018"
        />
        <PolaroidCard 
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600" 
          rotate={5} x="28vw" y="-10vh" delay={1.0} label="Cinematic"
        />
        <PolaroidCard 
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600" 
          rotate={-12} x="24vw" y="18vh" delay={1.2} label="Surat, GJ"
        />
        <PolaroidCard 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600" 
          rotate={10} x="-26vw" y="20vh" delay={1.4} label="4K Movie"
        />
      </div>

      <div className="container hero-content">
        <motion.div
          variants={STAGGER.container}
          initial="hidden"
          animate="show"
          className="hero-text-center"
        >
          <motion.div variants={STAGGER.item} className="hero-eyebrow-pill">
            Photography & Videography · Premium Studio
          </motion.div>

          <motion.h1 variants={STAGGER.item} className="hero-main-title">
            {title ? (
              <SplitTextReveal text={title} delay={0.1} />
            ) : (
              <>
                <span className="hero-title-top">Capture the <em className="hero-italic">Essence</em></span>
                <br />
                <span className="hero-title-bottom">of Your Story.</span>
              </>
            )}
          </motion.h1>

          <motion.p variants={STAGGER.item} className="hero-description">
            {subtitle || "Surat's premiere cinematic destination. We blend heritage with modern 4K technology to create timeless visual masterpieces."}
          </motion.p>

          <motion.div variants={STAGGER.item} className="hero-actions">
            <Link href="/contact" className="hero-cta-gold">
              <span className="hero-cta-shimmer" />
              Book Your Session
              <ArrowRight size={18} />
            </Link>
            <Link href="/portfolio" className="hero-cta-secondary">
              View Work
            </Link>
          </motion.div>

          {/* Social Proof Mini */}
          <motion.div variants={STAGGER.item} className="hero-trust">
            <div className="hero-trust-dots">
               {[1,2,3,4].map(i => <div key={i} className="trust-dot" />)}
            </div>
            <span>Trusted by 500+ couples & businesses</span>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 94svh; /* Balanced height: cinematic feel + trust bar hint */
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050505;
          overflow: hidden;
          padding-top: var(--nav-height);
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

        .hero-bg-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .hero-paper-texture {
          position: absolute;
          inset: 0;
          background-image: url("https://www.transparenttextures.com/patterns/lined-paper.png");
          opacity: 0.03;
          mix-blend-mode: overlay;
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E");
          opacity: 0.05;
          mix-blend-mode: overlay;
        }

        .projector-beam {
          position: absolute;
          top: -20%;
          width: 150%;
          height: 150%;
          pointer-events: none;
          mix-blend-mode: screen;
          filter: blur(40px);
        }
        .beam-left {
          left: -40%;
          background: conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(212,160,23,0.04) 10deg, transparent 20deg);
        }
        .beam-right {
          right: -40%;
          background: conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(212,160,23,0.04) 10deg, transparent 20deg);
        }

        .hero-sparks-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        /* ── Polaroids ── */
        .hero-scatter-container {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .hero-polaroid {
          position: absolute;
          width: 220px;
          background: #fff;
          padding: 10px 10px 30px 10px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.6);
          pointer-events: auto;
        }

        .polaroid-inner {
          position: relative;
        }

        .polaroid-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          background: #111;
          overflow: hidden;
        }

        .polaroid-img {
          object-fit: cover;
          filter: sepia(0.2) contrast(1.1);
        }

        .polaroid-tape {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 25px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(4px);
          mask-image: radial-gradient(circle, #fff 40%, transparent 100%);
          z-index: 2;
        }

        .polaroid-caption {
          margin-top: 15px;
          font-family: 'Playfair Display', serif;
          color: #222;
          font-size: 0.8rem;
          font-weight: 700;
          text-align: center;
          font-style: italic;
        }

        /* ── Content ── */
        .hero-content {
          position: relative;
          z-index: 5;
          text-align: center;
        }

        .hero-text-center {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-eyebrow-pill {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          background: rgba(212,160,23,0.1);
          padding: 6px 18px;
          border-radius: 100px;
          border: 1px solid rgba(212,160,23,0.2);
          margin-bottom: 1.5rem;
        }

        .hero-main-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 7vw, 4.2rem); /* Slightly smaller */
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: #FAFAF8;
          margin-bottom: 1.5rem;
        }

        .hero-italic {
          font-style: italic;
          color: var(--gold);
          font-weight: 400;
        }

        .hero-description {
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
          max-width: 500px;
          margin: 0 auto 2rem auto;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .hero-cta-gold {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, var(--gold) 0%, var(--accent) 100%);
          color: #000;
          padding: 1.1rem 2.4rem;
          border-radius: 100px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(212,160,23,0.3);
        }
        .hero-cta-gold:hover { 
          transform: translateY(-4px) scale(1.02); 
          box-shadow: 0 15px 40px rgba(212,160,23,0.5); 
          filter: brightness(1.1);
        }
        .hero-cta-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: translateX(-100%);
          animation: hero-shimmer 3s infinite;
        }
        @keyframes hero-shimmer {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }

        .hero-cta-secondary {
          color: #fff;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.3);
          padding-bottom: 4px;
          transition: border-color 0.3s ease;
        }
        .hero-cta-secondary:hover { border-color: var(--gold); }

        .hero-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }
        .hero-trust-dots { display: flex; gap: 4px; }
        .trust-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--gold); }

        @media (max-width: 1200px) {
          .hero-polaroid { width: 180px; }
        }

        @media (max-width: 768px) {
          .hero-scatter-container { display: none; }
          .hero-main-title { font-size: clamp(2.5rem, 12vw, 4rem); }
        }
      `}</style>
    </section>
  );
}
