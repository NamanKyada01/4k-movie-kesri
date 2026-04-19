"use client";

import { motion } from "framer-motion";
import { Camera, Video, MonitorPlay, Users, PackageOpen, Award, CheckCircle2 } from "lucide-react";

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
      <section className="section" style={{ background: "var(--bg-primary)", paddingTop: "clamp(8rem, 15vh, 12rem)", position: "relative", overflow: "hidden" }}>
        {/* Ambient Glow */}
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: "30vw", height: "30vw", background: "radial-gradient(circle, rgba(232,85,10,0.05) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />
        
        <div className="container" style={{ textAlign: "center", maxWidth: 800, position: "relative", zIndex: 1 }}>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "0.8rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "var(--space-3)" }}
          >
            What We Do
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ marginBottom: "var(--space-5)" }}
          >
            Our Professional Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}
          >
            Comprehensive media solutions for every occasion. We blend artistic vision with technical perfection to deliver outstanding photography and videography.
          </motion.p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-6)" }}
          >
            {servicesList.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="card" 
                  style={{ 
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    padding: "var(--space-10) var(--space-8)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ position: "absolute", top: -20, right: -20, opacity: 0.03, color: "var(--accent)" }}>
                    <Icon size={180} />
                  </div>
                  
                  <div style={{ 
                    width: 70, 
                    height: 70, 
                    borderRadius: "20px", 
                    background: "linear-gradient(135deg, var(--accent) 0%, #8B2E00 100%)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    marginBottom: "var(--space-8)", 
                    boxShadow: "0 10px 30px rgba(232, 85, 10, 0.2)",
                    position: "relative",
                    zIndex: 2
                  }}>
                    <Icon size={30} color="white" />
                  </div>
                  
                  <h3 style={{ fontSize: "1.45rem", marginBottom: "var(--space-4)", fontWeight: 800 }}>{svc.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.98rem", lineHeight: 1.7, marginBottom: "var(--space-8)", flexGrow: 1 }}>
                    {svc.desc}
                  </p>
                  
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-6)" }}>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                      {svc.features.map((feat, j) => (
                        <li key={j} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.88rem", color: "var(--text-primary)" }}>
                          <CheckCircle2 size={16} color="var(--accent)" style={{ opacity: 0.8 }} />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.div 
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "var(--accent)", transformOrigin: "left" }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}
