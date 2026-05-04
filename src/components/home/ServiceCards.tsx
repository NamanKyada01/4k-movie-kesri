"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Pre-wedding",
    description: "Atmospheric outdoor sessions that capture the chemistry between souls.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Wedding Shoot",
    description: "Every vow, every tear, every smile — captured beautifully.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Photography",
    description: "High-end portraiture, corporate, and event photography.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Videography",
    description: "Cinematic 4K storytelling tailored for your special moments.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Crane Services",
    description: "Dynamic, sweeping angles with professional camera jibs and cranes.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1522204657746-fccce0824cfd?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "LED Screens",
    description: "High-resolution LED wall setups for events and stage backdrops.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Live Telecast",
    description: "Multi-camera live mixing and projection for large venues.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1521362800473-12502e4ebc52?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Facebook Live",
    description: "Stream your event seamlessly to your audience on Facebook.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "YouTube Live",
    description: "High-quality YouTube broadcasting for global reach.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=800",
  },
];

export function ServiceCards() {
  return (
    <section className="svc-section">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="svc-header"
        >
          <span className="svc-eyebrow">Our Expertise</span>
          <h2 className="svc-title">
            Photography & <br />
            <span className="text-accent">Production Services</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="svc-grid">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={svc.href} className="svc-card-link">
                <div className="svc-card">
                  <div className="svc-img-wrap">
                    <img src={svc.image} alt={svc.title} className="svc-img" />
                    <div className="svc-img-overlay" />
                  </div>
                  
                  <div className="svc-content">
                    <h3 className="svc-name">{svc.title}</h3>
                    <p className="svc-desc">{svc.description}</p>
                    <div className="svc-link text-accent">
                      Explore <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .svc-section {
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
          padding-block: clamp(3rem, 8vw, 6rem);
        }

        .svc-header {
          margin-bottom: var(--space-8);
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .svc-eyebrow {
          font-size: 0.75rem;
          color: var(--accent);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 700;
          font-family: var(--font-body);
          display: block;
          margin-bottom: var(--space-3);
        }

        .svc-title {
          font-size: clamp(2.2rem, 6vw, 3.5rem);
          line-height: 1.1;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        /* 3-col desktop, 2-col tablet, 1-col mobile */
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
          position: relative;
          z-index: 2;
        }

        .svc-card-link { display: block; text-decoration: none; height: 100%; }

        .svc-card {
          background: var(--bg-card);
          border-radius: var(--radius-2xl);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          border: 1px solid var(--border);
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          box-shadow: var(--shadow-sm);
        }

        .svc-card:hover {
          border-color: var(--border-accent);
          transform: translateY(-4px);
          box-shadow: var(--shadow-accent);
        }

        .svc-img-wrap {
          width: 100%;
          height: 240px;
          position: relative;
          overflow: hidden;
        }

        .svc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .svc-card:hover .svc-img {
          transform: scale(1.05);
        }

        .svc-content {
          padding: var(--space-5) var(--space-6);
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .svc-name {
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: var(--space-2);
          color: var(--text-primary);
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .svc-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-muted);
          margin-bottom: var(--space-4);
          flex: 1;
        }

        .svc-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: transform 0.2s ease;
        }

        .svc-card:hover .svc-link {
          transform: translateX(4px);
        }

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
