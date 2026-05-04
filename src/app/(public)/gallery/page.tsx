import type { Metadata } from "next";

import { adminDb } from "@/lib/firebase-admin";
import { CinemaBackground } from "@/components/layout/CinemaBackground";
import type { GalleryPhoto } from "@/types";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our complete collection of stunning photography from weddings, events, and portrait sessions.",
};

export const revalidate = 60; // Revalidate every 60 seconds

const FALLBACK_GALLERY_IMAGES = [
  { id: "f1", title: "Royal Rajput Wedding", category: "wedding", cloudinaryUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" },
  { id: "f2", title: "Golden Hour Pre-Wedding", category: "pre-wedding", cloudinaryUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800" },
  { id: "f3", title: "Corporate Gala 2025", category: "corporate", cloudinaryUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800" },
  { id: "f4", title: "Cinematic Portrait", category: "portrait", cloudinaryUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800" },
  { id: "f5", title: "Haldi Ceremony", category: "wedding", cloudinaryUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800" },
  { id: "f6", title: "Product Launch", category: "event", cloudinaryUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800" },
  { id: "f7", title: "Bridal Glow", category: "wedding", cloudinaryUrl: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&q=80&w=800" },
  { id: "f8", title: "Live Concert Telecast", category: "videography", cloudinaryUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800" },
  { id: "f9", title: "Couple Outdoors", category: "pre-wedding", cloudinaryUrl: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&q=80&w=800" },
];

export default async function GalleryPage() {
  let photos: GalleryPhoto[] = [];
  try {
    const snap = await adminDb.collection("gallery").orderBy("uploadedAt", "desc").get();
    photos = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as GalleryPhoto[];
  } catch (error) {
    console.error("Error fetching gallery:", error);
  }

  const displayPhotos = photos.length > 0 ? photos : FALLBACK_GALLERY_IMAGES;

  return (
    <>
      <CinemaBackground theme={{ primary: "blue", secondary: "teal" }} />
      {/* Header */}
      <section className="section" style={{ background: "transparent", paddingTop: "clamp(8rem, 15vh, 12rem)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 800 }}>
          <ScrollReveal>
            <span style={{ fontSize: "0.8rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
              Our Lifetime Masterpieces
            </span>
            <h1 style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-5)" }}>
              The Gallery
            </h1>
            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Explore our curated portfolio of weddings, pre-weddings, corporate events, and stunning portraits captured in breathtaking 4K cinematic quality.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery Grid placeholder (will connect to Firebase) */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <ScrollReveal delay={0.2}>
            <div style={{ columnCount: 3, columnGap: "var(--space-5)" }} className="full-gallery-masonry">
              {displayPhotos.map((photo, i) => (
                <div
                  key={photo.id}
                  style={{
                    breakInside: "avoid",
                    marginBottom: "var(--space-5)",
                    borderRadius: "var(--radius-xl)",
                    border: "1px solid var(--border)",
                    position: "relative",
                    overflow: "hidden",
                    background: "var(--bg-elevated)"
                  }}
                >
                  <img 
                    src={photo.cloudinaryUrl} 
                    alt={photo.title || "Gallery Photo"} 
                    style={{ width: "100%", height: "auto", display: "block" }} 
                    loading="lazy"
                  />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, background: "linear-gradient(transparent, rgba(0,0,0,0.85))" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{photo.title}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--accent)", marginTop: 2, textTransform: "capitalize" }}>{photo.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .full-gallery-masonry { column-count: 2 !important; } }
        @media (max-width: 500px) { .full-gallery-masonry { column-count: 1 !important; } }
      `}</style>
    </>
  );
}
