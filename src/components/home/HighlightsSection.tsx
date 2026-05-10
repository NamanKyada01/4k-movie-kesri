"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const HIGHLIGHTS = [
  {
    title: "The Royal Wedding",
    accent: "Sacred",
    desc: "A cinematic capture of tradition and luxury at the heart of Surat.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    size: "large", // spans 2 columns
  },
  {
    title: "Corporate Gala",
    accent: "Vision",
    desc: "Precision storytelling for industry leaders.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
    size: "small",
  },
  {
    title: "Portrait Sessions",
    accent: "Soul",
    desc: "Every face tells a unique story worth preserving.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800",
    size: "small",
  },
  {
    title: "Product Launch",
    accent: "Detail",
    desc: "Elevating brands through high-end cinematic visuals.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
    size: "medium", // spans 2 rows
  },
  {
    title: "Golden Hour",
    accent: "Magic",
    desc: "Chasing the perfect light for pre-wedding magic.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    size: "small",
  },
];

export function HighlightsSection() {
  return (
    <section className="highlights-section">
      <div className="container">
        <div className="highlights-header">
          <span className="highlights-eyebrow">— Curated Works</span>
          <h2 className="highlights-title">
            Every moment <em className="text-italic-gold">deserves</em> <br />
            a cinematic perspective.
          </h2>
        </div>

        <div className="highlights-grid">
          {HIGHLIGHTS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`highlight-card ${item.size}`}
            >
              <div className="highlight-image-wrap">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="highlight-image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="highlight-overlay" />
              </div>
              
              <div className="highlight-content">
                <div className="highlight-badge">{item.accent}</div>
                <h3 className="highlight-card-title">{item.title}</h3>
                <p className="highlight-card-desc">{item.desc}</p>
                <button className="highlight-cta">
                  <ArrowUpRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .highlights-section {
          padding-block: clamp(4rem, 10vw, 8rem);
          background: #030303;
          position: relative;
          overflow: hidden;
        }

        .highlights-header {
          margin-bottom: var(--space-12);
          text-align: left;
        }

        .highlights-eyebrow {
          font-size: 0.72rem;
          color: var(--accent);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
          display: block;
          margin-bottom: var(--space-4);
        }

        .highlights-title {
          font-family: 'Playfair Display', var(--font-heading), serif;
          font-size: clamp(2rem, 5vw, 3rem);
          line-height: 1.1;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .text-italic-gold {
          font-style: italic;
          color: var(--gold);
          font-weight: 500;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 280px;
          gap: 1.5rem;
        }

        .highlight-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: #080808;
          border: 1px solid rgba(255,255,255,0.04);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
        }

        .highlight-card:hover {
          transform: translateY(-8px);
          border-color: rgba(212,160,23,0.3);
        }

        /* Sizes for Asymmetry */
        .large { grid-column: span 2; grid-row: span 1; }
        .medium { grid-column: span 1; grid-row: span 2; }
        .small { grid-column: span 1; grid-row: span 1; }

        .highlight-image-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .highlight-image {
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .highlight-card:hover .highlight-image {
          transform: scale(1.1);
        }

        .highlight-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 100%);
        }

        .highlight-content {
          position: absolute;
          inset: 0;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          z-index: 1;
        }

        .highlight-badge {
          font-size: 0.6rem;
          font-weight: 800;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
          background: rgba(212,160,23,0.1);
          padding: 4px 10px;
          border-radius: 100px;
          width: fit-content;
          border: 1px solid rgba(212,160,23,0.2);
        }

        .highlight-card-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #fff;
          font-family: var(--font-heading);
        }

        .highlight-card-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.5;
          max-width: 80%;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .highlight-card:hover .highlight-card-desc {
          opacity: 1;
          transform: translateY(0);
        }

        .highlight-cta {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: all 0.4s ease;
          opacity: 0;
          transform: scale(0.8) rotate(-45deg);
        }

        .highlight-card:hover .highlight-cta {
          opacity: 1;
          transform: scale(1) rotate(0deg);
          background: var(--gold);
          color: #000;
          border-color: var(--gold);
        }

        @media (max-width: 1024px) {
          .highlights-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 250px;
          }
          .large { grid-column: span 2; }
          .medium { grid-row: span 2; }
        }

        @media (max-width: 640px) {
          .highlights-grid {
            grid-template-columns: 1fr;
            grid-auto-rows: 300px;
          }
          .large, .medium, .small { grid-column: span 1; grid-row: span 1; }
          .highlight-card-desc { opacity: 1; transform: none; }
          .highlight-cta { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}
