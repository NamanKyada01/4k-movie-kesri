import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Dive deep into our featured cinematic highlights and full photography case studies.",
};

import { adminDb } from "@/lib/firebase-admin";
import { CinemaBackground } from "@/components/layout/CinemaBackground";
import type { GalleryPhoto } from "@/types";
import Link from "next/link";

async function getPortfolioData() {
  try {
    const photosSnap = await adminDb.collection("gallery")
      .where("featured", "==", true)
      .limit(10)
      .get();
    
    return photosSnap.docs.map(d => ({ id: d.id, ...d.data() })) as GalleryPhoto[];
  } catch (err) {
    console.error("Portfolio fetch error:", err);
    return [];
  }
}

const FALLBACK_PORTFOLIO_PROJECTS = [
  {
    id: "p1",
    title: "The Grand Rajputana Wedding",
    category: "wedding",
    cloudinaryUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    description: "A three-day cinematic documentation of a royal wedding in Udaipur. Featuring sweeping drone shots of the palace, intimate portraiture during the Haldi, and a majestic 4K highlight reel of the evening reception.",
  },
  {
    id: "p2",
    title: "Global Tech Summit 2025",
    category: "corporate",
    cloudinaryUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200",
    description: "Multi-camera live telecast and post-event documentary for a premier tech summit. Delivered real-time broadcast feeds to LED walls and produced a high-energy corporate aftermovie.",
  },
  {
    id: "p3",
    title: "Desert Sunset Pre-Wedding",
    category: "pre-wedding",
    cloudinaryUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200",
    description: "An atmospheric, highly stylized pre-wedding shoot in the dunes. Utilized cinematic lighting setups and golden hour natural light to create a moody, romantic, and unforgettable visual story.",
  },
];

export default async function PortfolioPage() {
  const photos = await getPortfolioData();
  const displayPhotos = photos.length > 0 ? photos : FALLBACK_PORTFOLIO_PROJECTS;

  return (
    <>
      <CinemaBackground theme={{ primary: "teal", secondary: "amber" }} />
      <section className="section" style={{ background: "transparent", paddingTop: "clamp(8rem, 15vh, 12rem)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 800 }}>
          <span style={{ fontSize: "0.8rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
            Featured Collections
          </span>
          <h1 style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-5)" }}>
            Cinematic Portfolio
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Step into the stories we&apos;ve captured. From grand Indian weddings to high-impact corporate documentary reels.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-12)" }}>
            {displayPhotos.map((photo, i) => (
              <div 
                key={photo.id} 
                className="card"
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: i % 2 === 0 ? "1.2fr 1fr" : "1fr 1.2fr", 
                  gap: "var(--space-8)", 
                  padding: 0, 
                  overflow: "hidden",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ 
                  order: i % 2 === 0 ? 1 : 2,
                  background: "var(--bg-secondary)", 
                  minHeight: 450, 
                  position: "relative",
                  overflow: "hidden" 
                }}>
                  <img 
                    src={photo.cloudinaryUrl} 
                    alt={photo.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ 
                  order: i % 2 === 0 ? 2 : 1,
                  padding: "var(--space-10) var(--space-8)", 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "center" 
                }}>
                  <div className="badge badge-accent" style={{ alignSelf: "flex-start", marginBottom: "var(--space-4)", textTransform: "capitalize" }}>
                    {photo.category} Case Study
                  </div>
                  <h2 style={{ fontSize: "2.2rem", marginBottom: "var(--space-4)" }}>{photo.title}</h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "var(--space-8)" }}>
                    {photo.description || `A breathtaking premium ${photo.category} session captured in 4K resolution. Highlighting the raw emotions, cinematic lighting, and professional composition that defines 4K Movie Kesri.`}
                  </p>
                  <Link href="/gallery" className="btn btn-ghost" style={{ alignSelf: "flex-start" }}>View Full Collection →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Basic Responsive flip for alternating rows or standardizing on mobile */}
      <style>{`
        @media (max-width: 900px) {
          .card { grid-template-columns: 1fr !important; }
          .card > div:first-child { min-height: 250px !important; }
        }
      `}</style>
    </>
  );
}
