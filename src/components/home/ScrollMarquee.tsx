"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const defaultRow1 = [
  { title: "Weddings",    emoji: "💍", desc: "Cinematic wedding films" },
  { title: "Pre-Wedding", emoji: "💑", desc: "Golden hour sessions" },
  { title: "Corporate",   emoji: "🏢", desc: "Professional event coverage" },
  { title: "Portraits",   emoji: "📸", desc: "Studio & outdoor sessions" },
  { title: "Products",    emoji: "🛍️", desc: "High-end commercial" },
  { title: "Videography", emoji: "🎬", desc: "4K cinematic films" },
];
const defaultRow2 = [
  { title: "LED Screens",  emoji: "📺", desc: "Stage & event backdrops" },
  { title: "Crane Shots",  emoji: "🎥", desc: "Aerial & jib coverage" },
  { title: "Live Telecast",emoji: "📡", desc: "Multi-camera production" },
  { title: "YouTube Live", emoji: "▶️", desc: "Global streaming" },
  { title: "Facebook Live",emoji: "👥", desc: "Social broadcast" },
  { title: "Post-Wedding", emoji: "✨", desc: "Album design & print" },
];

function MarqueeRow({
  items,
  baseVelocity,
}: {
  items: typeof defaultRow1;
  baseVelocity: number; // positive = left, negative = right
}) {
  const tripled = [...items, ...items, ...items];
  const ref = useRef<HTMLDivElement>(null);



  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
      {/* Fade masks on edges */}
      <div className="marquee-mask-left" />
      <div className="marquee-mask-right" />

      <motion.div
        ref={ref}
        className="marquee-track"
        style={{
          animationDuration: `${Math.abs(baseVelocity) > 0 ? 38 : 42}s`,
          animationDirection: baseVelocity > 0 ? "normal" : "reverse",
        }}
      >
        {tripled.map((item, i) => (
          <div key={i} className="marquee-item">
            <div className="marquee-emoji">{item.emoji}</div>
            <div>
              <div className="marquee-title">{item.title}</div>
              <div className="marquee-desc">{item.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

interface MarqueeItem {
  title: string;
  emoji: string;
  desc: string;
}

export function ScrollMarquee({ highlights }: { highlights?: MarqueeItem[] }) {
  const items = highlights && highlights.length > 0 ? highlights : [...defaultRow1, ...defaultRow2];
  const row1 = items.slice(0, Math.ceil(items.length / 2));
  const row2 = items.slice(Math.ceil(items.length / 2));

  return (
    <section className="marquee-section">
      <div className="marquee-rows">
        <MarqueeRow items={row1} baseVelocity={1} />
        <MarqueeRow items={row2} baseVelocity={-1} />
      </div>

      <style>{`
        .marquee-section {
          overflow: hidden;
          padding: var(--space-8) 0;
          background: transparent;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .marquee-rows {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .marquee-track {
          display: flex;
          gap: var(--space-4);
          width: max-content;
          animation: marquee-scroll linear infinite;
          will-change: transform;
        }
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-33.3333%)); }
        }
        .marquee-item {
          width: 220px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-3) var(--space-4);
          transition: border-color 0.25s ease, transform 0.25s ease;
        }
        .marquee-item:hover {
          border-color: var(--border-accent);
          transform: scale(1.03);
        }
        .marquee-emoji {
          font-size: 1.4rem;
          background: var(--bg-elevated);
          width: 42px; height: 42px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .marquee-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .marquee-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        /* Fade masks */
        .marquee-mask-left,
        .marquee-mask-right {
          position: absolute;
          top: 0; bottom: 0;
          width: 100px;
          z-index: 2;
          pointer-events: none;
        }
        .marquee-mask-left  { left: 0;  background: linear-gradient(to right, var(--bg-primary), transparent); }
        .marquee-mask-right { right: 0; background: linear-gradient(to left,  var(--bg-primary), transparent); }
      `}</style>
    </section>
  );
}
