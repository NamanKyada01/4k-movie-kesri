import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceCards } from "@/components/home/ServiceCards";
import { YouTubeSection } from "@/components/home/YouTubeSection";
import { StatCounters } from "@/components/home/StatCounters";
import { adminDb } from "@/lib/firebase-admin";
import type { YouTubeVideo, GalleryPhoto, Testimonial } from "@/types";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { ArrowRight, Star, CheckCircle2, Camera, Clock, Award, Sparkles } from "lucide-react";
import TiltedCard from "@/components/ui/TiltedCard";
import { CinemaBackground } from "@/components/layout/CinemaBackground";
import { SectionDecorator } from "@/components/ui/SectionDecorator";

export const metadata: Metadata = {
  title: "Home",
  description:
    "4K Movie Kesri Surat — Professional photography and videography in Surat, Gujarat. Weddings, corporate events, portraits, and product shoots. Book your session today.",
};

// Fetch data server-side
async function getHomeData() {
  try {
    const [videosSnap, photosSnap, testimonialsSnap, contentSnap] = await Promise.all([
      adminDb.collection("youtubeVideos").orderBy("order").limit(4).get(),
      adminDb.collection("gallery").where("featured", "==", true).limit(6).get(),
      adminDb.collection("testimonials").where("status", "==", "approved").where("featured", "==", true).limit(6).get(),
      adminDb.collection("settings").doc("globalContent").get(),
    ]);

    return {
      videos: videosSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as YouTubeVideo[],
      photos: photosSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as GalleryPhoto[],
      testimonials: testimonialsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Testimonial[],
      content: contentSnap.exists ? contentSnap.data() : null,
    };
  } catch {
    return { videos: [], photos: [], testimonials: [] };
  }
}

// ─── Trust Bar ────────────────────────────────────────────────────────────
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
    <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "var(--space-4) 0" }}>
      <div className="container">
        <div className="trust-bar-grid">
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", justifyContent: "center" }}>
              <span style={{ color: "var(--accent)" }}>{item.icon}</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .trust-bar-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: var(--space-4);
        }
        @media (max-width: 900px) {
          .trust-bar-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .trust-bar-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}

