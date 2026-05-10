"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { Camera, Film, Star, Clock, LucideIcon } from "lucide-react";
import { SectionDecorator } from "@/components/ui/SectionDecorator";

const STATS: { icon: LucideIcon; maxVal: number; suffix: string; label: string; index: number }[] = [
  { icon: Film,   maxVal: 500, suffix: "+", label: "Events Delivered",     index: 0 },
  { icon: Camera, maxVal: 4,   suffix: "K", label: "Cinematic Resolution", index: 1 },
  { icon: Star,   maxVal: 5,   suffix: "★", label: "Average Rating",       index: 2 },
  { icon: Clock,  maxVal: 48,  suffix: "h", label: "Delivery Turnaround",  index: 3 },
];

function ParticleField() {
  return (
    <div className="stats-particle-field" aria-hidden>
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="stats-particle-dot"
          style={{
            left: `${5 + (i * 37) % 90}%`,
            top: `${10 + (i * 53) % 80}%`,
            animationDelay: `${(i * 0.37) % 4}s`,
            animationDuration: `${3 + (i % 3)}s`,
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
          }}
        />
      ))}
    </div>
  );
}

// ── Individual stat item — hooks must live at component top level ──
function StatItem({
  stat,
  smoothProgress,
}: {
  stat: { icon: LucideIcon; maxVal: number; suffix: string; label: string; index: number };
  smoothProgress: MotionValue<number>;
}) {
  const Icon = stat.icon;
  const start = 0.05 + stat.index * 0.08;
  const end = start + 0.3;
  const rawNum = useTransform(smoothProgress, [start, end] as number[], [0, stat.maxVal] as number[]);
  const displayNum = useTransform(rawNum, (v) => Math.floor(v).toString());

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: stat.index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="stat-item"
    >
      <div className="stat-icon-wrap">
        <Icon size={18} />
      </div>
      <div className="stat-num">
        <motion.span>{displayNum}</motion.span>
        <span style={{ color: "var(--gold)" }}>{stat.suffix}</span>
      </div>
      <div className="stat-label">{stat.label}</div>
      <div className="stat-scan" />
    </motion.div>
  );
}

export function StatCounters({ stats }: { stats?: Record<string, number | string> | null }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <section ref={sectionRef} className="stats-section">
      <SectionDecorator watermark="IMPACT" />
      <ParticleField />

      <div className="container">
        <div className="stats-grid">
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} smoothProgress={smoothProgress} />
          ))}
        </div>
      </div>

      <style>{`
        .stats-section {
          position: relative;
          padding-block: clamp(2rem, 5vw, 3rem); /* Reduced from 3rem-5rem */
          background: transparent;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }
        .stats-particle-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .stats-particle-dot {
          position: absolute;
          border-radius: 50%;
          background: rgba(212,160,23,0.4);
          animation: stats-float linear infinite;
        }
        @keyframes stats-float {
          0%   { transform: translateY(0) scale(1); opacity: 0.4; }
          50%  { transform: translateY(-18px) scale(1.3); opacity: 0.9; }
          100% { transform: translateY(0) scale(1); opacity: 0.4; }
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          position: relative;
          z-index: 1;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--space-8) var(--space-6);
          border-right: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .stat-item:last-child { border-right: none; }
        .stat-scan {
          position: absolute;
          left: -100%;
          top: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(212,160,23,0.06), transparent);
          pointer-events: none;
        }
        .stat-item:hover .stat-scan {
          animation: stat-scan-sweep 0.7s ease forwards;
        }
        @keyframes stat-scan-sweep {
          0%   { left: -100%; }
          100% { left: 100%; }
        }
        .stat-icon-wrap {
          width: 44px; height: 44px;
          border-radius: var(--radius-xl);
          background: var(--accent-muted);
          border: 1px solid var(--border-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          margin-bottom: var(--space-4);
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .stat-item:hover .stat-icon-wrap { transform: scale(1.15) rotate(-6deg); }
        .stat-num {
          font-family: 'Playfair Display', var(--font-heading), Georgia, serif;
          font-variant-numeric: tabular-nums lining-nums;
          font-size: clamp(2.8rem, 6vw, 4.5rem);
          font-weight: 700;
          color: var(--accent);
          line-height: 1;
          letter-spacing: -0.03em;
          margin-bottom: var(--space-2);
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 2px;
        }
        .stat-label {
          font-family: 'Playfair Display', var(--font-heading), Georgia, serif;
          font-size: 0.82rem;
          font-weight: 500;
          font-style: italic;
          color: var(--text-muted);
          letter-spacing: 0.01em;
          max-width: 160px;
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .stat-item { border-bottom: 1px solid var(--border); }
          .stat-item:nth-child(2n) { border-right: none; }
          .stat-item:nth-last-child(-n+2) { border-bottom: none; }
        }
        @media (max-width: 420px) {
          .stats-grid { grid-template-columns: 1fr; }
          .stat-item { border-right: none; }
          .stat-item:last-child { border-bottom: none; }
        }
      `}</style>
    </section>
  );
}
