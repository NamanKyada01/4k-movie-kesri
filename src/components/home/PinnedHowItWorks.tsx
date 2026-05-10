"use client";

import { motion } from "framer-motion";
import { SectionDecorator } from "@/components/ui/SectionDecorator";

const defaultSteps = [
  {
    number: "01",
    title: "Consultation",
    desc: "Free discovery call to understand your vision, timeline, and aesthetic preferences.",
    icon: "💬",
    accent: "var(--accent)",
  },
  {
    number: "02",
    title: "Planning",
    desc: "Location scouting, lighting design, and a detailed shot list crafted just for your event.",
    icon: "📋",
    accent: "var(--accent-2)",
  },
  {
    number: "03",
    title: "Production",
    desc: "We arrive early, deploy cinema-grade gear, and capture every moment with precision.",
    icon: "🎬",
    accent: "var(--accent)",
  },
  {
    number: "04",
    title: "Delivery",
    desc: "Color-graded 4K films and edited photos delivered within 48 hours to a private gallery.",
    icon: "✨",
    accent: "var(--gold)",
  },
];

interface StepItem {
  number: string;
  title: string;
  desc: string;
  icon: string;
  accent: string;
}

export function PinnedHowItWorks({ steps }: { steps?: StepItem[] }) {
  const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <section className="hw-section">
      <SectionDecorator watermark="PROCESS" />
      
      <div className="container">
        {/* ── Header ── */}
        <div className="hw-header">
          <div className="hw-scene-label">SCENE 02</div>
          <span className="hw-eyebrow">— The Process</span>
          <h2 className="hw-title">
            From Vision to<br />
            <span className="text-gradient-gold">Masterpiece.</span>
          </h2>
        </div>

        {/* ── Timeline ── */}
        <div className="hw-timeline-container">
          {/* The Stitch Line */}
          <div className="hw-stitch-line" />

          <div className="hw-timeline-list">
            {displaySteps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.76, 0, 0.24, 1] }}
                className={`hw-timeline-item ${i % 2 === 0 ? "item-left" : "item-right"}`}
              >
                <div className="hw-timeline-content">
                  <div className="hw-timeline-dot" style={{ background: step.accent }} />
                  <div className="hw-card-icon">{step.icon}</div>
                  <div className="hw-card-step-label" style={{ color: step.accent }}>
                    Step {step.number}
                  </div>
                  <h3 className="hw-card-title">{step.title}</h3>
                  <p className="hw-card-desc">{step.desc}</p>
                </div>

                {/* Floating Image Frame (Mockup) */}
                <div className="hw-timeline-visual">
                  <div className="hw-visual-frame">
                    <div className="hw-visual-placeholder" />
                    <div className="hw-visual-glow" style={{ background: step.accent }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hw-section {
          position: relative;
          padding-block: clamp(5rem, 12vw, 9rem);
          background-color: #050505;
          background-image: radial-gradient(rgba(212, 160, 23, 0.06) 1px, transparent 1px);
          background-size: 32px 32px;
          border-top: 1px solid var(--border);
          overflow: hidden;
        }

        .hw-header {
          text-align: center;
          margin-bottom: var(--space-12);
        }
        .hw-eyebrow {
          font-size: 0.72rem;
          color: var(--accent);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .hw-title {
          font-size: clamp(2.5rem, 7vw, 4rem);
          letter-spacing: -0.03em;
          margin-top: var(--space-3);
          line-height: 1.1;
        }

        .hw-scene-label {
          display: inline-block;
          font-size: 0.6rem;
          font-weight: 800;
          color: #060606;
          background: var(--gold);
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-3);
        }
        
        .hw-timeline-container {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
          padding-block: var(--space-10);
        }

        .hw-stitch-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, var(--border), var(--gold), var(--border), transparent);
          transform: translateX(-50%);
          z-index: 1;
        }

        .hw-timeline-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-20);
          position: relative;
          z-index: 2;
        }

        .hw-timeline-item {
          display: flex;
          align-items: center;
          gap: var(--space-12);
          width: 100%;
        }

        .item-left { flex-direction: row; }
        .item-right { flex-direction: row-reverse; }

        .hw-timeline-content {
          width: 45%;
          background: #0a0a0a;
          border: 1px solid var(--border);
          padding: var(--space-10);
          border-radius: var(--radius-2xl);
          position: relative;
        }
        .item-left .hw-timeline-content { text-align: right; }
        .item-right .hw-timeline-content { text-align: left; }

        .hw-timeline-dot {
          position: absolute;
          top: 50%;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 3px solid #060606;
          z-index: 5;
          transform: translateY(-50%);
        }
        .item-left .hw-timeline-dot { right: -54px; }
        .item-right .hw-timeline-dot { left: -54px; }

        .hw-timeline-visual {
          width: 45%;
          display: flex;
          justify-content: center;
        }

        .hw-visual-frame {
          position: relative;
          width: 240px;
          height: 160px;
          border-radius: var(--radius-xl);
          background: var(--bg-card);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        .hw-visual-placeholder {
          position: absolute;
          inset: 0;
          background: #111;
          opacity: 0.2;
        }
        .hw-visual-glow {
          position: absolute;
          inset: 20%;
          filter: blur(40px);
          opacity: 0.05;
          border-radius: 50%;
        }

        .hw-card-icon {
          font-size: 2.2rem;
          margin-bottom: var(--space-4);
        }
        .hw-card-step-label {
          font-size: 0.62rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: var(--space-2);
        }
        .hw-card-title {
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: var(--space-3);
          font-family: var(--font-heading);
        }
        .hw-card-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .hw-stitch-line { left: 20px; transform: none; }
          .hw-timeline-item { flex-direction: column; align-items: flex-start; gap: var(--space-6); padding-left: 50px; }
          .hw-timeline-content { width: 100%; text-align: left !important; }
          .hw-timeline-visual { width: 100%; justify-content: flex-start; }
          .hw-timeline-dot { left: -36px !important; right: auto !important; }
        }
      `}</style>
    </section>
  );
}
