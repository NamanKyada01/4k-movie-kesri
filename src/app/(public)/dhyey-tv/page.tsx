"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Particles from "@/components/ui/Particles";
import { Tv, Radio, Clock, Calendar, PlayCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

/* ─── Helpers ─────────────────────────────────────────────── */
function extractVideoId(url: string): string {
  if (!url) return "eQuoqPa1XIE"; // default fallback
  // already a bare ID (no slashes or dots)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  try {
    const u = new URL(url.trim());
    // youtu.be/ID
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    // youtube.com/watch?v=ID
    return u.searchParams.get("v") || url.trim();
  } catch {
    return url.trim();
  }
}

/* ─── Static schedule data ─────────────────────────────────── */
const schedule = [
  { time: "06:00 – 08:00", title: "Mangala Aarti & Morning Prayers",  category: "Bhajan",  day: "Daily" },
  { time: "09:00 – 11:00", title: "Shree Mad Bhagwat Saptha",          category: "Katha",   day: "Mon–Fri" },
  { time: "12:00 – 14:00", title: "Santvani Kirtan Mandal",            category: "Bhajan",  day: "Daily" },
  { time: "15:00 – 17:00", title: "Gujarati Dayro – Live",             category: "Dayro",   day: "Weekends" },
  { time: "18:00 – 20:00", title: "Pravachan — Param Pujya Swami",     category: "Katha",   day: "Daily" },
  { time: "21:00 – 23:00", title: "Bhakti Sangeet Sandhya",            category: "Bhajan",  day: "Daily" },
];

const categories = ["All", "Bhajan", "Katha", "Dayro"];

const categoryColor: Record<string, string> = {
  Bhajan: "#E6C364",
  Katha:  "#E8550A",
  Dayro:  "#c084fc",
};

