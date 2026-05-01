import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceCards } from "@/components/home/ServiceCards";
import { YouTubeSection } from "@/components/home/YouTubeSection";
import { CinemaBackground } from "@/components/layout/CinemaBackground";
import { adminDb } from "@/lib/firebase-admin";
import type { YouTubeVideo, GalleryPhoto, Testimonial } from "@/types";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { ArrowRight, Star, CheckCircle2, Camera, Clock, Award, Sparkles } from "lucide-react";
import TiltedCard from "@/components/ui/TiltedCard";

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
function FeaturedWorks({ photos }: { photos: GalleryPhoto[] }) {
  const mockCategories = ["Wedding", "Portrait", "Corporate", "Events", "Product"];

  return (
    <section className="section" style={{ background: "var(--bg-primary)" }}>
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

        {photos.length === 0 ? (
          // Placeholder masonry
          <ScrollReveal delay={0.2}>
            <div style={{ columnCount: 3, columnGap: "var(--space-4)" }} className="gallery-masonry">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  breakInside: "avoid",
                  marginBottom: "var(--space-4)",
                  aspectRatio: i % 3 === 1 ? "2/3" : i % 3 === 0 ? "3/2" : "1/1",
                  background: `linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%)`,
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontSize: "2rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <span style={{ opacity: 0.3 }}>📷</span>
                <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                  <span className="badge badge-accent">{mockCategories[i % mockCategories.length]}</span>
                </div>
              </div>
            ))}
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={0.2}>
            <div style={{ columnCount: 3, columnGap: "var(--space-4)" }} className="gallery-masonry">
            {photos.map((photo, i) => (
              <Link
                key={photo.id}
                href="/gallery"
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
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                />
                <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                  <span className="badge badge-accent" style={{ textTransform: "capitalize" }}>{photo.category}</span>
                </div>
              </Link>
            ))}
            </div>
          </ScrollReveal>
        )}
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
      desc: "We start with a free discovery call to understand your vision, timeline, and aesthetic preferences.",
      icon: "💬",
    },
    {
      number: "02",
      title: "Planning",
      desc: "Our team scouts locations, plans lighting setups, and prepares a detailed shot list tailored to your event.",
      icon: "📋",
    },
    {
      number: "03",
      title: "Production",
      desc: "On the day, we arrive early, set up cinema-grade equipment, and capture every moment with precision.",
      icon: "🎬",
    },
    {
      number: "04",
      title: "Delivery",
      desc: "Fully color-graded photos and 4K films delivered within 48 hours via a private online gallery.",
      icon: "✨",
    },
  ];

  return (
    <section className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="container">
        <ScrollReveal>
          <div style={{ textAlign: "center", marginBottom: "clamp(var(--space-8), 6vw, var(--space-12))" }}>
            <span style={{ fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
              The Process
            </span>
            <h2 style={{ marginTop: "var(--space-2)", fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}>
              From Vision to Masterpiece
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "var(--space-3)", maxWidth: 480, marginInline: "auto" }}>
              A seamless four-step journey that turns your most important moments into cinematic art.
            </p>
          </div>
        </ScrollReveal>

        <div className="process-grid">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.1}>
              <div
                className="process-card"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-2xl)",
                  padding: "var(--space-8)",
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                {/* Step number watermark */}
                <div style={{
                  position: "absolute",
                  top: -10,
                  right: 16,
                  fontSize: "5rem",
                  fontWeight: 900,
                  color: "var(--accent)",
                  opacity: 0.06,
                  fontFamily: "var(--font-heading)",
                  lineHeight: 1,
                  userSelect: "none",
                }}>
                  {step.number}
                </div>

                <div style={{ fontSize: "2rem", marginBottom: "var(--space-4)" }}>{step.icon}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: "var(--space-2)" }}>
                  Step {step.number}
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "var(--space-3)" }}>{step.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.65 }}>{step.desc}</p>

                {/* Connector line (not on last) */}
                {i < steps.length - 1 && (
                  <div className="process-connector" />
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Start Your Journey <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      <style>{`
        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
          position: relative;
        }
        .process-card {
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .process-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-accent) !important;
        }
        @media (max-width: 1024px) {
          .process-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .process-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

// ─── Infinite Highlights Marquee ──────────────────────────────────────────
function InfiniteHighlights() {
  const highlights = [
    { title: "Weddings",     emoji: "💍", desc: "Cinematic wedding films" },
    { title: "Pre-Wedding",  emoji: "💑", desc: "Beautiful outdoor shoots" },
    { title: "Corporate",    emoji: "🏢", desc: "Professional event coverage" },
    { title: "Portraits",    emoji: "📸", desc: "Studio & outdoor sessions" },
    { title: "Products",     emoji: "🛍️", desc: "High-end commercial lighting" },
  ];

  // Tripled array for seamless infinite looping
  const marqueeItems = [...highlights, ...highlights, ...highlights];

  return (
    <section style={{ overflow: "hidden", padding: "var(--space-6) 0", background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <ScrollReveal>
        <div 
          className="infinite-marquee"
        style={{ 
          display: "flex", 
          gap: "var(--space-5)", 
          width: "max-content",
        }}
      >
        {marqueeItems.map((item, i) => (
          <div
            key={i}
            className="card"
            style={{
              width: 240,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              background: "var(--bg-primary)",
              padding: "var(--space-3) var(--space-4)",
            }}
          >
             <div style={{ fontSize: "1.6rem", background: "var(--bg-elevated)", width: 46, height: 46, borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
               {item.emoji}
             </div>
             <div>
               <h4 style={{ fontSize: "0.95rem", marginBottom: 2 }}>{item.title}</h4>
               <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.desc}</p>
             </div>
          </div>
        ))}
      </div>
      </ScrollReveal>
      <style>{`
        .infinite-marquee {
          animation: marquee-scroll 40s linear infinite;
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-33.333333% - (var(--space-5) / 3))); }
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
    <section className="section" style={{ background: "var(--bg-primary)", textAlign: "center" }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <ScrollReveal>
          {/* Glow orb */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: "var(--space-4)" }}>
            <div style={{
              position: "absolute",
              inset: -40,
              background: "radial-gradient(circle, rgba(196,149,106,0.12) 0%, transparent 70%)",
              filter: "blur(30px)",
              pointerEvents: "none",
            }} />
            <span className="badge badge-accent" style={{ fontSize: "0.7rem", padding: "6px 16px", position: "relative" }}>
              ✦ Limited Slots Available
            </span>
          </div>

          <h2 style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-4)", fontSize: "clamp(1.8rem, 5vw, 3rem)", lineHeight: 1.1 }}>
            Ready to Tell<br />
            <span style={{ color: "var(--accent)" }}>Your Story?</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "var(--space-8)", maxWidth: 520, marginInline: "auto", lineHeight: 1.65 }}>
            {text || "Whether it's a wedding, corporate event, or personal portrait session — we'd love to capture your moments in cinematic 4K."}
          </p>

          <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap", marginBottom: "var(--space-8)" }}>
            <Link href="/contact" className="btn btn-primary btn-xl">
              Book a Session <ArrowRight size={16} />
            </Link>
            <Link href="/gallery" className="btn btn-ghost btn-xl">
              Browse Gallery
            </Link>
          </div>

          {/* Social proof strip */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-6)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />
              ))}
            </div>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Rated 5/5 by <strong style={{ color: "var(--text-secondary)" }}>200+ clients</strong> across Gujarat
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
      <CinemaBackground theme={{ primary: "amber", secondary: "gold" }} />
      <HeroSection 
        title={content?.heroTitle} 
        subtitle={content?.heroSubtitle} 
      />
      <TrustBar />
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
