import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceCards } from "@/components/home/ServiceCards";
import { YouTubeSection } from "@/components/home/YouTubeSection";
import { StatCounters } from "@/components/home/StatCounters";
import { adminDb } from "@/lib/firebase-admin";
import type { YouTubeVideo, Testimonial } from "@/types";

import { Star, CheckCircle2, Camera, Clock, Award, Sparkles } from "lucide-react";
import TiltedCard from "@/components/ui/TiltedCard";
import { CinemaBackground } from "@/components/layout/CinemaBackground";

import { ScrollMarquee } from "@/components/home/ScrollMarquee";
import { PinnedHowItWorks } from "@/components/home/PinnedHowItWorks";
import { ScrollCta } from "@/components/home/ScrollCta";

export const metadata: Metadata = {
  title: "Home",
  description:
    "4K Movie Kesri Surat — Professional photography and videography in Surat, Gujarat. Weddings, corporate events, portraits, and product shoots. Book your session today.",
};

// Fetch data server-side
async function getHomeData() {
  try {
    const [videosSnap, testimonialsSnap, contentSnap, statsSnap, homeSectionsSnap, servicesSnap] = await Promise.all([
      adminDb.collection("youtubeVideos").orderBy("order").limit(4).get(),
      adminDb.collection("testimonials").where("status", "==", "approved").where("featured", "==", true).limit(6).get(),
      adminDb.collection("settings").doc("globalContent").get(),
      adminDb.collection("settings").doc("stats").get(),
      adminDb.collection("settings").doc("homeSections").get(),
      adminDb.collection("settings").doc("servicesContent").get(),
    ]);

    return {
      videos: videosSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as YouTubeVideo[],
      testimonials: testimonialsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Testimonial[],
      content: contentSnap.exists ? contentSnap.data() : null,
      stats: statsSnap.exists ? statsSnap.data() : null,
      homeSections: homeSectionsSnap.exists ? homeSectionsSnap.data() : null,
      services: servicesSnap.exists ? servicesSnap.data()?.services || [] : [],
    };
  } catch {
    return { videos: [], testimonials: [], content: null, stats: null, homeSections: null, services: [] };
  }
}

// ─── Trust Bar ─────────────────────────────────────────────────────────────
function TrustBar() {
  const items = [
    { icon: <Award size={15} />, text: "50+ Industry Awards" },
    { icon: <Camera size={15} />, text: "Sony & Canon Cinema Gear" },
    { icon: <CheckCircle2 size={15} />, text: "500+ Events Delivered" },
    { icon: <Clock size={15} />, text: "48-Hour Turnaround" },
    { icon: <Sparkles size={15} />, text: "4K Cinematic Quality" },
    { icon: <Star size={15} fill="var(--gold)" color="var(--gold)" />, text: "5-Star Rated Studio" },
  ];

  return (
    <section className="trust-bar-section">
      <div className="container">
        <div className="trust-bar-grid">
          {items.map((item, i) => (
            <div key={i} className="trust-bar-item">
              <span className="trust-bar-icon">{item.icon}</span>
              <span className="trust-bar-text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .trust-bar-section {
          background: var(--bg-card);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: var(--space-5) 0;
        }
        .trust-bar-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: var(--space-4);
        }
        .trust-bar-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          justify-content: center;
          position: relative;
        }
        .trust-bar-item::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 80%;
          height: 1px;
          background: linear-gradient(90deg, var(--accent), var(--gold));
          transform-origin: left;
          transition: transform 0.4s ease;
        }
        .trust-bar-item:hover::after { transform: translateX(-50%) scaleX(1); }
        .trust-bar-icon { color: var(--accent); display: flex; }
        .trust-bar-text {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary);
          white-space: nowrap;
        }
        @media (max-width: 900px) { .trust-bar-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 480px) { .trust-bar-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </section>
  );
}

// ─── Testimonials Section ──────────────────────────────────────────────────
function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="section" style={{ background: "transparent" }}>
      <div className="container">
          <div style={{ textAlign: "center", marginBottom: "clamp(var(--space-6), 6vw, var(--space-10))" }}>
            <span style={{ fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
              Client Love
            </span>
            <h2 style={{ marginTop: "var(--space-1)", fontSize: "clamp(1.5rem, 5vw, 2.22rem)" }}>
              What Our Clients Say
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "var(--space-3)", maxWidth: 420, marginInline: "auto" }}>
              Over 500 families and businesses trust us to capture their most important moments.
            </p>
          </div>

        <div className="testimonials-grid">
          {testimonials.slice(0, 6).map((t) => (
            <TiltedCard key={t.id}>
              <div
                className="card"
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "var(--bg-card)",
                  padding: "var(--space-6)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-xl)",
                }}
              >
                <div style={{ display: "flex", gap: 3, marginBottom: "var(--space-4)" }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={13} fill="var(--gold)" color="var(--gold)" />
                  ))}
                </div>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.65, color: "var(--text-secondary)", fontStyle: "italic", flexGrow: 1, marginBottom: "var(--space-5)" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-4)" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--accent-muted)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, color: "var(--accent)", flexShrink: 0 }}>
                    {t.clientName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>{t.clientName}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--accent)", marginTop: 1 }}>{t.eventType}</div>
                  </div>
                </div>
              </div>
            </TiltedCard>
          ))}
        </div>
      </div>

      <style>{`
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
        }
        @media (max-width: 900px) { .testimonials-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .testimonials-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default async function HomePage() {
  const { videos, testimonials, content, stats, homeSections, services } = await getHomeData();

  return (
    <>
      <CinemaBackground theme={{ primary: "gold", secondary: "amber" }} />

      {/* Scene 1 — Hero: curtain wipe + parallax + word-split headline */}
      <HeroSection
        title={content?.heroTitle}
        subtitle={content?.heroSubtitle}
        stats={stats}
      />

      {/* Scene 2 — Trust Bar: blur slide-in stagger */}
      <TrustBar />

      {/* Scene 3 — Stat Counters: scroll-triggered count-up */}
      <StatCounters stats={stats} />

      {/* Scene 4 — Marquee: scroll-velocity reactive speed */}
      <ScrollMarquee highlights={homeSections?.highlights} />

      {/* Scene 5 — How It Works: pinned vertical reveal */}
      <PinnedHowItWorks steps={homeSections?.howItWorks} />

      {/* Scene 6 — Services: 3D perspective card entrance */}
      <ServiceCards services={services} />

      {/* YouTube */}
      <YouTubeSection videos={videos} />

      {/* Testimonials: scale reveal stagger */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Scene 7 — CTA: split text + particles */}
      <ScrollCta text={content?.contactFooterText} />

      <style>{`
        @media (max-width: 768px) { .section { padding: var(--space-8) 0 !important; } }
        @media (max-width: 480px) { .section { padding: var(--space-6) 0 !important; } }
      `}</style>
    </>
  );
}
