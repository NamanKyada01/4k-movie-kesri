"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Camera, Film, Zap, Heart, Monitor, Layers } from "lucide-react";

const items = [
  {
    title: "Wedding Photography",
    desc: "Capturing the soul of your celebration with high-end optics and emotional depth.",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    icon: Heart,
    tag: "Signature",
  },
  {
    title: "Cinematic Films",
    desc: "4K narrative-driven films that feel like a movie, not just a recording.",
    img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
    icon: Film,
    tag: "Popular",
  },
  {
    title: "Corporate Events",
    desc: "Professional coverage for summits, launches, and gala nights with rapid delivery.",
    img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800",
    icon: Zap,
    tag: "Business",
  },
  {
    title: "Portrait Sessions",
    desc: "Editorial-style portraits for individuals, families, and high-profile executives.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    icon: Camera,
    tag: "Creative",
  },
  {
    title: "LED Screen Services",
    desc: "High-resolution LED walls for events, live feeds, and immersive presentations.",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
    icon: Monitor,
    tag: "Tech",
  }
];

function MonolithCard({ svc, i, isDragging }: { svc: typeof items[0]; i: number; isDragging: boolean }) {
  const Icon = svc.icon;

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <motion.div
      className="monolith-card"
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClickCapture={handleClick}
    >
      <Link 
        href="/services" 
        className="monolith-link"
        onClick={(e) => isDragging && e.preventDefault()}
      >
        <div className="monolith-img-wrap">
          <img src={svc.img} alt={svc.title} className="monolith-img" loading="lazy" />
          <div className="monolith-overlay" />
          <div className="monolith-num">{String(i + 1).padStart(2, '0')}</div>
          <div className="monolith-tag">{svc.tag}</div>
        </div>
        <div className="monolith-info">
          <div className="monolith-icon-row">
            <div className="monolith-icon"><Icon size={20} /></div>
            <h3 className="monolith-title">{svc.title}</h3>
          </div>
          <p className="monolith-desc">{svc.desc}</p>
          <div className="monolith-cta">
            Explore Service <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ServiceCards({ services }: { services?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  return (
    <section className="svc-manual-section">
      <div className="container">
        <div className="svc-header-static">
          <h2 className="svc-title-mini">Our <span className="text-gradient-gold">Expertise.</span></h2>
          <p className="svc-tag-mini">Explore our specialized high-fidelity cinematic services.</p>
        </div>
      </div>

      <div className="svc-horizontal-scroll-container" ref={containerRef}>
        <motion.div 
          className="svc-scroll-track"
          drag="x"
          dragConstraints={containerRef}
          ref={trackRef}
          onDragStart={() => { isDragging.current = true; }}
          onDragEnd={() => {
            // Small timeout to prevent the click that happens at the end of the drag
            setTimeout(() => { isDragging.current = false; }, 50);
          }}
          whileTap={{ cursor: "grabbing" }}
          style={{ cursor: "grab" }}
        >
          {items.map((svc, i) => (
            <MonolithCard key={svc.title} svc={svc} i={i} isDragging={isDragging.current} />
          ))}
          
          <div className="monolith-card monolith-card-cta">
             <Link 
               href="/services" 
               className="monolith-cta-link"
               onClick={(e) => isDragging.current && e.preventDefault()}
             >
                <Layers size={48} color="var(--accent)" />
                <h3>View All Services</h3>
                <p>Discover 9+ specialized cinematic offerings.</p>
                <div className="btn btn-primary btn-sm">Browse Catalog</div>
             </Link>
          </div>
        </motion.div>
      </div>

      <div className="container">
        <div className="svc-scroll-hint">
          <div className="svc-hint-line" />
          <span className="svc-hint-text">Drag or Scroll to Explore</span>
        </div>
      </div>

      <style>{`
        .svc-manual-section { 
          background: #030303; 
          padding-block: clamp(3rem, 8vw, 5rem);
          position: relative; 
          overflow: hidden;
        }
        
        .svc-header-static { 
          margin-bottom: var(--space-12); 
          max-width: 600px;
        }
        .svc-title-mini { 
          font-size: clamp(2rem, 5vw, 2.5rem); 
          font-weight: 900; 
          line-height: 1.1; 
          color: #fff; 
          margin-bottom: 12px; 
          letter-spacing: -0.04em; 
        }
        .svc-tag-mini { 
          font-size: 1.1rem; 
          color: var(--text-muted); 
          opacity: 0.9; 
        }

        .svc-horizontal-scroll-container {
          width: 100%;
          overflow: hidden; /* Changed from auto to hidden for drag */
          padding-bottom: var(--space-8);
          position: relative;
        }

        .svc-scroll-track {
          display: flex;
          gap: var(--space-8);
          width: max-content;
          padding-inline: clamp(1rem, 4vw, 3rem);
          touch-action: pan-y; /* Allow vertical page scroll */
        }

        .monolith-card { 
          flex-shrink: 0; 
          width: 420px; 
          border-radius: 28px; 
          overflow: hidden; 
          background: #080808; 
          border: 1px solid rgba(255,255,255,0.08); 
          box-shadow: 0 30px 60px rgba(0,0,0,0.6); 
          transform: translateZ(0);
          user-select: none; /* Prevent text selection during drag */
        }
        .monolith-card-cta { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: linear-gradient(145deg, #0f0f0f, #050505); 
          border: 1px dashed rgba(212,160,23,0.3); 
        }
        .monolith-cta-link { 
          padding: 60px 40px; 
          text-align: center; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          gap: 20px; 
          text-decoration: none; 
          pointer-events: auto;
        }
        .monolith-cta-link h3 { font-size: 1.6rem; font-weight: 700; color: #fff; }
        .monolith-cta-link p { font-size: 1rem; color: var(--text-muted); }

        .monolith-link { text-decoration: none; display: block; pointer-events: auto; }
        .monolith-img-wrap { height: 260px; position: relative; overflow: hidden; pointer-events: none; }
        .monolith-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .monolith-card:hover .monolith-img { opacity: 1; transform: scale(1.1); }
        .monolith-overlay { position: absolute; inset: 0; background: linear-gradient(to top, #080808, transparent 70%); }
        .monolith-num { position: absolute; top: 20px; left: 20px; font-weight: 800; color: var(--accent); font-size: 0.85rem; background: rgba(0,0,0,0.6); padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(212,160,23,0.3); }
        .monolith-tag { position: absolute; top: 20px; right: 20px; font-size: 0.7rem; font-weight: 800; background: var(--accent); color: #000; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; box-shadow: 0 4px 12px rgba(212,160,23,0.4); }

        .monolith-info { padding: 2.5rem; background: #080808; pointer-events: none; }
        .monolith-icon-row { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
        .monolith-icon { width: 40px; height: 40px; border-radius: 12px; background: rgba(212,160,23,0.12); border: 1px solid rgba(212,160,23,0.3); display: flex; align-items: center; justify-content: center; color: var(--accent); }
        .monolith-title { font-size: 1.4rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
        .monolith-desc { font-size: 1rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 25px; min-height: 3.4em; opacity: 0.8; }
        .monolith-cta { font-size: 0.85rem; font-weight: 800; color: var(--accent); text-transform: uppercase; display: flex; align-items: center; gap: 8px; letter-spacing: 0.05em; transition: gap 0.3s ease; }
        .monolith-card:hover .monolith-cta { gap: 12px; }

        .svc-scroll-hint {
          display: flex;
          align-items: center;
          gap: var(--space-6);
          margin-top: var(--space-6);
          opacity: 0.5;
        }
        .svc-hint-line {
          height: 1px;
          flex: 1;
          background: linear-gradient(to right, var(--accent), transparent);
        }
        .svc-hint-text {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #fff;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .svc-manual-section { padding-block: 4rem; }
          .monolith-card { width: 320px; }
          .monolith-img-wrap { height: 200px; }
          .monolith-info { padding: 1.75rem; }
          .svc-horizontal-scroll-container { overflow-x: auto; } /* Restore native scroll on mobile */
          .svc-scroll-track { cursor: default !important; }
        }
      `}</style>
    </section>
  );
}