// ─── Featured Works Section ───────────────────────────────────────────────
const FALLBACK_GALLERY_IMAGES = [
  { id: "f1", title: "Royal Rajput Wedding", category: "wedding", cloudinaryUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" },
  { id: "f2", title: "Golden Hour Pre-Wedding", category: "pre-wedding", cloudinaryUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800" },
  { id: "f3", title: "Corporate Gala 2025", category: "corporate", cloudinaryUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800" },
  { id: "f4", title: "Cinematic Portrait", category: "portrait", cloudinaryUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800" },
  { id: "f5", title: "Haldi Ceremony", category: "wedding", cloudinaryUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800" },
  { id: "f6", title: "Product Launch", category: "event", cloudinaryUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800" },
];

function FeaturedWorks({ photos }: { photos: GalleryPhoto[] }) {
  const displayPhotos = photos.length > 0 ? photos : FALLBACK_GALLERY_IMAGES;

  return (
    <section className="section" style={{ background: "transparent" }}>
      <div className="container">
        <ScrollReveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-8)", flexWrap: "wrap", gap: "var(--space-4)" }}>
            <div>
              <span style={{ fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
                Our Work
              </span>
              <h2 style={{ marginTop: "var(--space-1)", fontSize: "clamp(1.5rem, 5vw, 2.22rem)" }}>
                Featured Gallery
              </h2>
            </div>
            <Link href="/gallery" className="btn btn-ghost btn-sm" style={{ display: "inline-flex", gap: 6 }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div style={{ columnCount: 3, columnGap: "var(--space-4)" }} className="gallery-masonry">
          {displayPhotos.map((photo, i) => (
            <Link
              key={photo.id}
              href="/gallery"
              className="group"
              style={{
                display: "block",
                breakInside: "avoid",
                marginBottom: "var(--space-4)",
                aspectRatio: i % 3 === 1 ? "2/3" : "3/2",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                position: "relative",
                background: "var(--bg-elevated)",
              }}
            >
              <img
                src={photo.cloudinaryUrl}
                alt={photo.title}
                className="group-hover:scale-105"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
              />
              <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                <span className="badge badge-accent" style={{ textTransform: "capitalize" }}>{photo.category}</span>
              </div>
            </Link>
          ))}
          </div>
        </ScrollReveal>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .gallery-masonry { column-count: 2 !important; }
        }
        @media (max-width: 420px) {
          .gallery-masonry { column-count: 1 !important; }
        }
      `}</style>
    </section>
  );
}

// ─── How It Works Section ─────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Consultation",
      desc: "Free discovery call to understand your vision, timeline, and aesthetic preferences.",
      icon: "💬",
      color: "rgba(212,160,23,0.08)",
    },
    {
      number: "02",
      title: "Planning",
      desc: "Location scouting, lighting design, and a detailed shot list crafted just for your event.",
      icon: "📋",
      color: "rgba(200,16,46,0.06)",
    },
    {
      number: "03",
      title: "Production",
      desc: "We arrive early, deploy cinema-grade gear, and capture every moment with precision.",
      icon: "🎬",
      color: "rgba(212,160,23,0.08)",
    },
    {
      number: "04",
      title: "Delivery",
      desc: "Color-graded 4K films and edited photos delivered within 48 hours to a private gallery.",
      icon: "✨",
      color: "rgba(200,16,46,0.06)",
    },
  ];

  return (
    <section style={{ background: "transparent", position: "relative", overflow: "hidden", paddingBlock: "clamp(4rem, 10vw, 7rem)" }}>
      <SectionDecorator watermark="PROCESS" />


      <div className="container">
        <ScrollReveal>
          <div style={{ textAlign: "center", marginBottom: "clamp(var(--space-10), 6vw, var(--space-16))" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
              — The Process
            </span>
            <h2 style={{ marginTop: "var(--space-3)", fontSize: "clamp(2rem, 6vw, 3.5rem)", letterSpacing: "-0.03em" }}>
              From Vision to<br />
              <span className="text-gradient-gold">Masterpiece.</span>
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "var(--space-4)", maxWidth: 460, marginInline: "auto", lineHeight: 1.7 }}>
              A seamless four-step journey that turns your most important moments into cinematic art.
            </p>
          </div>
        </ScrollReveal>

        <div className="process-grid">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.12}>
              <div className="process-card" style={{ background: `linear-gradient(135deg, var(--bg-card) 0%, ${step.color} 100%)`, border: "1px solid var(--border)", borderRadius: "var(--radius-2xl)", padding: "var(--space-8)", position: "relative", overflow: "hidden", height: "100%" }}>
                {/* Giant step watermark */}
                <div style={{
                  position: "absolute",
                  bottom: -16,
                  right: 12,
                  fontFamily: "var(--font-heading)",
                  fontSize: "7rem",
                  fontWeight: 900,
                  color: "var(--accent)",
                  opacity: 0.06,
                  lineHeight: 1,
                  userSelect: "none",
                  letterSpacing: "-0.04em",
                }}>{step.number}</div>

                {/* Gold top accent line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: i % 2 === 0 ? "linear-gradient(90deg, var(--accent), transparent)" : "linear-gradient(90deg, var(--accent-2), transparent)", borderRadius: "var(--radius-2xl) var(--radius-2xl) 0 0" }} />

                <div style={{ fontSize: "2rem", marginBottom: "var(--space-5)" }}>{step.icon}</div>
                <div style={{ fontSize: "0.62rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: "var(--space-2)", fontFamily: "var(--font-body)" }}>
                  Step {step.number}
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "var(--space-3)", letterSpacing: "-0.01em" }}>{step.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{step.desc}</p>

                {/* Arrow connector (not on last) */}
                {i < steps.length - 1 && (
                  <div className="process-connector" />
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div style={{ textAlign: "center", marginTop: "var(--space-12)" }}>
            <Link href="/contact" className="btn btn-primary btn-lg" style={{ borderRadius: "var(--radius-full)" }}>
              Start Your Journey <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      <style>{`
        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-5);
          position: relative;
        }
        .process-card {
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .process-card:hover {
          transform: translateY(-6px);
          border-color: var(--border-accent) !important;
          box-shadow: var(--shadow-accent);
        }
        .process-connector {
          position: absolute;
          top: 50%;
          right: -18px;
          transform: translateY(-50%);
          width: 16px;
          height: 2px;
          background: linear-gradient(90deg, var(--accent), transparent);
          z-index: 10;
        }
        @media (max-width: 1024px) {
          .process-grid { grid-template-columns: repeat(2, 1fr); }
          .process-connector { display: none; }
        }
        @media (max-width: 600px) {
          .process-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

// ─── Infinite Highlights Marquee (Dual Row Bidirectional) ─────────────────
function InfiniteHighlights() {
  const row1 = [
    { title: "Weddings",     emoji: "💍", desc: "Cinematic wedding films" },
    { title: "Pre-Wedding",  emoji: "💑", desc: "Golden hour sessions" },
    { title: "Corporate",    emoji: "🏢", desc: "Professional event coverage" },
    { title: "Portraits",    emoji: "📸", desc: "Studio & outdoor sessions" },
    { title: "Products",     emoji: "🛍️", desc: "High-end commercial" },
    { title: "Videography",  emoji: "🎬", desc: "4K cinematic films" },
  ];
  const row2 = [
    { title: "LED Screens",  emoji: "📺", desc: "Stage & event backdrops" },
    { title: "Crane Shots",  emoji: "🎥", desc: "Aerial & jib coverage" },
    { title: "Live Telecast",emoji: "📡", desc: "Multi-camera production" },
    { title: "YouTube Live", emoji: "▶️", desc: "Global streaming" },
    { title: "Facebook Live",emoji: "👥", desc: "Social broadcast" },
    { title: "Post-Wedding", emoji: "✨", desc: "Album design & print" },
  ];

  const MarqueeRow = ({ items, direction = "left" }: { items: typeof row1; direction?: "left" | "right" }) => {
    const tripled = [...items, ...items, ...items];
    return (
      <div style={{ overflow: "hidden", width: "100%" }}>
        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            width: "max-content",
            animation: `marquee-${direction} 35s linear infinite`,
          }}
        >
          {tripled.map((item, i) => (
            <div
              key={i}
              style={{
                width: 220,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-3) var(--space-4)",
                transition: "border-color 0.25s ease",
              }}
            >
              <div style={{
                fontSize: "1.4rem",
                background: "var(--bg-elevated)",
                width: 42,
                height: 42,
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {item.emoji}
              </div>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 1 }}>{item.title}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section style={{
      overflow: "hidden",
      padding: "var(--space-8) 0",
      background: "transparent",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
    }}>
      <MarqueeRow items={row1} direction="left" />
      <MarqueeRow items={row2} direction="right" />
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-33.333333% - (var(--space-4) / 3))); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(calc(-33.333333% - (var(--space-4) / 3))); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}


// ─── Testimonials Section ─────────────────────────────────────────────────
function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const mockTestimonials = [
    { clientName: "Priya & Rahul Patel", eventType: "Wedding", rating: 5, text: "Absolutely stunning work! Every moment of our wedding was captured beautifully. The team was professional, punctual and incredibly talented. We will cherish these photos forever." },
    { clientName: "Anjali Mehta", eventType: "Portrait", rating: 5, text: "Got my corporate headshots done here. The lighting, composition, and post-processing was exceptional. Exactly what I needed for my brand." },
    { clientName: "InnovateTech Ltd", eventType: "Corporate Event", rating: 5, text: "Covered our annual conference perfectly. All 200+ attendees were photographed and the team delivered the edited photos within 48 hours. Highly recommended!" },
    { clientName: "Sneha & Arjun Shah", eventType: "Pre-Wedding", rating: 5, text: "Our pre-wedding shoot was a dream. The locations they suggested, the direction, the final edits — everything was beyond our expectations. Pure cinema." },
    { clientName: "Riya Desai", eventType: "Portrait", rating: 5, text: "I needed photos for my modeling portfolio and they absolutely nailed it. The studio lighting setup was world-class and the retouching was flawless." },
    { clientName: "Sunrise Exports", eventType: "Product Shoot", rating: 5, text: "Our product catalog looks like it belongs in a luxury magazine. Sales have gone up since we updated our website with these photos. Worth every rupee." },
  ];

  const displayItems = testimonials.length > 0
    ? testimonials
    : mockTestimonials.map((t, i) => ({
        ...t,
        id: String(i),
        featured: true,
        status: "approved" as const,
        createdAt: Date.now(),
        clientPhoto: undefined,
      }));

  return (
    <section className="section" style={{ background: "transparent" }}>
      <div className="container">
        <ScrollReveal>
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
        </ScrollReveal>

        <div className="testimonials-grid">
          {displayItems.slice(0, 6).map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.08}>
              <TiltedCard>
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
                  {/* Stars */}
                  <div style={{ display: "flex", gap: 3, marginBottom: "var(--space-4)" }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={13} fill="var(--gold)" color="var(--gold)" />
                    ))}
                  </div>

                  <p style={{ fontSize: "0.88rem", lineHeight: 1.65, color: "var(--text-secondary)", fontStyle: "italic", flexGrow: 1, marginBottom: "var(--space-5)" }}>
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-4)" }}>
                    {/* Avatar initials */}
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: "var(--accent-muted)",
                      border: "1px solid var(--border-accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "var(--accent)",
                      flexShrink: 0,
                    }}>
                      {t.clientName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>{t.clientName}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--accent)", marginTop: 1 }}>{t.eventType}</div>
                    </div>
                  </div>
                </div>
              </TiltedCard>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <style>{`
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
        }
        @media (max-width: 900px) {
          .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .testimonials-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────
function CtaSection({ text }: { text?: string }) {
  return (
    <section style={{ position: "relative", overflow: "hidden", paddingBlock: "clamp(5rem, 12vw, 9rem)", textAlign: "center" }}>
      <SectionDecorator watermark="LEGACY" />


      {/* Top border glow line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--accent), var(--gold), var(--accent), transparent)", zIndex: 2 }} />

      <div className="container" style={{ maxWidth: 760, position: "relative", zIndex: 3 }}>
        <ScrollReveal>
          {/* Badge */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <span className="badge badge-accent" style={{ fontSize: "0.72rem", padding: "7px 18px" }}>
              ✦ Limited Slots Available for 2026
            </span>
          </div>

          {/* Large headline with serif mix */}
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            marginBottom: "var(--space-6)",
          }}>
            Ready to Tell<br />
            <span className="text-gradient-gold">Your Story?</span>
          </h2>

          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginBottom: "var(--space-10)", maxWidth: 520, marginInline: "auto", lineHeight: 1.7 }}>
            {text || "Wedding, corporate, portrait or live event — we'd love to capture your moments in cinematic 4K."}
          </p>

          <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap", marginBottom: "var(--space-10)" }}>
            <Link href="/contact" className="btn btn-primary btn-xl" style={{ borderRadius: "var(--radius-full)", boxShadow: "0 12px 40px rgba(212,160,23,0.35)" }}>
              Book a Session <ArrowRight size={16} />
            </Link>
            <Link href="/gallery" className="btn btn-ghost btn-xl" style={{ borderRadius: "var(--radius-full)" }}>
              Browse Gallery
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 3 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} fill="var(--gold)" color="var(--gold)" />
              ))}
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Rated 5/5 by <strong style={{ color: "var(--gold)", fontWeight: 700 }}>500+ clients</strong> across Gujarat
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}


// ─── Main Page ────────────────────────────────────────────────────────────
export default async function HomePage() {
  const { videos, photos, testimonials, content } = await getHomeData();

  return (
    <>
      <CinemaBackground theme={{ primary: "gold", secondary: "amber" }} />
      <HeroSection 
        title={content?.heroTitle} 
        subtitle={content?.heroSubtitle} 
      />
      <TrustBar />
      <StatCounters />
      <InfiniteHighlights />
      <FeaturedWorks photos={photos} />
      <HowItWorks />
      <ServiceCards />
      <YouTubeSection videos={videos} />
      <TestimonialsSection testimonials={testimonials} />
      <CtaSection text={content?.contactFooterText} />

      <style>{`
        @media (max-width: 768px) {
          .section { padding: var(--space-8) 0 !important; }
        }
        @media (max-width: 480px) {
          .section { padding: var(--space-6) 0 !important; }
        }
      `}</style>
    </>
  );
}
