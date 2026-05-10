"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { SectionDecorator } from "@/components/ui/SectionDecorator";
import { MessageCircle, ClipboardList, Film, Sparkles } from "lucide-react";

const defaultSteps = [
  {
    number: "01",
    title: "Consultation",
    desc: "Free discovery call to understand your vision, timeline, and aesthetic preferences.",
    icon: MessageCircle,
    accent: "var(--accent)",
    entranceFrom: "left" as const,
  },
  {
    number: "02",
    title: "Planning",
    desc: "Location scouting, lighting design, and a detailed shot list crafted just for your event.",
    icon: ClipboardList,
    accent: "var(--accent-2)",
    entranceFrom: "top" as const,
  },
  {
    number: "03",
    title: "Production",
    desc: "We arrive early, deploy cinema-grade gear, and capture every moment with precision.",
    icon: Film,
    accent: "var(--accent)",
    entranceFrom: "right" as const,
  },
  {
    number: "04",
    title: "Delivery",
    desc: "Color-graded 4K films and edited photos delivered within 48 hours to a private gallery.",
    icon: Sparkles,
    accent: "var(--gold)",
    entranceFrom: "bottom" as const,
  },
];

interface StepItem {
  number: string;
  title: string;
  desc: string;
  icon?: string;
  accent: string;
}

type Direction = "left" | "right" | "top" | "bottom";

const directionOffset: Record<Direction, { x?: number; y?: number; rotate?: number; scale?: number }> = {
  left:   { x: -60, scale: 0.8 },
  right:  { x: 60, scale: 0.8 },
  top:    { y: -60, scale: 0.8 },
  bottom: { y: 60, scale: 0.8 },
};

