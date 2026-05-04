"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Film, Monitor, Radio, Share2, Video } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { SectionDecorator } from "@/components/ui/SectionDecorator";

const services = [
  {
    num: "01",
    title: "Pre-Wedding",
    description: "Atmospheric outdoor sessions that capture the chemistry between souls — golden hour, dramatic landscapes.",
    href: "/services",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
    tag: "Most Popular",
  },
  {
    num: "02",
    title: "Wedding Shoot",
    description: "Every vow, every tear, every smile — captured with cinema-grade precision that stands the test of time.",
    href: "/services",
    icon: Film,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", // Grand wedding
    tag: "",
  },
  {
    num: "03",
    title: "Photography",
    description: "High-end portraiture, corporate, and event photography. Studio and on-location available.",
    href: "/services",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800", // Portrait/fashion
    tag: "",
  },
  {
    num: "04",
    title: "Videography",
    description: "Cinematic 4K storytelling tailored for your special moments — color-graded and delivered in 48h.",
    href: "/services",
    icon: Video,
    image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&q=80&w=800", // Video camera
    tag: "",
  },
  {
    num: "05",
    title: "Crane Services",
    description: "Sweeping aerial angles with professional camera jibs and cranes for truly cinematic productions.",
    href: "/services",
    icon: Film,
    image: "https://images.unsplash.com/photo-1522204657746-fccce0824cfd?auto=format&fit=crop&q=80&w=800",
    tag: "",
  },
  {
    num: "06",
    title: "LED Screens",
    description: "High-resolution LED walls and stage backdrops that transform any venue into a visual spectacle.",
    href: "/services",
    icon: Monitor,
    image: "https://images.unsplash.com/photo-1470229722913-7c090be5c520?auto=format&fit=crop&q=80&w=800", // Stage concert LED
    tag: "",
  },
  {
    num: "07",
    title: "Live Telecast",
    description: "Multi-camera live mixing and projection for large venues — seamless broadcast quality.",
    href: "/services",
    icon: Radio,
    image: "https://images.unsplash.com/photo-1521362800473-12502e4ebc52?auto=format&fit=crop&q=80&w=800",
    tag: "",
  },
  {
    num: "08",
    title: "Facebook Live",
    description: "Stream your event to your audience in real-time. Stable connection, professional quality.",
    href: "/services",
    icon: Share2,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
    tag: "",
  },
  {
    num: "09",
    title: "YouTube Live",
    description: "High-quality YouTube broadcasting for global reach — your moment, seen by thousands.",
    href: "/services",
    icon: Video,
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=800",
    tag: "",
  },
];

export function ServiceCards() {
  return (
    <section className="svc-section">
      <SectionDecorator watermark="SERVICES" />
      <div className="container">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="svc-header"
        >

          <span className="svc-eyebrow">— Our Expertise</span>
          <h2 className="svc-title">
            What We Do<br />
            <span className="text-gradient-gold">Best.</span>
          </h2>
          <p className="svc-subtitle">
            Nine distinct services, one relentless commitment — to make every moment extraordinary.
          </p>
        </motion.div>

        {/* ── Grid ── */}
        <div className="svc-grid">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <SpotlightCard
                  className="svc-card"
                  spotlightColor="rgba(212,160,23,0.12)"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-2xl)",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <Link href={svc.href} className="svc-card-link">
                    {/* Image */}
                    <div className="svc-img-wrap">
                      <img src={svc.image} alt={svc.title} className="svc-img" />
                      <div className="svc-img-overlay" />
                      {/* Step number */}
                      <div className="svc-num">{svc.num}</div>
                      {/* Tag */}
                      {svc.tag && (
                        <div className="svc-tag">{svc.tag}</div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="svc-content">
                      <div className="svc-icon-row">
                        <div className="svc-icon-bg">
                          <Icon size={15} />
                        </div>
                        <h3 className="svc-name">{svc.title}</h3>
                      </div>
                      <p className="svc-desc">{svc.description}</p>
                      <div className="svc-link">
                        Explore <ArrowRight size={13} />
                      </div>
                    </div>
                  </Link>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

        {/* ── CTA row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ textAlign: "center", marginTop: "var(--space-12)" }}
        >
          <Link href="/services" className="btn btn-ghost btn-lg" style={{ borderRadius: "var(--radius-full)" }}>
            View All Services <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      <style>{`
        .svc-section {
          background: transparent;
          position: relative;
          overflow: hidden;
          padding-block: clamp(4rem, 10vw, 7rem);
        }

        .svc-header {
          text-align: center;
          margin-bottom: clamp(var(--space-10), 6vw, var(--space-16));
          position: relative;
          z-index: 2;
        }

        .svc-eyebrow {
          font-size: 0.9rem;
          color: var(--accent);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
          font-family: var(--font-body);
          display: block;
          margin-bottom: var(--space-3);
        }

        .svc-title {
          font-size: clamp(2.5rem, 7vw, 4.5rem);
          line-height: 1.05;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: var(--space-4);
        }

        .svc-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          max-width: 440px;
          margin-inline: auto;
          line-height: 1.65;
        }

        /* Grid — 3 cols desktop, 2 tablet, 1 mobile */
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-5);
          position: relative;
          z-index: 2;
        }

        .svc-card {
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, border-color 0.3s ease;
        }
        .svc-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-accent) !important;
          border-color: var(--border-accent) !important;
        }
        .svc-card-link {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          height: 100%;
        }

        .svc-img-wrap {
          width: 100%;
          height: 220px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .svc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .svc-card:hover .svc-img { transform: scale(1.07); }

        .svc-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(6,6,6,0.5) 100%);
        }

        .svc-num {
          position: absolute;
          top: 12px;
          left: 14px;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--gold);
          letter-spacing: 0.05em;
          background: rgba(6,6,6,0.6);
          border: 1px solid rgba(245,215,110,0.2);
          border-radius: var(--radius-full);
          padding: 3px 12px;
        }

        .svc-tag {
          position: absolute;
          top: 12px;
          right: 14px;
          font-size: 0.6rem;
          font-weight: 700;
          color: #060606;
          background: var(--gold);
          border-radius: var(--radius-full);
          padding: 2px 9px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .svc-content {
          padding: var(--space-5) var(--space-5) var(--space-5);
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: var(--space-2);
        }

        .svc-icon-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-1);
        }

        .svc-icon-bg {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-md);
          background: var(--accent-muted);
          border: 1px solid var(--border-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
        }

        .svc-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .svc-desc {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text-muted);
          flex: 1;
        }

        .svc-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.88rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent);
          margin-top: var(--space-1);
          transition: gap 0.2s ease;
        }
        .svc-card:hover .svc-link { gap: 9px; }

        @media (max-width: 1024px) {
          .svc-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .svc-grid { grid-template-columns: 1fr; gap: var(--space-4); }
          .svc-img-wrap { height: 200px; }
        }
      `}</style>
    </section>
  );
}
