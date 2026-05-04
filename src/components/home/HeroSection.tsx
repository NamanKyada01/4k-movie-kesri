"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

export function HeroSection({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <section className="hero-section">
      {/* Background Image with slight overlay */}
      <div className="hero-bg">
        <img 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000" 
          alt="Wedding Photography" 
          className="hero-img"
        />
        <div className="hero-overlay" />
      </div>

      <div className="container hero-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hero-text-block"
        >
          <span className="hero-eyebrow">Photography & Videography Services</span>
          <h1 className="hero-headline">
            {title ? title : <>Capture the moment.<br/><span className="text-accent">Keep the memory.</span></>}
          </h1>
          <p className="hero-tagline">
            {subtitle || "Premium 4K photography and videography studio in Surat. We treat every moment with the respect and personal attention it deserves, ensuring your story lives on."}
          </p>

          <div className="hero-ctas">
            <Link href="/contact" className="btn btn-primary btn-xl shadow-accent">
              Book a Session <ArrowRight size={18} />
            </Link>
            <Link href="/gallery" className="btn btn-ghost btn-xl bg-glass">
              View Stories
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="hero-scroll"
      >
        <span className="hero-scroll-txt">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          margin-top: calc(var(--nav-height) * -1);
          padding-top: var(--nav-height);
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          /* A gradient that lets the image show on the right/bottom but keeps text readable on the left/top */
          background: linear-gradient(to right, rgba(250, 250, 250, 0.95) 0%, rgba(250, 250, 250, 0.7) 40%, rgba(250, 250, 250, 0.2) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          padding-top: var(--space-8);
        }

        .hero-text-block {
          max-width: 650px;
        }

        .hero-eyebrow {
          display: inline-block;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: var(--space-4);
          background: var(--bg-card);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          box-shadow: var(--shadow-sm);
        }

        .hero-headline {
          font-family: var(--font-heading);
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 700;
          line-height: 1.05;
          color: var(--text-primary);
          margin-bottom: var(--space-5);
          letter-spacing: -0.02em;
        }

        .hero-tagline {
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: var(--space-8);
          max-width: 540px;
          font-weight: 400;
        }

        .hero-ctas {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .shadow-accent {
          box-shadow: 0 10px 25px -5px rgba(249, 115, 22, 0.4);
        }

        .bg-glass {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .hero-scroll {
          position: absolute;
          bottom: var(--space-6);
          left: var(--space-6);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--text-primary);
        }

        .hero-scroll-txt {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .hero-overlay {
            background: linear-gradient(to bottom, rgba(250, 250, 250, 0.9) 0%, rgba(250, 250, 250, 0.8) 50%, rgba(250, 250, 250, 0.4) 100%);
          }
          .hero-text-block { text-align: center; margin: 0 auto; }
          .hero-ctas { justify-content: center; }
          .hero-scroll { left: 50%; transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
