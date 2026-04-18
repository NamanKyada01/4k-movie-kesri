import type { Metadata } from "next";
import { Camera, Video, MonitorPlay, Users, PackageOpen, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description: "Professional photography and videography services including weddings, corporate events, and product shoots.",
};

const servicesList = [
  {
    icon: Camera,
    title: "Cinematic Wedding Photography",
    desc: "We capture the essence of your special day with high-end equipment, ensuring every emotion, detail, and moment is preserved forever in breathtaking quality.",
    features: ["Pre-wedding shoots", "Candid photography", "Traditional coverage", "Premium photo albums"],
  },
  {
    icon: Video,
    title: "4K Wedding Cinematic Films",
    desc: "Our signature 4K highlight reels and full-length cinematic documentaries tell your love story beautifully. Directed entirely like a premium cinema production.",
    features: ["Drone coverage", "Professional color grading", "Highlight trailers", "Full documentary edits"],
  },
  {
    icon: Users,
    title: "Portrait & Fashion",
    desc: "Stand out with stunning portraits. Whether it's a personal milestone, modeling portfolio, or professional corporate headshots, we master the lighting to make you look your best.",
    features: ["Studio lighting setup", "Outdoor sessions", "Editorial retouching", "Quick digital delivery"],
  },
  {
    icon: MonitorPlay,
    title: "Corporate & Event Coverage",
    desc: "Professional documentation for your corporate events, product launches, conventions, and team outings. We ensure your brand looks sharp and engaging.",
    features: ["Multi-camera setups", "Live streaming options", "Same-day edit delivery", "Executive interviews"],
  },
  {
    icon: PackageOpen,
    title: "Commercial Product Shoots",
    desc: "Elevate your e-commerce and marketing with high-resolution, perfectly lit product photography that drives sales and boosts brand perception.",
    features: ["White background items", "Lifestyle product shoots", "Macro detailing", "Ad-ready formatting"],
  },
  {
    icon: Award,
    title: "Premium Photo Albums",
    desc: "Your memories deserve to be touched. We offer handcrafted, premium quality photo books and albums made from archival-grade materials.",
    features: ["Custom layouts", "Leather/Glass covers", "Lay-flat binding", "Lifetime durability"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="section" style={{ background: "var(--bg-primary)", paddingTop: "clamp(8rem, 15vh, 12rem)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 800 }}>
          <span style={{ fontSize: "0.8rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
            What We Do
          </span>
          <h1 style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-5)" }}>
            Our Services
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Comprehensive media solutions for every occasion. We blend artistic vision with technical perfection to deliver outstanding photography and videography.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-6)" }}>
            {servicesList.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div 
                  key={i} 
                  className="card" 
                  style={{ 
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    padding: "var(--space-8) var(--space-6)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div style={{ position: "absolute", top: -20, right: -20, opacity: 0.03 }}>
                    <Icon size={180} />
                  </div>
                  
                  <div style={{ width: 64, height: 64, borderRadius: "var(--radius-xl)", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-6)", boxShadow: "var(--shadow-accent)" }}>
                    <Icon size={28} color="white" />
                  </div>
                  
                  <h3 style={{ fontSize: "1.3rem", marginBottom: "var(--space-3)" }}>{svc.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "var(--space-6)" }}>
                    {svc.desc}
                  </p>
                  
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {svc.features.map((feat, j) => (
                      <li key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
