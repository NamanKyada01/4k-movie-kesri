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

export default async function GalleryPage() {
  let photos: GalleryPhoto[] = [];
  try {
    const snap = await adminDb.collection("gallery").orderBy("uploadedAt", "desc").get();
    photos = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as GalleryPhoto[];
  } catch (error) {
    console.error("Error fetching gallery:", error);
  }

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
            {photos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-muted)" }}>
                 <p>More photos coming soon.</p>
              </div>
            ) : (
              <div style={{ columnCount: 3, columnGap: "var(--space-5)" }} className="full-gallery-masonry">
                {photos.map((photo, i) => (
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
            )}
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
