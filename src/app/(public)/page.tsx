import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceCards } from "@/components/home/ServiceCards";
import { YouTubeSection } from "@/components/home/YouTubeSection";
import { CinemaBackground } from "@/components/layout/CinemaBackground";
import { adminDb } from "@/lib/firebase-admin";
import type { YouTubeVideo, GalleryPhoto, Testimonial } from "@/types";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

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

// ─── Featured Works Section ───────────────────────────────────────────────
function FeaturedWorks({ photos }: { photos: GalleryPhoto[] }) {
  const mockCategories = ["Wedding", "Portrait", "Corporate", "Events", "Product"];

  return (
    <section className="section" style={{ background: "var(--bg-primary)" }}>
      <div className="container">
        <ScrollReveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-8)", flexWrap: "wrap", gap: "var(--space-4)" }}>
            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
                Our Work
              </span>
              <h2 style={{ marginTop: "var(--space-2)" }}>
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
        @media (max-width: 500px) {
          .gallery-masonry { column-count: 1 !important; }
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
              width: 300,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "var(--space-4)",
              background: "var(--bg-primary)",
              padding: "var(--space-4)",
            }}
          >
             <div style={{ fontSize: "2rem", background: "var(--bg-elevated)", width: 56, height: 56, borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
               {item.emoji}
             </div>
             <div>
               <h4 style={{ fontSize: "1.05rem", marginBottom: 2 }}>{item.title}</h4>
               <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.desc}</p>
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
  ];

  const displayItems = testimonials.length > 0 ? testimonials : mockTestimonials.map((t, i) => ({ ...t, id: String(i), featured: true, status: "approved" as const, createdAt: Date.now(), clientPhoto: undefined }));

  return (
    <section className="section" style={{ background: "transparent" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
            Client Love
          </span>
          <h2 style={{ marginTop: "var(--space-2)" }}>
            What Our Clients Say
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-5)",
          }}
        >
          {displayItems.map((t) => (
            <div key={t.id} className="card" style={{ position: "relative" }}>
              {/* Quote mark */}
              <div style={{ fontSize: "3rem", color: "var(--accent)", opacity: 0.2, lineHeight: 1, marginBottom: "var(--space-3)", fontFamily: "serif" }}>
                &ldquo;
              </div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "var(--space-5)", fontStyle: "italic" }}>
                {t.text}
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>{t.clientName}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--accent)", marginTop: 2 }}>{t.eventType}</div>
                </div>
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={13} fill="var(--gold)" color="var(--gold)" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────────────────
function StatsBanner() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, var(--accent) 0%, #8B2E00 100%)",
        padding: "clamp(2.5rem, 5vw, 4rem) 0",
      }}
    >
      <div
        className="container stats-banner-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "var(--space-6)",
          textAlign: "center",
        }}
      >
        {[
          { number: "500+",  label: "Events Covered" },
          { number: "10K+",  label: "Photos Delivered" },
          { number: "98%",   label: "Client Satisfaction" },
          { number: "8+",    label: "Years of Excellence" },
        ].map((stat) => (
          <div key={stat.label}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", lineHeight: 1 }}>
              {stat.number}
            </div>
            <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", marginTop: "var(--space-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .stats-banner-grid { grid-template-columns: repeat(4, 1fr) !important; }
        @media (max-width: 640px) {
          .stats-banner-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────
function CtaSection({ text }: { text?: string }) {
  return (
    <section className="section" style={{ background: "var(--bg-primary)", textAlign: "center" }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <span style={{ fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
          Let&apos;s Work Together
        </span>
        <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-4)" }}>
          Ready to Tell Your Story?
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "var(--space-8)" }}>
          {text || "Whether it's a wedding, corporate event, or personal portrait session — we'd love to capture your moments."}
        </p>
        <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="btn btn-primary btn-xl">
            Book a Session
          </Link>
          <Link href="/gallery" className="btn btn-ghost btn-xl">
            Browse Gallery
          </Link>
        </div>
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
      <InfiniteHighlights />
      <FeaturedWorks photos={photos} />
      <ServiceCards />
      <YouTubeSection videos={videos} />
      <TestimonialsSection testimonials={testimonials} />
      <StatsBanner />
      <CtaSection text={content?.contactFooterText} />
    </>
  );
}
