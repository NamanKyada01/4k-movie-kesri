"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { StarBorder } from "@/components/ui/StarBorder";

const services = [
  {
    title: "Cinematic Wedding Films",
    description: "Every vow, every tear, every smile — captured in cinematic 4K. Your love story, told with the precision of high-end cinema.",
    href: "/services",
    tag: "Trending",
    icon: "🎞️",
    color: "var(--accent)"
  },
  {
    title: "Editorial Photography",
    description: "High-fashion portraiture and event coverage. We master the light to create images that belong on a magazine cover.",
    href: "/services",
    tag: null,
    icon: "📸",
    color: "#C9A84C"
  },
  {
    title: "Pre-Wedding Masterpieces",
    description: "Atmospheric outdoor sessions that capture the chemistry between souls. Directional lighting and artistic framing.",
    href: "/services",
    tag: null,
    icon: "💑",
    color: "var(--accent)"
  },
  {
    title: "Luxury Photo Albums",
    description: "Handcrafted, archival-grade memories. Your moments deserve the tactile excellence of premium leather and glass.",
    href: "/services",
    tag: null,
    icon: "📖",
    color: "#C9A84C"
  },
];

export function ServiceCards() {
  return (
    <section className="section" style={{ background: "var(--bg-primary)", position: "relative", overflow: "hidden" }}>
      {/* Decorative Light Leak */}
      <div style={{ position: "absolute", top: "20%", left: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(232,85,10,0.08) 0%, transparent 70%)", filter: "blur(100px)", pointerEvents: "none" }} />
      
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: "var(--space-12)", position: "relative", zIndex: 2 }}
        >
          <span style={{ 
            fontSize: "0.75rem", 
            color: "var(--accent)", 
            letterSpacing: "0.2em", 
            textTransform: "uppercase", 
            fontWeight: 700,
            display: "block",
            marginBottom: "var(--space-2)"
          }}>
            The Collection
          </span>
          <h2 style={{ 
            fontSize: "clamp(2.2rem, 8vw, 3.5rem)", 
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: "-0.03em"
          }}>
            Our Professional <br />
            <span style={{ color: "var(--text-secondary)", opacity: 0.5 }}>Services</span>
          </h2>
        </motion.div>

        {/* Vertical Stack for Mobile / Grid for Desktop */}
        <div
          className="services-stack"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
            position: "relative",
            zIndex: 2
          }}
        >
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link
                href={service.href}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div 
                  className="service-editorial-card"
                  style={{ 
                    background: "var(--bg-elevated)",
                    padding: "var(--space-8) var(--space-6)",
                    borderRadius: "var(--radius-2xl)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-6)",
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.03)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Subtle Accent Glow */}
                  <div style={{ 
                    position: "absolute", 
                    top: "-20%", 
                    right: "-10%", 
                    width: "150px", 
                    height: "150px", 
                    background: `radial-gradient(circle, ${service.color}15 0%, transparent 70%)`,
                    filter: "blur(30px)",
                    pointerEvents: "none"
                  }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "2.5rem", opacity: 0.8 }}>{service.icon}</div>
                    {service.tag && (
                      <span style={{ 
                        fontSize: "0.6rem", 
                        background: "var(--accent)", 
                        color: "white", 
                        padding: "4px 10px", 
                        borderRadius: "var(--radius-full)",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em"
                      }}>
                        {service.tag}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 style={{ 
                      fontSize: "1.5rem", 
                      fontWeight: 800, 
                      marginBottom: "var(--space-2)",
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em"
                    }}>
                      {service.title}
                    </h3>
                    <p style={{ 
                      fontSize: "0.95rem", 
                      lineHeight: 1.6, 
                      color: "var(--text-muted)",
                      maxWidth: "90%"
                    }}>
                      {service.description}
                    </p>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 12, 
                    fontSize: "0.8rem", 
                    fontWeight: 700, 
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em"
                  }}>
                    Explore <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginTop: "var(--space-12)" }}
        >
          <Link href="/services" className="btn btn-ghost btn-xl" style={{ border: "1px solid var(--border)" }}>
            View Full Repository
          </Link>
        </motion.div>
      </div>

      <style>{`
        .service-editorial-card:hover {
          background: var(--bg-card) !important;
          border-color: rgba(232, 85, 10, 0.2) !important;
          transform: translateY(-4px);
        }
        @media (min-width: 1024px) {
          .services-stack {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
