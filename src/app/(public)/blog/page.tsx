import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal & Blog",
  description: "Photography tips, wedding planning advice, and stories from 4K Movie Kesri Surat.",
};

export default function BlogPage() {
  return (
    <>
      <section className="section" style={{ background: "var(--bg-primary)", paddingTop: "clamp(8rem, 15vh, 12rem)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 800 }}>
          <span style={{ fontSize: "0.8rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
            Journal
          </span>
          <h1 style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-5)" }}>
            News & Stories
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Read the latest updates from our studio, tips for preparing for your photoshoot, and deep dives into our favorite lighting techniques.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-6)" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <article 
                key={i} 
                style={{ 
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                }}
                className="blog-card"
              >
                <div style={{ aspectRatio: "16/10", background: "var(--bg-elevated)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
                   <span style={{ fontSize: "2rem", opacity: 0.2 }}>📰</span>
                </div>
                <div style={{ padding: "var(--space-5)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    <span className="badge badge-accent">Tips & Tricks</span>
                    <span>March {10 + i}, 2026</span>
                  </div>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-3)", lineHeight: 1.4 }}>
                    Top 5 Cinematic Lighting Setups for Portraits
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
                    Learn how we use dual-tone lighting and softboxes to capture those incredibly moody, dramatic studio portraits step by step.
                  </p>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent)" }}>Read Post →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .blog-card:hover { transform: translateY(-4px); border-color: var(--border-accent); }
      `}</style>
    </>
  );
}
