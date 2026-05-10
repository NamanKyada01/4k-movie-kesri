"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tv, Radio, Clock, Calendar, PlayCircle, ChevronRight, Activity, Share2, Info } from "lucide-react";
import Link from "next/link";
import { CinemaBackground } from "@/components/layout/CinemaBackground";
import ShinyText from "@/components/ui/ShinyText";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

function extractVideoId(url: string): string {
  if (!url) return "eQuoqPa1XIE";
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  try {
    const u = new URL(url.trim());
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    return u.searchParams.get("v") || url.trim();
  } catch {
    return url.trim();
  }
}

const categories = ["All", "Bhajan", "Katha", "Dayro"];
const categoryColor: Record<string, string> = {
  Bhajan: "#E6C364",
  Katha:  "#E8550A",
  Dayro:  "#c084fc",
};

interface DhyeyTvClientProps {
  initialVideoId: string;
  schedule: any[];
}

export function DhyeyTvClient({ initialVideoId, schedule }: DhyeyTvClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const videoId = extractVideoId(initialVideoId);

  const filtered = activeCategory === "All"
    ? schedule
    : schedule.filter(s => s.category === activeCategory);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1`;

  return (
    <main className="dhyey-tv-main">
      <CinemaBackground theme={{ primary: "amber", secondary: "gold", accent: "rose" }} />

      <div className="dhyey-tv-content">
        {/* ══ HERO / PLAYER SECTION ══ */}
        <section className="player-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="player-header"
            >
              <div className="live-pill">
                <Activity size={14} className="pulse-icon" />
                <span>Broadcasting Live 24/7</span>
              </div>

              <h1 className="dhyey-tv-title">
                DHYEY <span className="text-gradient-gold">TV</span>
              </h1>
              
              <div className="sub-header-wrap">
                <div className="divider-line" />
                <p className="dhyey-tv-tagline">॥ ધ્યેય ટીવી ॥ &nbsp;·&nbsp; GUJARATI SPIRITUAL HERITAGE</p>
                <div className="divider-line" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="glass-player-frame"
            >
              <div className="frame-top-shimmer" />
              <div className="iframe-aspect-ratio">
                <iframe
                  src={embedUrl}
                  title="Dhyey TV Live"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="live-iframe"
                />
              </div>

              <div className="player-meta-bar">
                <div className="channel-info">
                  <div className="live-indicator">
                    <span className="live-dot" />
                  </div>
                  <ShinyText text="DHYEY TV LIVE BROADCAST" className="meta-text" speed={3} />
                </div>
                <div className="player-actions">
                  <button className="action-btn" title="Share">
                    <Share2 size={16} />
                  </button>
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank" rel="noopener noreferrer"
                    className="action-btn-yt"
                  >
                    <span>Watch on YouTube</span>
                    <ChevronRight size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ STATS STRIP ══ */}
        <section className="stats-strip">
          <div className="container">
            <div className="stats-strip-grid">
              {[
                { icon: Tv, label: "Network", value: "Dhyey TV" },
                { icon: Radio, label: "Mode", value: "Digital Live" },
                { icon: PlayCircle, label: "Niche", value: "Spiritual" },
                { icon: Clock, label: "Daily", value: "24 Hours" },
                { icon: Calendar, label: "Updates", value: "Live Daily" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="stat-strip-item">
                  <div className="stat-icon-circle">
                    <Icon size={16} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label-text">{label}</span>
                    <span className="stat-value-text">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ SCHEDULE SECTION ══ */}
        <section className="schedule-section">
          <div className="container">
            <div className="section-header-center">
              <span className="section-tag">Program Guide</span>
              <h2 className="section-title">Daily Broadcast Schedule</h2>
            </div>

            <div className="category-filter-bar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="schedule-grid">
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.title + i}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <SpotlightCard className="program-card">
                      <div 
                        className="program-border-accent" 
                        style={{ background: categoryColor[item.category] || "var(--gold)" }} 
                      />
                      <div className="program-card-content">
                        <div className="program-time-wrap">
                          <Clock size={12} className="time-icon" />
                          <span className="program-time">{item.time}</span>
                        </div>
                        <h3 className="program-title">{item.title}</h3>
                        <div className="program-footer">
                          <span 
                            className="category-badge"
                            style={{ 
                              background: `${categoryColor[item.category] || "var(--gold)"}15`,
                              color: categoryColor[item.category] || "var(--gold)",
                              borderColor: `${categoryColor[item.category] || "var(--gold)"}30`
                            }}
                          >
                            {item.category}
                          </span>
                          <span className="program-day">{item.day}</span>
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ══ ABOUT SECTION ══ */}
        <section className="about-dhyey-section">
          <div className="container">
            <div className="about-glass-box">
              <div className="about-icon-float">
                <Info size={32} />
              </div>
              <span className="about-tag">About Dhyey TV</span>
              <h2 className="about-title">॥ ધ્યેય ટીવી ॥</h2>
              <p className="about-desc">
                Dhyey TV is a 24/7 Gujarati religious broadcasting channel dedicated to spreading devotion, 
                wisdom, and cultural heritage. Presented by <strong>4K Movie Kesri Surat</strong>, we feature 
                soul-stirring content including Shree Mad Bhagwat Saptha, Gujarati Dayro, Santvani, 
                and live cultural events that connect you to your roots.
              </p>
              <div className="about-cta-group">
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-gold-glow"
                >
                  <PlayCircle size={18} />
                  <span>Subscribe on YouTube</span>
                </a>
                <Link href="/contact" className="btn-outline-glass">
                  Channel Partnership
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .dhyey-tv-main {
          min-height: 100vh;
          position: relative;
          padding-top: var(--nav-height);
        }

        .dhyey-tv-content {
          position: relative;
          z-index: 10;
        }

        /* Hero Player */
        .player-section { padding-block: 4rem 2rem; }
        .player-header { text-align: center; margin-bottom: 3rem; }
        
        .live-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 6px 16px;
          border-radius: 100px;
          color: #ef4444;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1.5rem;
        }
        .pulse-icon { animation: live-pulse 2s infinite; }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .dhyey-tv-title {
          font-family: var(--font-heading);
          font-size: clamp(3rem, 10vw, 5rem);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -0.04em;
          margin-bottom: 1rem;
          color: #fff;
        }

        .sub-header-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          opacity: 0.6;
        }
        .divider-line { width: 40px; height: 1px; background: var(--gold); }
        .dhyey-tv-tagline {
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .glass-player-frame {
          max-width: 1000px;
          margin: 0 auto;
          background: #000;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          box-shadow: 0 50px 100px rgba(0,0,0,0.8), 0 0 50px rgba(212,160,23,0.1);
          position: relative;
        }
        .frame-top-shimmer {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          z-index: 5;
        }
        .iframe-aspect-ratio { position: relative; padding-top: 56.25%; }
        .live-iframe {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          border: none;
        }

        .player-meta-bar {
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(20px);
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .channel-info { display: flex; align-items: center; gap: 12px; }
        .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; display: block; box-shadow: 0 0 10px #ef4444; }
        .meta-text { font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em; color: var(--gold) !important; }

        .player-actions { display: flex; align-items: center; gap: 12px; }
        .action-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          color: #fff; cursor: pointer; transition: 0.3s;
        }
        .action-btn:hover { background: rgba(255,255,255,0.1); transform: scale(1.1); }
        .action-btn-yt {
          display: flex; align-items: center; gap: 8px;
          background: #fff; color: #000;
          padding: 8px 16px; border-radius: 100px;
          font-size: 0.75rem; font-weight: 700;
          text-decoration: none; transition: 0.3s;
        }
        .action-btn-yt:hover { background: var(--gold); transform: scale(1.05); }

        /* Stats Strip */
        .stats-strip { margin-top: 2rem; }
        .stats-strip-grid {
          display: grid; grid-template-columns: repeat(5, 1fr);
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px; padding: 1.5rem;
        }
        .stat-strip-item { display: flex; align-items: center; gap: 12px; padding-inline: 1rem; border-right: 1px solid rgba(255,255,255,0.05); }
        .stat-strip-item:last-child { border-right: none; }
        .stat-icon-circle { width: 32px; height: 32px; border-radius: 50%; background: rgba(212,160,23,0.1); border: 1px solid rgba(212,160,23,0.2); display: flex; align-items: center; justify-content: center; color: var(--gold); }
        .stat-content { display: flex; flex-direction: column; }
        .stat-label-text { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-value-text { font-size: 0.9rem; font-weight: 700; color: #fff; }

        /* Schedule Section */
        .schedule-section { padding-block: 6rem; }
        .section-header-center { text-align: center; margin-bottom: 3rem; }
        .section-tag { font-size: 0.7rem; font-weight: 800; color: var(--gold); text-transform: uppercase; letter-spacing: 0.3em; margin-bottom: 1rem; display: block; }
        .section-title { font-family: var(--font-heading); font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; color: #fff; }

        .category-filter-bar {
          display: flex; justify-content: center; gap: 12px; margin-bottom: 3rem; flex-wrap: wrap;
        }
        .filter-tab {
          padding: 10px 24px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.1);
          background: transparent; color: var(--text-muted); font-size: 0.85rem; font-weight: 600;
          cursor: pointer; transition: 0.3s;
        }
        .filter-tab.active { background: var(--gold); color: #000; border-color: var(--gold); box-shadow: 0 10px 20px rgba(212,160,23,0.2); }

        .schedule-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem; max-width: 1200px; margin: 0 auto;
        }
        .program-card { height: 100%; min-height: 140px; position: relative; border-radius: 20px !important; }
        .program-border-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-radius: 4px 0 0 4px; }
        .program-card-content { padding: 1.5rem; display: flex; flex-direction: column; height: 100%; }
        .program-time-wrap { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; opacity: 0.6; }
        .program-time { font-size: 0.85rem; font-weight: 700; font-family: monospace; }
        .program-title { font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: auto; line-height: 1.3; }
        .program-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 1.5rem; }
        .category-badge { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 100px; border: 1px solid; }
        .program-day { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }

        /* About Section */
        .about-dhyey-section { padding-bottom: 8rem; }
        .about-glass-box {
          max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05); border-radius: 32px;
          padding: 4rem 3rem; text-align: center; position: relative; overflow: hidden;
        }
        .about-icon-float {
          width: 80px; height: 80px; border-radius: 50%; background: rgba(212,160,23,0.1);
          display: flex; align-items: center; justify-content: center; color: var(--gold);
          margin: 0 auto 2rem; position: relative;
        }
        .about-tag { font-size: 0.7rem; font-weight: 800; color: var(--gold); text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1rem; display: block; }
        .about-title { font-family: var(--font-heading); font-size: 2.5rem; font-weight: 800; color: #fff; margin-bottom: 1.5rem; }
        .about-desc { font-size: 1.1rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 3rem; }
        
        .about-cta-group { display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap; }
        .btn-gold-glow {
          display: flex; align-items: center; gap: 12px;
          background: var(--gold); color: #000;
          padding: 1rem 2rem; border-radius: 100px;
          font-weight: 800; text-decoration: none;
          box-shadow: 0 20px 40px rgba(212,160,23,0.3); transition: 0.3s;
        }
        .btn-gold-glow:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 25px 50px rgba(212,160,23,0.4); }
        .btn-outline-glass {
          padding: 1rem 2.5rem; border-radius: 100px; border: 1px solid rgba(255,255,255,0.1);
          color: #fff; text-decoration: none; font-weight: 700; transition: 0.3s;
        }
        .btn-outline-glass:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.3); }

        @media (max-width: 768px) {
          .stats-strip-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
          .stat-strip-item { border-right: none; }
          .stat-strip-item:nth-child(2n) { border-right: none; }
          .about-glass-box { padding: 3rem 1.5rem; }
          .dhyey-tv-title { font-size: 3.5rem; }
          .sub-header-wrap { flex-direction: column; gap: 10px; }
          .divider-line { display: none; }
        }

        @keyframes dhyeyPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px 3px rgba(239, 68, 68, 0.7); }
          50% { opacity: 0.7; box-shadow: 0 0 16px 6px rgba(239, 68, 68, 0.4); }
        }
        @media (max-width: 768px) {
          .info-strip-grid { grid-template-columns: repeat(3, 1fr) !important; gap: var(--space-4) !important; }
          .schedule-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .info-strip-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .schedule-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
