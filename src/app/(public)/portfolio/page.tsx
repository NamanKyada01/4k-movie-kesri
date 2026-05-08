import type { Metadata } from "next";
import { adminDb } from "@/lib/firebase-admin";
import { CinemaBackground } from "@/components/layout/CinemaBackground";
import type { PortfolioProject } from "@/types";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Portfolio — 4K Movie Kesri Surat",
  description: "Explore our featured cinematic projects, high-end photography case studies, and corporate films.",
};

async function getPortfolioData() {
  try {
    const snap = await adminDb.collection("settings").doc("portfolioContent").get();
    if (snap.exists) {
      return snap.data()?.projects || [];
    }
    
    // Fallback if settings don't exist yet
    const photosSnap = await adminDb.collection("portfolio")
      .orderBy("order", "asc")
      .limit(12)
      .get();
    
    return photosSnap.docs.map(d => ({ id: d.id, ...d.data() })) as PortfolioProject[];
  } catch (err) {
    console.error("Portfolio fetch error:", err);
    return [];
  }
}

export default async function PortfolioPage() {
  const projects = await getPortfolioData();

  return (
    <>
      <CinemaBackground theme={{ primary: "teal", secondary: "amber" }} />
      <section className="section" style={{ background: "transparent", paddingTop: "clamp(8rem, 15vh, 12rem)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 800 }}>
          <ScrollReveal>
            <span style={{ fontSize: "0.8rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
              Featured Collections
            </span>
            <h1 style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-5)", fontSize: "clamp(2.5rem, 8vw, 4.5rem)", lineHeight: 1, letterSpacing: "-0.04em" }}>
              Cinematic Portfolio
            </h1>
            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Step into the stories we&apos;ve captured. From grand Indian weddings to high-impact corporate documentary reels.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-12)" }}>
            {projects.map((project: any, i: number) => (
              <ScrollReveal key={project.id || i} delay={0.1}>
                <div 
                  className="card"
                  style={{ 
                    display: "grid", 
                    gridTemplateColumns: i % 2 === 0 ? "1.2fr 1fr" : "1fr 1.2fr", 
                    gap: "var(--space-8)", 
                    padding: 0, 
                    overflow: "hidden",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-2xl)",
                    minHeight: 450
                  }}
                >
                  <div style={{ 
                    order: i % 2 === 0 ? 1 : 2,
                    background: "var(--bg-secondary)", 
                    position: "relative",
                    overflow: "hidden" 
                  }}>
                    <img 
                      src={project.cloudinaryUrl} 
                      alt={project.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                      className="hover:scale-105"
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
                      {project.category} Case Study
                    </div>
                    <h2 style={{ fontSize: "2.2rem", marginBottom: "var(--space-4)", lineHeight: 1.1, fontWeight: 800 }}>{project.title}</h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "var(--space-8)" }}>
                      {project.description}
                    </p>
                    <Link href="/contact" className="btn btn-ghost" style={{ alignSelf: "flex-start", fontWeight: 700, letterSpacing: "0.05em" }}>Inquire About This Style →</Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .card { grid-template-columns: 1fr !important; }
          .card > div:first-child { min-height: 300px !important; }
        }
      `}</style>
    </>
  );
}