export function PinnedHowItWorks({ steps }: { steps?: StepItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 20 });

  // Energy beam fills from top to bottom
  const beamScaleY = useTransform(smoothProgress, [0.05, 0.85], [0, 1]);
  const beamOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Build the final steps array, attaching entrance directions
  const displaySteps = steps && steps.length > 0
    ? steps.map((s, i) => ({
        ...s,
        icon: defaultSteps[i % defaultSteps.length].icon,
        entranceFrom: defaultSteps[i % defaultSteps.length].entranceFrom,
      }))
    : defaultSteps;

  return (
    <section ref={sectionRef} className="hw-section">
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

        {/* ── Timeline ── */}
        <div className="hw-timeline-container">
          {/* Energy beam */}
          <div className="hw-beam-track">
            <motion.div
              className="hw-energy-beam"
              style={{ scaleY: beamScaleY, opacity: beamOpacity }}
            />
          </div>

          <div className="hw-timeline-list">
            {displaySteps.map((step, i) => {
              const Icon = step.icon || Sparkles;
              const { x = 0, y = 0, scale = 1 } = directionOffset[step.entranceFrom];
              const stepStart = i / displaySteps.length;
              const stepEnd = stepStart + 0.3;

              const stepOpacity = useTransform(smoothProgress, [stepStart, stepStart + 0.1, stepEnd], [0, 1, 1]);
              const stepX = useTransform(smoothProgress, [stepStart, stepStart + 0.15], [x, 0]);
              const stepY = useTransform(smoothProgress, [stepStart, stepStart + 0.15], [y, 0]);
              const stepScale = useTransform(smoothProgress, [stepStart, stepStart + 0.15], [scale, 1]);

              // Dot on the beam glows when step is active
              const dotGlow = useTransform(
                smoothProgress,
                [stepStart, stepStart + 0.1, stepStart + 0.2],
                [0, 1, 0.6]
              );

              return (
                <div
                  key={step.number}
                  className={`hw-timeline-item ${i % 2 === 0 ? "item-left" : "item-right"}`}
                >
                  {/* Pulsing dot on the beam */}
                  <motion.div
                    className="hw-beam-dot"
                    style={{
                      backgroundColor: step.accent,
                      boxShadow: useTransform(dotGlow, (v) =>
                        `0 0 ${v * 24}px ${v * 12}px ${step.accent}66`
                      ),
                      scale: useTransform(dotGlow, [0, 1], [0.7, 1.3]),
                    }}
                  />

                  {/* Card */}
                  <motion.div
                    className="hw-timeline-content"
                    style={{ opacity: stepOpacity, x: stepX, y: stepY, scale: stepScale }}
                  >
                    <div className="hw-card-icon-wrap" style={{ borderColor: step.accent }}>
                      <Icon size={22} style={{ color: step.accent }} />
                    </div>
                    <div className="hw-card-step-label" style={{ color: step.accent }}>
                      Step {step.number}
                    </div>
                    <h3 className="hw-card-title">{step.title}</h3>
                    <p className="hw-card-desc">{step.desc}</p>

                    {/* Glow bleed from accent */}
                    <div className="hw-card-glow" style={{ background: step.accent }} />
                  </motion.div>

                  {/* Visual side */}
                  <motion.div
                    className="hw-timeline-visual"
                    style={{ opacity: stepOpacity, scale: useTransform(stepScale, (v) => 0.8 + v * 0.2) }}
                  >
                    <div className="hw-visual-frame">
                      <div className="hw-visual-number" style={{ color: step.accent }}>
                        {step.number}
                      </div>
                      <div className="hw-visual-glow" style={{ background: step.accent }} />
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .hw-section {
          position: relative;
          padding-block: clamp(3rem, 8vw, 5rem);
          background-color: #050505;
          background-image: radial-gradient(rgba(212, 160, 23, 0.055) 1px, transparent 1px);
          background-size: 32px 32px;
          border-top: 1px solid var(--border);
          overflow: hidden;
        }

        .hw-header {
          text-align: center;
          margin-bottom: var(--space-16);
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
          padding-block: var(--space-6);
        }

        /* ── Energy beam ── */
        .hw-beam-track {
          position: absolute;
          left: 50%;
          top: 0; bottom: 0;
          width: 2px;
          transform: translateX(-50%);
          background: rgba(255,255,255,0.04);
          z-index: 1;
        }
        .hw-energy-beam {
          position: absolute;
          left: 0; right: 0;
          top: 0; bottom: 0;
          transform-origin: top;
          background: linear-gradient(
            to bottom,
            transparent,
            var(--accent) 20%,
            var(--gold) 50%,
            var(--accent) 80%,
            transparent
          );
          border-radius: 2px;
          filter: blur(1px);
        }

        .hw-timeline-list {
          display: flex;
          flex-direction: column;
          gap: clamp(var(--space-6), 5vw, var(--space-10));
          position: relative;
          z-index: 2;
        }

        .hw-timeline-item {
          display: flex;
          align-items: center;
          gap: var(--space-10);
          width: 100%;
          position: relative;
        }
        .item-left  { flex-direction: row; }
        .item-right { flex-direction: row-reverse; }

        /* Pulsing dot on beam */
        .hw-beam-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 3px solid #060606;
          transform: translate(-50%, -50%);
          z-index: 10;
          flex-shrink: 0;
        }

        /* Card */
        .hw-timeline-content {
          width: 44%;
          background: #0a0a0a;
          border: 1px solid var(--border);
          padding: var(--space-8);
          border-radius: var(--radius-2xl);
          position: relative;
          overflow: hidden;
          will-change: transform, opacity;
        }
        .item-left  .hw-timeline-content { text-align: right; }
        .item-right .hw-timeline-content { text-align: left; }

        .hw-card-glow {
          position: absolute;
          inset: 60%;
          filter: blur(50px);
          opacity: 0.04;
          border-radius: 50%;
          pointer-events: none;
        }

        .hw-card-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px; height: 48px;
          border-radius: var(--radius-xl);
          background: rgba(212,160,23,0.06);
          border: 1px solid;
          margin-bottom: var(--space-4);
        }
        .item-left  .hw-card-icon-wrap { margin-left: auto; }

        .hw-card-step-label {
          font-size: 0.62rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: var(--space-2);
        }
        .hw-card-title {
          font-size: 1.7rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: var(--space-3);
          font-family: var(--font-heading);
        }
        .hw-card-desc {
          font-size: 0.92rem;
          color: var(--text-muted);
          line-height: 1.7;
        }

        /* Visual side */
        .hw-timeline-visual {
          width: 44%;
          display: flex;
          justify-content: center;
          align-items: center;
          will-change: transform, opacity;
        }
        .hw-visual-frame {
          position: relative;
          width: 220px; height: 160px;
          border-radius: var(--radius-2xl);
          background: #0d0d0d;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .hw-visual-number {
          font-family: var(--font-heading);
          font-size: 5rem;
          font-weight: 800;
          letter-spacing: -0.05em;
          opacity: 0.2;
          line-height: 1;
        }
        .hw-visual-glow {
          position: absolute;
          inset: 25%;
          filter: blur(50px);
          opacity: 0.08;
          border-radius: 50%;
        }

        /* Mobile */
        @media (max-width: 900px) {
          .hw-beam-track { left: 20px; transform: none; }
          .hw-beam-dot { left: 20px; transform: translate(-50%, -50%); }
          .hw-timeline-item { flex-direction: column; align-items: flex-start; gap: var(--space-5); padding-left: 50px; }
          .hw-timeline-content { width: 100%; text-align: left !important; }
          .hw-card-icon-wrap { margin-left: 0 !important; }
          .hw-timeline-visual { width: 100%; justify-content: flex-start; }
        }
      `}</style>
    </section>
  );
}
