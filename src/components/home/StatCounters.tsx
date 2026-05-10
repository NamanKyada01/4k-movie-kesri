"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Film, Star, Clock } from "lucide-react";
import { SectionDecorator } from "@/components/ui/SectionDecorator";

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatItem({ stat, index, triggered }: {
  stat: { icon: any, value: number, suffix: string, label: string, duration: number };
  index: number;
  triggered: boolean;
}) {
  const count = useCountUp(stat.value, stat.duration, triggered);
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={triggered ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="stat-item"
    >
      <div className="stat-icon-wrap">
        <Icon size={18} />
      </div>
      <div className="stat-num">
        <span>{count}</span>
        <span style={{ color: "var(--gold)" }}>{stat.suffix}</span>
      </div>
      <div className="stat-label">{stat.label}</div>
    </motion.div>
  );
}

export function StatCounters({ stats }: { stats?: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  const finalStats = [
    { icon: Film,   value: stats?.eventsCount || 500,  suffix: "+", label: "Events Delivered",   duration: 2000 },
    { icon: Camera, value: stats?.resolution || 4,    suffix: "K",  label: "Cinematic Resolution", duration: 800 },
    { icon: Star,   value: stats?.rating || 5,    suffix: "★",  label: "Average Rating",    duration: 600 },
    { icon: Clock,  value: stats?.deliveryHours || 48,   suffix: "h",  label: "Delivery Turnaround", duration: 1200 },
  ];

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="stats-section">
      <SectionDecorator watermark="IMPACT" />

      <div className="container">
        <div className="stats-grid">
          {finalStats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} triggered={triggered} />
          ))}
        </div>
      </div>

      <style>{`
        .stats-section {
          position: relative;
          padding-block: clamp(3rem, 7vw, 5rem);
          background: transparent;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }

        .stats-orb {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 200px;
          background: radial-gradient(ellipse, rgba(212,160,23,0.02) 0%, transparent 70%);
          filter: blur(40px);
          pointer-events: none;
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
        }
        .stat-item:last-child { border-right: none; }

        .stat-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-xl);
          background: var(--accent-muted);
          border: 1px solid var(--border-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          margin-bottom: var(--space-4);
        }

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
