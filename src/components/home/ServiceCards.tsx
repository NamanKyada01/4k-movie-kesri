"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { StarBorder } from "@/components/ui/StarBorder";

const services = [
  {
    icon: "💍",
    title: "Wedding Photography",
    description: "Every vow, every tear, every smile — captured in cinematic 4K. Your love story, told with artistry.",
    href: "/services",
    tag: "Most Popular",
  },
  {
    icon: "🎥",
    title: "Cinematic Videography",
    description: "4K highlight reels that feel like films. Drone shots, slow-motion, color graded to perfection.",
    href: "/services",
    tag: null,
  },
  {
    icon: "👤",
    title: "Portrait Sessions",
    description: "Studio and outdoor portraits that capture personality. Corporate headshots to family portraits.",
    href: "/services",
    tag: null,
  },
  {
    icon: "🏢",
    title: "Corporate Events",
    description: "Product launches, conferences, team outings. Professional documentation of your brand moments.",
    href: "/services",
    tag: null,
  },
];

export function ServiceCards() {
  return (
    <section className="section" style={{ background: "transparent" }}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "var(--space-10)" }}
        >
          <span style={{ fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
            What We Do
          </span>
          <h2 style={{ marginTop: "var(--space-2)" }}>
            Our Professional Services
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{ position: "relative" }}
            >
              <StarBorder
                thickness={2}
                color="rgba(232, 85, 10, 0.5)"
                speed="8s"
                className="w-full h-full"
              >
                <div 
                  className="card card-accent-hover"
                  style={{ 
                    width: "100%", 
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    padding: "var(--space-8)",
                    border: "none", // Let StarBorder handle the "border" look
                    background: "var(--bg-card)",
                    borderRadius: "inherit"
                  }}
                >
                  {service.tag && (
                    <div
                      style={{
                        position: "absolute",
                        top: "var(--space-4)",
                        right: "var(--space-4)",
                      }}
                    >
                      <span className="badge badge-accent">{service.tag}</span>
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "2.5rem",
                      marginBottom: "var(--space-5)",
                      lineHeight: 1,
                    }}
                  >
                    {service.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      marginBottom: "var(--space-3)",
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em"
                    }}
                  >
                    {service.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "var(--space-6)", color: "var(--text-muted)" }}>
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--accent)",
                      transition: "gap var(--transition-fast)",
                      marginTop: "auto",
                      paddingTop: "var(--space-4)",
                      borderTop: "1px solid var(--border)"
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.gap = "12px";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.gap = "8px";
                    }}
                  >
                    Explore Service <ArrowRight size={14} />
                  </Link>
                </div>
              </StarBorder>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginTop: "var(--space-10)" }}
        >
          <Link href="/services" className="btn btn-outline-accent btn-lg">
            View All Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
