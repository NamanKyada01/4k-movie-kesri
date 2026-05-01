"use client";

import { motion } from "framer-motion";
import { Camera, Video, MonitorPlay, Users, PackageOpen, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { CinemaBackground } from "@/components/layout/CinemaBackground";
import Link from "next/link";

const servicesList = [
  {
    icon: Camera,
    title: "Cinematic Wedding Photography",
    desc: "We capture the essence of your special day with high-end equipment, ensuring every emotion, detail, and moment is preserved forever in breathtaking quality.",
    features: ["Pre-wedding shoots", "Candid photography", "Traditional coverage", "Premium photo albums"],
    delay: 0.1,
  },
  {
    icon: Video,
    title: "4K Wedding Cinematic Films",
    desc: "Our signature 4K highlight reels and full-length cinematic documentaries tell your love story beautifully. Directed entirely like a premium cinema production.",
    features: ["Drone coverage", "Professional color grading", "Highlight trailers", "Full documentary edits"],
    delay: 0.2,
  },
  {
    icon: Users,
    title: "Portrait & Fashion",
    desc: "Stand out with stunning portraits. Whether it's a personal milestone, modeling portfolio, or professional corporate headshots, we master the lighting to make you look your best.",
    features: ["Studio lighting setup", "Outdoor sessions", "Editorial retouching", "Quick digital delivery"],
    delay: 0.3,
  },
  {
    icon: MonitorPlay,
    title: "Corporate & Event Coverage",
    desc: "Professional documentation for your corporate events, product launches, conventions, and team outings. We ensure your brand looks sharp and engaging.",
    features: ["Multi-camera setups", "Live streaming options", "Same-day edit delivery", "Executive interviews"],
    delay: 0.4,
  },
  {
    icon: PackageOpen,
    title: "Commercial Product Shoots",
    desc: "Elevate your e-commerce and marketing with high-resolution, perfectly lit product photography that drives sales and boosts brand perception.",
    features: ["White background items", "Lifestyle product shoots", "Macro detailing", "Ad-ready formatting"],
    delay: 0.5,
  },
  {
    icon: Award,
    title: "Premium Photo Albums",
    desc: "Your memories deserve to be touched. We offer handcrafted, premium quality photo books and albums made from archival-grade materials.",
    features: ["Custom layouts", "Leather/Glass covers", "Lay-flat binding", "Lifetime durability"],
    delay: 0.6,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ServicesPage() {
  return (
    <>
      <CinemaBackground theme={{ primary: "amber", secondary: "gold" }} />

      {/* ── Hero ── */}
      <section
        className="section"
        style={{
          background: "transparent",
          paddingTop: "clamp(8rem, 15vh, 12rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "-5%",
            width: "40vw",
            height: "40vw",
            background: "radial-gradient(circle, rgba(196,149,106,0.05) 0%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: "0.8rem",
              color: "var(--accent)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 700,
              display: "block",
              marginBottom: "var(--space-4)",
            }}
          >
            The Repository
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              marginBottom: "var(--space-6)",
            }}
          >
            Our Professional <br />
            <span style={{ color: "var(--accent)" }}>Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "1.1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              maxWidth: 600,
              marginBottom: "var(--space-8)",
            }}
          >
            A curated suite of high-fidelity media services. We blend cinematic vision with
            surgical technical precision to capture moments that transcend time.
          </motion.p>

          {/* Quick nav pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}
          >
            {["Weddings", "Portraits", "Corporate", "Products", "Albums"].map((cat) => (
              <span
                key={cat}
                className="badge badge-accent"
                style={{ fontSize: "0.72rem", padding: "6px 14px", cursor: "default" }}
              >
                {cat}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Services List ── */}
      <section className="section" style={{ paddingTop: "var(--space-8)" }}>
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-4)" }}
            className="services-grid"
          >
            {servicesList.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="services-editorial-item"
                  style={{
                    background: "var(--bg-elevated)",
                    padding: "var(--space-8)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "var(--radius-2xl)",
                    border: "1px solid rgba(255,255,255,0.03)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  {/* Watermark icon */}
                  <div
                    style={{
                      position: "absolute",
                      top: -20,
                      right: -20,
                      opacity: 0.04,
                      color: "var(--accent)",
                    }}
                  >
                    <Icon size={160} />
                  </div>

                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "var(--radius-xl)",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "var(--space-6)",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <Icon size={22} color="var(--accent)" />
                  </div>

                  <div style={{ position: "relative", zIndex: 2, flexGrow: 1 }}>
                    <h3
                      style={{
                        fontSize: "1.35rem",
                        marginBottom: "var(--space-3)",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                      }}
                    >
                      {svc.title}
                    </h3>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.9rem",
                        lineHeight: 1.7,
                        marginBottom: "var(--space-6)",
                      }}
                    >
                      {svc.desc}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "var(--space-6)" }}>
                      {svc.features.map((feat, j) => (
                        <span
                          key={j}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: "0.72rem",
                            color: "var(--text-secondary)",
                            background: "rgba(255,255,255,0.04)",
                            padding: "5px 12px",
                            borderRadius: "var(--radius-full)",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <CheckCircle2 size={10} color="var(--accent)" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    Enquire Now <ArrowRight size={13} />
                  </Link>

                  {/* Accent bar */}
                  <motion.div
                    className="service-accent-bar"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: "var(--accent)",
                      opacity: 0.3,
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ / Reassurance ── */}
      <section className="section" style={{ background: "var(--bg-primary)" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "var(--space-10)" }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--accent)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 700,
                display: "block",
                marginBottom: "var(--space-3)",
              }}
            >
              Common Questions
            </span>
            <h2>Frequently Asked</h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {[
              {
                q: "How far in advance should I book?",
                a: "We recommend booking at least 3–6 months in advance for weddings, especially during peak season (Oct–Feb). For corporate and portrait sessions, 2–4 weeks is usually sufficient.",
              },
              {
                q: "Do you travel outside Surat?",
                a: "Absolutely. We cover all of Gujarat and travel across India for destination weddings. Travel and accommodation costs are billed separately.",
              },
              {
                q: "How are the final photos delivered?",
                a: "All photos and videos are delivered via a private, password-protected online gallery. You can download full-resolution files directly from there.",
              },
              {
                q: "Can I customize a package?",
                a: "Yes — every package is a starting point. We're happy to add or remove elements to match your exact needs and budget.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--space-6)",
                }}
              >
                <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "var(--space-3)" }}>
                  {faq.q}
                </h4>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.65 }}>
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section" style={{ background: "var(--bg-secondary)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              Ready to Get Started?
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "var(--space-8)", fontSize: "0.95rem" }}>
              Drop us a message and we&apos;ll get back to you within 24 hours with a custom quote.
            </p>
            <Link href="/contact" className="btn btn-primary btn-xl">
              Book a Free Consultation <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <style>{`
        .services-editorial-item {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .services-editorial-item:hover {
          background: var(--bg-card) !important;
          border-color: var(--border-accent) !important;
          transform: translateY(-4px);
        }
        .services-editorial-item:hover .service-accent-bar {
          opacity: 1 !important;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }
        @media (max-width: 900px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
