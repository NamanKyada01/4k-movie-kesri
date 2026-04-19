import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Dive deep into our featured cinematic highlights and full photography case studies.",
};

import { adminDb } from "@/lib/firebase-admin";
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

export default async function PortfolioPage() {
  const photos = await getPortfolioData();

  return (
    <>
      <section className="section" style={{ background: "var(--bg-primary)", paddingTop: "clamp(8rem, 15vh, 12rem)" }}>
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
            {photos.length === 0 ? (
               <div style={{ textAlign: "center", padding: "var(--space-20)", color: "var(--text-muted)" }}>
                 <p>No featured projects yet. Our cinematic team is currently uploading new work.</p>
               </div>
            ) : (
              photos.map((photo, i) => (
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
              ))
            )}
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
