"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Cinematic Wedding Films",
    description: "Every vow, every tear, every smile — captured in cinematic 4K. Your love story, told with the precision of high-end cinema.",
    href: "/services",
    tag: "Trending",
    icon: "🎞️",
    accentVar: "--accent",       /* gold */
  },
  {
    title: "Editorial Photography",
    description: "High-fashion portraiture and event coverage. We master the light to create images that belong on a magazine cover.",
    href: "/services",
    tag: null,
    icon: "📸",
    accentVar: "--gold",         /* cream-gold */
  },
  {
    title: "Pre-Wedding Masterpieces",
    description: "Atmospheric outdoor sessions that capture the chemistry between souls. Directional lighting and artistic framing.",
    href: "/services",
    tag: null,
    icon: "💑",
    accentVar: "--accent",
  },
  {
    title: "Luxury Photo Albums",
    description: "Handcrafted, archival-grade memories. Your moments deserve the tactile excellence of premium leather and glass.",
    href: "/services",
    tag: null,
    icon: "📖",
    accentVar: "--accent-2",     /* crimson */
  },
];

export function ServiceCards() {
  return (
    <section className="svc-section">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="svc-header"
        >
          <span className="svc-eyebrow">The Collection</span>
          <h2 className="svc-title">
            Our Professional
            <br />
            <em className="svc-title-em">Services</em>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="svc-grid">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={svc.href} className="svc-card-link">
                <div className="svc-card">
                  {/* Corner glow */}
                  <div
                    className="svc-glow"
                    style={{
                      background: `radial-gradient(circle at 90% 10%, var(${svc.accentVar})20 0%, transparent 60%)`,
                    }}
                  />

                  {/* Top row */}
                  <div className="svc-top">
                    <span className="svc-icon">{svc.icon}</span>
                    {svc.tag && (
                      <span className="svc-tag">{svc.tag}</span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="svc-body">
                    <h3 className="svc-name">{svc.title}</h3>
                    <p className="svc-desc">{svc.description}</p>
                  </div>

                  {/* Footer link */}
                  <div className="svc-link" style={{ color: `var(${svc.accentVar})` }}>
                    Explore <ArrowRight size={13} />
                  </div>

                  {/* Bottom bar */}
                  <div
                    className="svc-bar"
                    style={{ background: `var(${svc.accentVar})` }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginTop: "var(--space-10)" }}
        >
          <Link href="/services" className="btn btn-ghost btn-lg">
            View All Services
          </Link>
        </motion.div>
      </div>

      <style>{`
        .svc-section {
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
          padding-block: clamp(3rem, 8vw, 6rem);
        }
        /* Ambient gold glow */
        .svc-section::before {
          content: '';
          position: absolute;
          top: 10%;
          left: -10%;
          width: 50vw; height: 50vw;
          max-width: 600px; max-height: 600px;
          background: radial-gradient(circle, rgba(212,160,23,0.07) 0%, transparent 70%);
          filter: blur(80px);
          pointer-events: none;
        }

        .svc-header {
          margin-bottom: var(--space-10);
          position: relative;
          z-index: 2;
        }
        .svc-eyebrow {
          font-size: 0.68rem;
          color: var(--accent);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 600;
          font-family: var(--font-body);
          display: block;
          margin-bottom: var(--space-2);
        }
        .svc-title {
          font-size: clamp(1.9rem, 6vw, 3.2rem);
          line-height: 1.05;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .svc-title-em {
          font-style: italic;
          /* gold shimmer on the italic word */
          background: linear-gradient(90deg, var(--accent) 0%, var(--gold) 50%, var(--accent) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gold-shimmer 5s linear infinite;
        }

        /* 2-col desktop, 1-col mobile */
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
          position: relative;
          z-index: 2;
        }

        .svc-card-link { display: block; text-decoration: none; height: 100%; }

        .svc-card {
          background: var(--bg-elevated);
          padding: var(--space-6);
          border-radius: var(--radius-2xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          position: relative;
          overflow: hidden;
          border: 1px solid var(--border);
          transition: transform 0.26s ease, border-color 0.26s ease, background 0.26s ease;
          height: 100%;
        }
        .svc-card:hover {
          background: var(--bg-card);
          border-color: var(--border-accent);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(212,160,23,0.10);
        }
        .svc-card:hover .svc-bar { opacity: 0.65; }

        .svc-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .svc-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          z-index: 1;
        }
        .svc-icon { font-size: 2rem; line-height: 1; }
        .svc-tag {
          font-size: 0.56rem;
          background: var(--accent-muted);
          color: var(--accent);
          border: 1px solid var(--border-accent);
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-family: var(--font-body);
        }

        .svc-body { position: relative; z-index: 1; flex: 1; }
        .svc-name {
          font-size: clamp(1.05rem, 2.5vw, 1.35rem);
          font-weight: 700;
          margin-bottom: var(--space-2);
          color: var(--text-primary);
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .svc-desc {
          font-size: 0.87rem;
          line-height: 1.65;
          color: var(--text-muted);
        }

        .svc-link {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-family: var(--font-body);
          position: relative;
          z-index: 1;
        }

        .svc-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          opacity: 0.18;
          transition: opacity 0.26s ease;
        }

        @media (max-width: 640px) {
          .svc-grid { grid-template-columns: 1fr; gap: var(--space-3); }
          .svc-card { padding: var(--space-5); }
          .svc-name { font-size: 1.05rem; }
        }
      `}</style>
    </section>
  );
}
