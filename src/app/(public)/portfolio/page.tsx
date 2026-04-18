import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Dive deep into our featured cinematic highlights and full photography case studies.",
};

export default function PortfolioPage() {
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
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
            {/* Placeholder for Albums/Collections from Firebase */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i} 
                className="card"
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "var(--space-6)", 
                  padding: 0, 
                  overflow: "hidden",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ background: "var(--bg-secondary)", minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                   <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%)", opacity: 0.5 }} />
                   <span style={{ fontSize: "3rem", position: "relative", zIndex: 1, opacity: 0.2 }}>🎬</span>
                </div>
                <div style={{ padding: "var(--space-8) var(--space-6)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div className="badge badge-accent" style={{ alignSelf: "flex-start", marginBottom: "var(--space-4)" }}>Wedding Case Study</div>
                  <h2 style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>The Patel Grand Wedding</h2>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-6)" }}>
                    A stunning three-day Gujarati wedding destination shoot capturing the pre-wedding rituals, sangeet, and the grand ceremony. Featuring 4K drone videography and extensive portrait coverage.
                  </p>
                  <button className="btn btn-ghost" style={{ alignSelf: "flex-start" }}>View Full Collection →</button>
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