/* ─── Component ────────────────────────────────────────────── */
export default function DhyeyTvPage() {
  const [videoId, setVideoId] = useState("eQuoqPa1XIE");
  const [activeCategory, setActiveCategory] = useState("All");
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "globalConfig"));
        if (snap.exists()) {
          const raw = snap.data().dhyeyTvUrl || "";
          if (raw) setVideoId(extractVideoId(raw));
        }
      } catch {}
      setPlayerReady(true);
    };
    load();
  }, []);

  const filtered = activeCategory === "All"
    ? schedule
    : schedule.filter(s => s.category === activeCategory);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1`;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", overflowX: "hidden", paddingTop: "var(--nav-height)" }}>

      {/* ── Spiritual Particle Aura ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <Particles
          particleColors={["#E6C364", "#E8550A", "#fbbf24"]}
          particleCount={60}
          particleSpread={12}
          speed={0.04}
          particleBaseSize={80}
          moveParticlesOnHover={false}
          alphaParticles={true}
        />
      </div>

      {/* ── Radial golden glow (top) ── */}
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "80vw", height: "60vh", zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at top, rgba(230,195,100,0.08) 0%, transparent 70%)",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ══ HERO / PLAYER SECTION ══ */}
        <section style={{ padding: "var(--space-12) 0 var(--space-10)", textAlign: "center" }}>
          <div className="container">

            {/* Channel branding */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{ marginBottom: "var(--space-6)" }}
            >
              {/* Live badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 100, padding: "4px 12px", marginBottom: "var(--space-4)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 8px 2px rgba(239,68,68,0.5)", display: "inline-block", animation: "dhyeyPulse 1.5s infinite" }} />
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", color: "#ef4444", textTransform: "uppercase" }}>Live 24 × 7</span>
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: "var(--font-heading)", fontWeight: 900,
                fontSize: "clamp(2.2rem, 7vw, 4.5rem)",
                letterSpacing: "-0.04em", lineHeight: 0.95,
                background: "linear-gradient(135deg, #E6C364 0%, #fbbf24 40%, #E8550A 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "var(--space-2)",
              }}>
                DHYEY TV
              </h1>
              <p style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase" }}>
                ॥ ધ્યેય ટીવી ॥ &nbsp;·&nbsp; Gujarati Religious Channel
              </p>
            </motion.div>

            {/* ── Player ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                position: "relative",
                maxWidth: 900,
                margin: "0 auto",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                boxShadow: "0 0 80px 10px rgba(230,195,100,0.12), 0 40px 80px rgba(0,0,0,0.6)",
                border: "1px solid rgba(230,195,100,0.15)",
                background: "#000",
              }}
            >
              {/* Golden top-edge glow line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #E6C364 30%, #E8550A 70%, transparent)", zIndex: 2 }} />

              {playerReady ? (
                <div style={{ position: "relative", paddingTop: "56.25%" }}>
                  <iframe
                    src={embedUrl}
                    title="Dhyey TV Live"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                  />
                </div>
              ) : (
                <div style={{ aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
                  <div style={{ textAlign: "center" }}>
                    <Tv size={40} color="#E6C364" style={{ marginBottom: 12, opacity: 0.6 }} />
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading stream…</p>
                  </div>
                </div>
              )}

              {/* Bottom bar with channel info */}
              <div style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(10px)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Radio size={14} color="#E6C364" />
                  <span style={{ fontSize: "0.8rem", color: "#E6C364", fontWeight: 600 }}>DHYEY TV LIVE</span>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#E6C364")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                >
                  Watch on YouTube <ChevronRight size={12} />
                </a>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ══ CHANNEL INFO STRIP ══ */}
        <section style={{ background: "rgba(230,195,100,0.04)", borderTop: "1px solid rgba(230,195,100,0.1)", borderBottom: "1px solid rgba(230,195,100,0.1)", padding: "var(--space-6) 0" }}>
          <div className="container">
            <div className="info-strip-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "var(--space-4)", justifyContent: "center" }}>
              {[
                { icon: Tv,       label: "Channel",  value: "Dhyey TV" },
                { icon: Radio,    label: "Broadcast", value: "24 × 7 Live" },
                { icon: PlayCircle, label: "Content", value: "Religious" },
                { icon: Clock,    label: "Programs",  value: "6 Shows" },
                { icon: Calendar, label: "Coverage",  value: "Bhajan · Katha" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <Icon size={18} color="#E6C364" style={{ marginBottom: 6 }} />
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 700, lineHeight: 1.1 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ SCHEDULE SECTION ══ */}
        <section style={{ padding: "var(--space-16) 0" }}>
          <div className="container">

            {/* Section header */}
            <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
              <p style={{ fontSize: "0.72rem", letterSpacing: "0.2em", color: "#E6C364", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
                Program Schedule
              </p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(1.8rem, 5vw, 2.8rem)", letterSpacing: "-0.03em" }}>
                Daily Programming Guide
              </h2>
            </div>

            {/* Category filter */}
            <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap", marginBottom: "var(--space-8)" }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 100,
                    border: "1px solid",
                    borderColor: activeCategory === cat ? "#E6C364" : "var(--border)",
                    background: activeCategory === cat ? "rgba(230,195,100,0.12)" : "transparent",
                    color: activeCategory === cat ? "#E6C364" : "var(--text-muted)",
                    fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Schedule grid */}
            <div className="schedule-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-4)", maxWidth: 1000, margin: "0 auto" }}>
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.title}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    style={{
                      background: "var(--bg-card, #1a1a1a)",
                      border: "1px solid rgba(230,195,100,0.08)",
                      borderRadius: "var(--radius-lg)",
                      padding: "clamp(var(--space-3), 2.5vw, var(--space-5))",
                      position: "relative",
                      overflow: "hidden",
                      cursor: "default",
                      minHeight: "75px",
                    }}
                    whileHover={{ borderColor: "rgba(230,195,100,0.25)", y: -2 }}
                  >
                    {/* Left accent line */}
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: categoryColor[item.category] || "#E6C364", borderRadius: "3px 0 0 3px" }} />

                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 4, fontFamily: "monospace", letterSpacing: "0.02em" }}>{item.time}</div>
                        <div className="schedule-title" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: 8 }}>{item.title}</div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <span style={{
                            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em",
                            textTransform: "uppercase", padding: "3px 10px", borderRadius: 100,
                            background: `${categoryColor[item.category] || "#E6C364"}20`,
                            color: categoryColor[item.category] || "#E6C364",
                            border: `1px solid ${categoryColor[item.category] || "#E6C364"}40`,
                          }}>{item.category}</span>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{item.day}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* ══ ABOUT SECTION ══ */}
        <section style={{ background: "rgba(230,195,100,0.03)", borderTop: "1px solid rgba(230,195,100,0.06)", padding: "var(--space-16) 0" }}>
          <div className="container" style={{ maxWidth: 780, textAlign: "center" }}>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.2em", color: "#E6C364", textTransform: "uppercase", marginBottom: "var(--space-4)" }}>About the Channel</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", letterSpacing: "-0.03em", marginBottom: "var(--space-5)" }}>
              ॥ ધ્યેય ટીવી ॥
            </h2>
            <p className="about-channel-text" style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
              Dhyey TV is a 24/7 Gujarati religious broadcasting channel dedicated to spreading devotion, wisdom, and cultural heritage. Presented by 4K Movie Kesri Surat, the channel features soul-stirring content including <strong style={{ color: "var(--text-primary)" }}>Shree Mad Bhagwat Saptha</strong>, <strong style={{ color: "var(--text-primary)" }}>Gujarati Dayro</strong>, Santvani, Kirtans, and live cultural events.
            </p>
            <p className="about-channel-text" style={{ fontSize: "0.88rem", lineHeight: 1.8, color: "var(--text-muted)" }}>
              Watch live on YouTube — the stream runs continuously, bringing the divine into your home at any hour of the day or night.
            </p>
            <div style={{ marginTop: "var(--space-8)", display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <PlayCircle size={16} /> Watch on YouTube
              </a>
              <Link href="/contact" className="btn btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                Contact Us
              </Link>
            </div>
          </div>
        </section>

      </div>

      <style>{`
        @keyframes dhyeyPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px 3px rgba(239,68,68,0.7); }
          50%       { opacity: 0.7; box-shadow: 0 0 16px 6px rgba(239,68,68,0.4); }
        }
        @media (max-width: 768px) {
          .info-strip-grid { grid-template-columns: repeat(3, 1fr) !important; gap: var(--space-4) !important; }
          .info-strip-grid > div { flex-direction: row !important; gap: 8px !important; text-align: left !important; justify-content: flex-start !important; }
          .info-strip-grid > div div:first-child { font-size: 0.65rem !important; }
          .info-strip-grid > div div:last-child { font-size: 0.85rem !important; }
          .info-strip-grid [data-lucide] { margin-bottom: 0 !important; width: 16px !important; height: 16px !important; }

          .schedule-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .schedule-grid > div { padding: 12px 10px !important; }
          .schedule-title { font-size: 0.82rem !important; margin-bottom: 2px !important; }
          .about-channel-text { font-size: 0.8rem !important; line-height: 1.6 !important; }
        }
        @media (max-width: 480px) {
          .info-strip-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .info-strip-grid > div { gap: 6px !important; }
          .info-strip-grid [data-lucide] { width: 14px !important; height: 14px !important; }
          .info-strip-grid div div:first-child { font-size: 0.5rem !important; }
          .info-strip-grid div div:last-child { font-size: 0.65rem !important; }
          
          .schedule-grid { gap: 6px !important; }
          .schedule-grid > div { padding: 8px !important; }
          .schedule-title { font-size: 0.75rem !important; }
          .info-strip-grid div div:last-child { font-size: 0.58rem !important; }
        }
      `}</style>
    </main>
  );
}
