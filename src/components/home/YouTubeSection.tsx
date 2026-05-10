"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Play, Film, Layers } from "lucide-react";
import type { YouTubeVideo } from "@/types";

interface YouTubeSectionProps {
  videos: YouTubeVideo[];
}

function EmptyVideoGrid() {
  return (
    <div className="yt-empty">
      <Film size={40} strokeWidth={1} style={{ color: "var(--border)" }} />
      <h3>Coming Soon</h3>
      <p>Cinematic highlights will appear here.</p>
    </div>
  );
}

function TiltVideoCard({ video, index, isDragging }: {
  video: YouTubeVideo;
  index: number;
  isDragging: boolean;
}) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 25 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 25 });

  const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-y * 10);
    rotateY.set(x * 10);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, "_blank");
  };

  return (
    <motion.div
      className="yt-portal-card"
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClickCapture={handleClick}
    >
      <div className="yt-tv-frame">
        <div className="yt-tv-frame-top" />
        <img src={thumbnailUrl} alt={video.title} className="yt-thumb" />
        <div className="yt-thumb-overlay" />
        <div className="yt-play-btn">
          <Play size={24} fill="white" color="white" />
        </div>
        {video.duration && <div className="yt-duration">{video.duration}</div>}
        <div className="yt-title-bar">
          <h4>{video.title}</h4>
        </div>
      </div>
    </motion.div>
  );
}

export function YouTubeSection({ videos }: YouTubeSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  return (
    <section className="yt-manual-section">
      <div className="container">
        <div className="yt-header-static">
           <h2 className="yt-title-mini">Cinematic <span className="text-gradient-gold">Reels.</span></h2>
           <p className="yt-tag-mini">A handpicked selection of our finest 4K productions.</p>
        </div>
      </div>

      <div className="yt-manual-scroll-area" ref={containerRef}>
        <motion.div 
          className="yt-manual-track"
          drag="x"
          dragConstraints={containerRef}
          ref={trackRef}
          onDragStart={() => { isDragging.current = true; }}
          onDragEnd={() => {
            setTimeout(() => { isDragging.current = false; }, 50);
          }}
          whileTap={{ cursor: "grabbing" }}
          style={{ cursor: "grab" }}
        >
          {videos.length === 0 ? (
            <EmptyVideoGrid />
          ) : (
            videos.map((video, i) => (
              <TiltVideoCard key={video.id} video={video} index={i} isDragging={isDragging.current} />
            ))
          )}
          
          <div className="yt-portal-card yt-card-cta">
             <a 
               href="https://youtube.com/@4kmoviekesri" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="yt-cta-link"
               onClick={(e) => isDragging.current && e.preventDefault()}
             >
                <Layers size={48} color="var(--accent)" />
                <h3>Watch More</h3>
                <p>Subscribe for exclusive 4K content.</p>
                <div className="btn btn-primary btn-sm">Visit YouTube Channel</div>
             </a>
          </div>
        </motion.div>
      </div>

      <div className="container">
        <div className="yt-scroll-indicator">
           <div className="yt-scroll-bar-bg">
              <div className="yt-scroll-thumb" />
           </div>
           <span className="yt-scroll-text">Drag or Scroll to Explore</span>
        </div>
      </div>

      <style>{`
        .yt-manual-section { 
          background: #030303; 
          padding-block: clamp(3rem, 8vw, 5rem);
          position: relative; 
          overflow: hidden;
        }
        
        .yt-header-static { 
          margin-bottom: var(--space-12); 
          max-width: 600px;
        }
        .yt-title-mini { 
          font-size: clamp(2rem, 5vw, 2.5rem); 
          font-weight: 900; 
          line-height: 1.1; 
          color: #fff; 
          margin-bottom: 12px; 
          letter-spacing: -0.04em; 
        }
        .yt-tag-mini { 
          font-size: 1.1rem; 
          color: var(--text-muted); 
          opacity: 0.9; 
        }

        .yt-manual-scroll-area {
          width: 100%;
          overflow: hidden; /* Changed from auto to hidden for drag */
          padding-bottom: var(--space-8);
          position: relative;
        }

        .yt-manual-track {
          display: flex;
          gap: var(--space-10);
          width: max-content;
          padding-inline: clamp(1rem, 4vw, 3rem);
          min-height: 400px;
          align-items: center;
          touch-action: pan-y; /* Allow vertical page scroll */
        }

        .yt-empty {
          width: 560px;
          aspect-ratio: 16/9;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #080808;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 24px;
          text-align: center;
          color: var(--text-muted);
        }
        .yt-empty h3 { color: #fff; margin-top: 15px; font-size: 1.4rem; }
        .yt-empty p { font-size: 0.9rem; margin-top: 5px; opacity: 0.6; }

        .yt-portal-card { 
          flex-shrink: 0; 
          width: 560px; 
          cursor: pointer; 
          transform-style: preserve-3d; 
          transform: translateZ(0);
          user-select: none; /* Prevent text selection during drag */
        }
        .yt-card-cta { display: flex; align-items: center; justify-content: center; background: #080808; border: 1px dashed rgba(212,160,23,0.3); border-radius: 24px; aspect-ratio: 16/9; }
        .yt-cta-link { padding: 40px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 20px; text-decoration: none; pointer-events: auto; }
        .yt-cta-link h3 { font-size: 1.6rem; font-weight: 700; color: #fff; }
        .yt-cta-link p { font-size: 1rem; color: var(--text-muted); }

        .yt-tv-frame { position: relative; aspect-ratio: 16/9; background: #000; border: 1px solid rgba(212,160,23,0.3); border-radius: 24px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.6); pointer-events: none; }
        .yt-tv-frame-top { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent, var(--accent), transparent); z-index: 5; }
        .yt-thumb { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .yt-portal-card:hover .yt-thumb { opacity: 1; transform: scale(1.08); }
        .yt-thumb-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%); }
        .yt-play-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 72px; height: 72px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 40px var(--accent); opacity: 0; transition: 0.4s; }
        .yt-portal-card:hover .yt-play-btn { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        .yt-duration { position: absolute; top: 25px; right: 25px; background: rgba(0,0,0,0.8); padding: 4px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 800; color: #fff; border: 1px solid rgba(255,255,255,0.1); }
        .yt-title-bar { position: absolute; bottom: 0; left: 0; right: 0; padding: 30px; }
        .yt-title-bar h4 { font-size: 1.2rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.01em; }

        .yt-scroll-indicator {
          display: flex;
          align-items: center;
          gap: 24px;
          opacity: 0.4;
          margin-top: var(--space-6);
        }
        .yt-scroll-bar-bg { flex: 1; height: 1px; background: rgba(255,255,255,0.1); position: relative; }
        .yt-scroll-thumb { position: absolute; left: 0; top: -1px; width: 60px; height: 3px; background: var(--accent); border-radius: 2px; }
        .yt-scroll-text { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em; color: #fff; font-weight: 700; }

        @media (max-width: 768px) {
          .yt-manual-section { padding-block: 4rem; }
          .yt-portal-card { width: 360px; }
          .yt-title-bar { padding: 20px; }
          .yt-title-bar h4 { font-size: 1rem; }
          .yt-manual-scroll-area { overflow-x: auto; } /* Restore native scroll on mobile */
          .yt-manual-track { cursor: default !important; }
        }
      `}</style>
    </section>
  );
}
