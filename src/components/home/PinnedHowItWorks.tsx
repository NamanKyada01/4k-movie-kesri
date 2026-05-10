"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
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

// ── Progress spine (fills based on which step is active) ──────────────────────
function StepSpine({
  total,
  active,
}: {
  total: number;
  active: number;
}) {
  return (
    <div className="hw-spine-wrap">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`hw-spine-seg ${i <= active ? "hw-spine-seg--active" : ""}`}
          style={i <= active ? { background: defaultSteps[i]?.accent ?? "var(--accent)" } : {}}
        />
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function PinnedHowItWorks({ steps }: { steps?: any[] }) {
  const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(
      Math.floor(v * displaySteps.length),
      displaySteps.length - 1
    );
    if (idx !== activeIndex) {
      setPrevIndex(activeIndex);
      setActiveIndex(idx);
    }
  });

  const step = displaySteps[activeIndex];
  const direction = activeIndex > prevIndex ? 1 : -1; // 1 = forward, -1 = backward

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: `${displaySteps.length * 100}vh` }}
    >
      {/* Sticky viewport */}
      <div className="hw-sticky">
        <SectionDecorator watermark="PROCESS" />

        {/* ── Header ── */}
        <div className="hw-header">
          <span className="hw-eyebrow">— The Process</span>
          <h2 className="hw-title">
            From Vision to<br />
            <span className="text-gradient-gold">Masterpiece.</span>
          </h2>

          {/* Step pill counter */}
          <div className="hw-pills">
            {displaySteps.map((s, i) => (
              <div
                key={s.number}
                className={`hw-pill ${i === activeIndex ? "hw-pill--active" : ""}`}
                style={i === activeIndex ? { background: s.accent, borderColor: s.accent } : {}}
              >
                {s.number}
              </div>
            ))}
          </div>
        </div>

        {/* ── Card area ── */}
        <div className="hw-card-area">
          {/* Left spine */}
          <StepSpine total={displaySteps.length} active={activeIndex} />

          {/* Animated card */}
          <div className="hw-card-viewport">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                className="hw-card"
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Accent top line */}
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

                {/* Scroll hint (only on first card) */}
                {activeIndex === 0 && (
                  <motion.div
                    className="hw-scroll-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <span className="hw-scroll-hint-line" />
                    <span>Scroll to continue</span>
                    <span className="hw-scroll-hint-line" />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="hw-progress-bar">
          <motion.div
            className="hw-progress-fill"
            animate={{ width: `${((activeIndex + 1) / displaySteps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <style>{`
        /* ── Sticky shell ── */
        .hw-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: var(--space-12) var(--space-6);
          background: var(--bg-primary);
          border-top: 1px solid var(--border);
          overflow: hidden;
        }

        /* ── Header ── */
        .hw-header {
          text-align: center;
          margin-bottom: var(--space-10);
          z-index: 5;
          position: relative;
        }
        .hw-eyebrow {
          font-size: 0.72rem;
          color: var(--accent);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .hw-title {
          font-size: clamp(2rem, 6vw, 3.5rem);
          letter-spacing: -0.03em;
          margin-top: var(--space-3);
          line-height: 1.1;
        }

        /* Step pills */
        .hw-pills {
          display: flex;
          gap: var(--space-2);
          justify-content: center;
          margin-top: var(--space-4);
        }
        .hw-pill {
          width: 36px; height: 26px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          background: var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--text-muted);
          transition: all 0.3s ease;
          letter-spacing: 0.05em;
        }
        .hw-pill--active {
          color: var(--bg-primary) !important;
          transform: scale(1.08);
          box-shadow: 0 4px 14px rgba(212,160,23,0.3);
        }

        /* ── Card area ── */
        .hw-card-area {
          display: flex;
          gap: var(--space-6);
          align-items: stretch;
          width: 100%;
          max-width: 720px;
          z-index: 3;
          position: relative;
        }

        /* Spine */
        .hw-spine-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-shrink: 0;
          padding-top: 6px;
          width: 4px;
        }
        .hw-spine-seg {
          flex: 1;
          border-radius: 2px;
          background: var(--border);
          transition: background 0.4s ease;
          min-height: 32px;
        }
        .hw-spine-seg--active {
          box-shadow: 0 0 8px 2px rgba(212,160,23,0.25);
        }

        /* Card viewport — constrains AnimatePresence */
        .hw-card-viewport {
          flex: 1;
          position: relative;
          min-height: 260px;
        }

        /* The animated card */
        .hw-card {
          width: 100%;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          position: relative;
          overflow: hidden;
          will-change: transform, opacity;
        }
        .hw-card-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
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
          font-family: var(--font-body);
          margin-bottom: var(--space-2);
        }
        .hw-card-title {
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: var(--space-3);
        }
        .hw-card-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.7;
        }

        /* Scroll hint */
        .hw-scroll-hint {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-top: var(--space-6);
          font-size: 0.68rem;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .hw-scroll-hint-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* Bottom progress bar */
        .hw-progress-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: var(--border);
        }
        .hw-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--gold));
          border-radius: 1px;
          transition: width 0.5s ease;
        }

        /* ── Mobile: no pinning ── */
        @media (max-width: 768px) {
          /* Override the container height inline-style */
          [style*="height"][style*="vh"] > .hw-sticky {
            position: relative !important;
            height: auto !important;
          }
          .hw-card-area { flex-direction: column; }
          .hw-spine-wrap { flex-direction: row; width: 100%; height: 4px; padding: 0; }
          .hw-spine-seg { min-height: auto; min-width: 32px; }
        }
      `}</style>
    </div>
  );
}
