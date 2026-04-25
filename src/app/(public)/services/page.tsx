"use client";

import { motion } from "framer-motion";
import { Camera, Video, MonitorPlay, Users, PackageOpen, Award, CheckCircle2 } from "lucide-react";
import { CinemaBackground } from "@/components/layout/CinemaBackground";

const servicesList = [
  {
    icon: Camera,
    title: "Cinematic Wedding Photography",
    desc: "We capture the essence of your special day with high-end equipment, ensuring every emotion, detail, and moment is preserved forever in breathtaking quality.",
    features: ["Pre-wedding shoots", "Candid photography", "Traditional coverage", "Premium photo albums"],
    delay: 0.1
  },
  {
    icon: Video,
    title: "4K Wedding Cinematic Films",
    desc: "Our signature 4K highlight reels and full-length cinematic documentaries tell your love story beautifully. Directed entirely like a premium cinema production.",
    features: ["Drone coverage", "Professional color grading", "Highlight trailers", "Full documentary edits"],
    delay: 0.2
  },
  {
    icon: Users,
    title: "Portrait & Fashion",
    desc: "Stand out with stunning portraits. Whether it's a personal milestone, modeling portfolio, or professional corporate headshots, we master the lighting to make you look your best.",
    features: ["Studio lighting setup", "Outdoor sessions", "Editorial retouching", "Quick digital delivery"],
    delay: 0.3
  },
  {
    icon: MonitorPlay,
    title: "Corporate & Event Coverage",
    desc: "Professional documentation for your corporate events, product launches, conventions, and team outings. We ensure your brand looks sharp and engaging.",
    features: ["Multi-camera setups", "Live streaming options", "Same-day edit delivery", "Executive interviews"],
    delay: 0.4
  },
  {
    icon: PackageOpen,
    title: "Commercial Product Shoots",
    desc: "Elevate your e-commerce and marketing with high-resolution, perfectly lit product photography that drives sales and boosts brand perception.",
    features: ["White background items", "Lifestyle product shoots", "Macro detailing", "Ad-ready formatting"],
    delay: 0.5
  },
  {
    icon: Award,
    title: "Premium Photo Albums",
    desc: "Your memories deserve to be touched. We offer handcrafted, premium quality photo books and albums made from archival-grade materials.",
    features: ["Custom layouts", "Leather/Glass covers", "Lay-flat binding", "Lifetime durability"],
    delay: 0.6
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ServicesPage() {
  return (
    <>
      <CinemaBackground theme={{ primary: "amber", secondary: "gold" }} />
      
      {/* Hero Section */}
      <section className="section" style={{ background: "transparent", paddingTop: "clamp(8rem, 15vh, 12rem)", position: "relative", overflow: "hidden" }}>
        {/* Ambient Glow */}
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(232,85,10,0.05) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />
        
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "0.8rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: "var(--space-4)" }}
          >
            The Repository
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ 
              fontSize: "clamp(2.5rem, 10vw, 4.5rem)", 
              lineHeight: 0.9, 
              fontWeight: 900, 
              letterSpacing: "-0.04em",
              marginBottom: "var(--space-6)" 
            }}
          >
            Our Professional <br />
            <span style={{ color: "var(--text-secondary)", opacity: 0.5 }}>Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 600 }}
          >
            A curated suite of high-fidelity media services. We blend cinematic vision with surgical technical precision to capture moments that transcend time.
          </motion.p>
        </div>
      </section>

      {/* Services List */}
      <section className="section" style={{ paddingTop: "var(--space-8)" }}>
        <div className="container">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "var(--space-3)" 
            }}
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
                    padding: "var(--space-10) var(--space-6)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "var(--radius-3xl)",
                    border: "1px solid rgba(255,255,255,0.03)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div style={{ position: "absolute", top: -40, right: -40, opacity: 0.05, color: "var(--accent)" }}>
                    <Icon size={240} />
                  </div>
                  
                  <div style={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: "var(--radius-xl)", 
                    background: "var(--bg-primary)", 
                    border: "1px solid var(--border)",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    marginBottom: "var(--space-8)",
                    position: "relative",
                    zIndex: 2
                  }}>
                    <Icon size={24} color="var(--accent)" />
                  </div>
                  
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <h3 style={{ 
                      fontSize: "1.75rem", 
                      marginBottom: "var(--space-4)", 
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1
                    }}>
                      {svc.title}
                    </h3>
                    <p style={{ 
                      color: "var(--text-muted)", 
                      fontSize: "1rem", 
                      lineHeight: 1.7, 
                      marginBottom: "var(--space-8)", 
                      maxWidth: "90%" 
                    }}>
                      {svc.desc}
                    </p>
                    
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {svc.features.map((feat, j) => (
                        <span key={j} style={{ 
                          fontSize: "0.7rem", 
                          color: "var(--text-secondary)", 
                          background: "rgba(255,255,255,0.04)", 
                          padding: "6px 14px", 
                          borderRadius: "var(--radius-full)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          border: "1px solid rgba(255,255,255,0.05)"
                        }}>
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Kinetic Bottom Bar */}
                  <motion.div 
                    className="service-accent-bar"
                    style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "var(--accent)", opacity: 0.3 }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <style>{`
        .services-editorial-item {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .services-editorial-item:hover {
          background: var(--bg-card) !important;
          transform: scale(0.98);
        }
        .services-editorial-item:hover .service-accent-bar {
          opacity: 1 !important;
        }
        @media (min-width: 1024px) {
          .services-editorial-item {
            padding: var(--space-12) !important;
          }
        }
      `}</style>
    </>
  );
}
