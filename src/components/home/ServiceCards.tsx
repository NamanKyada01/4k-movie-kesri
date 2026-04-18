"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
    <section className="section" style={{ background: "var(--bg-secondary)" }}>
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
            Our Services
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "var(--space-5)",
          }}
        >
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card card-accent-hover"
              style={{ position: "relative" }}
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
                  fontSize: "2rem",
                  marginBottom: "var(--space-4)",
                  lineHeight: 1,
                }}
              >
                {service.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  marginBottom: "var(--space-3)",
                  color: "var(--text-primary)",
                }}
              >
                {service.title}
              </h3>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "var(--space-5)", color: "var(--text-muted)" }}>
                {service.description}
              </p>
              <Link
                href={service.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--accent)",
                  transition: "gap var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.gap = "10px";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.gap = "6px";
                }}
              >
                Explore <ArrowRight size={14} />
              </Link>
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
