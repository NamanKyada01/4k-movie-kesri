import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our complete collection of stunning photography from weddings, events, and portrait sessions.",
};

export default function GalleryPage() {
  return (
    <>
      {/* Header */}
      <section className="section" style={{ background: "var(--bg-primary)", paddingTop: "clamp(8rem, 15vh, 12rem)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 800 }}>
          <span style={{ fontSize: "0.8rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
            Our Lifetime Masterpieces
          </span>
          <h1 style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-5)" }}>
            The Gallery
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Explore our curated portfolio of weddings, pre-weddings, corporate events, and stunning portraits captured in breathtaking 4K cinematic quality.
          </p>
        </div>
      </section>

      {/* Gallery Grid placeholder (will connect to Firebase) */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ columnCount: 3, columnGap: "var(--space-5)" }} className="full-gallery-masonry">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  breakInside: "avoid",
                  marginBottom: "var(--space-5)",
                  aspectRatio: i % 4 === 1 ? "2/3" : i % 4 === 3 ? "3/4" : "4/3",
                  background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ opacity: 0.3, fontSize: "2rem" }}>📷</div>
                <div style={{ position: "absolute", bottom: 16, left: 16 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>Photo Title {i+1}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--accent)", marginTop: 2 }}>Category</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .full-gallery-masonry { column-count: 2 !important; } }
        @media (max-width: 500px) { .full-gallery-masonry { column-count: 1 !important; } }
      `}</style>
    </>
  );
}
