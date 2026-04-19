import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the team and vision behind 4K Movie Kesri Surat.",
};

import { adminDb } from "@/lib/firebase-admin";
import { CinemaBackground } from "@/components/layout/CinemaBackground";

export default async function AboutPage() {
  let aboutText = "";
  try {
    const contentDoc = await adminDb.collection("settings").doc("globalContent").get();
    if (contentDoc.exists) {
      aboutText = contentDoc.data()?.aboutText || "";
    }
  } catch (err) {
    console.error("About page fetch error:", err);
  }

  const defaultAbout = "Since opening our doors in Surat, Gujarat, 4K Movie Kesri has been driven by a singular passion: turning fleeting moments into timeless masterpieces. We believe that photography isn't just about clicking a button; it's about anticipating emotions, managing brilliant lighting, and crafting a cinematic narrative.";

  return (
    <>
      <CinemaBackground theme={{ primary: "indigo", secondary: "violet" }} />
      <section className="section" style={{ background: "transparent", paddingTop: "clamp(8rem, 15vh, 12rem)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <span style={{ fontSize: "0.8rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
            Who We Are
          </span>
          <h1 style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-5)" }}>
            The Visionaries Behind The Lens
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "var(--space-6)" }}>
             {aboutText || defaultAbout}
          </p>
          {!aboutText && (
             <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
               With over 8 years of industry experience, top-tier 4K cinema cameras, and a dedicated team of editors and directors, we bring a true Hollywood-style production level to weddings and corporate events across India.
             </p>
          )}
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)", alignItems: "center" }} className="about-grid">
            <div style={{ position: "relative" }}>
              <div style={{ aspectRatio: "4/5", background: "var(--bg-elevated)", borderRadius: "var(--radius-xl)", overflow: "hidden", position: "relative" }}>
                 <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)", zIndex: 1 }} />
                 <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem", opacity: 0.1 }}>📸</div>
              </div>
              {/* Highlight Card */}
              <div 
                style={{ 
                  position: "absolute", 
                  bottom: -30, 
                  right: -30, 
                  background: "var(--bg-card)", 
                  padding: "var(--space-5)", 
                  borderRadius: "var(--radius-xl)", 
                  border: "1px solid var(--border-accent)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                  zIndex: 2,
                  maxWidth: 220
                }}
                className="about-stat-card"
              >
                 <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent)" }}>8+</div>
                 <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>Years of Industry Excellence</div>
              </div>
            </div>
            
            <div style={{ padding: "var(--space-6) 0" }}>
              <h2 style={{ marginBottom: "var(--space-6)" }}>Our Approach</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                {[
                   { step: "01", title: "Consultation", desc: "We sit down with you to understand your vision, aesthetic preference, and event timeline." },
                   { step: "02", title: "Production", desc: "On the day, we bring our cutting-edge 4K gear and cinematic lighting to capture everything flawlessly." },
                   { step: "03", title: "Post-Processing", desc: "Our editors meticulously color grade, retouch, and compile the footage into a masterpiece." }
                ].map(item => (
                  <div key={item.step} style={{ display: "flex", gap: "var(--space-4)" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>{item.step}.</div>
                    <div>
                      <h4 style={{ fontSize: "1.1rem", marginBottom: "var(--space-2)" }}>{item.title}</h4>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .about-stat-card { right: 20px !important; bottom: 20px !important; }
        }
      `}</style>
    </>
  );
}
