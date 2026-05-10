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
          <span className="hw-eyebrow">— The Process</span>
          <h2 className="hw-title">
            From Vision to<br />
            <span className="text-gradient-gold">Masterpiece.</span>
          </h2>
        </div>

        {/* ── Grid ── */}
        <div className="hw-grid">
          {displaySteps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="hw-card"
            >
              <div
                className="hw-card-line"
                style={{ background: `linear-gradient(90deg, ${step.accent}, transparent)` }}
              />
              <div className="hw-card-icon">{step.icon}</div>
              <div className="hw-card-step-label" style={{ color: step.accent }}>
                Step {step.number}
              </div>
              <h3 className="hw-card-title">{step.title}</h3>
              <p className="hw-card-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .hw-section {
          position: relative;
          padding-block: clamp(5rem, 12vw, 9rem);
          background: var(--bg-primary);
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

        .hw-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-5);
        }

        .hw-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .hw-card:hover {
          transform: translateY(-5px);
          border-color: var(--border-accent);
        }
        .hw-card-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
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
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: var(--space-3);
        }
        .hw-card-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.7;
        }

        @media (max-width: 1024px) {
          .hw-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .hw-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
