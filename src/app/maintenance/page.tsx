"use client";

import { motion } from "framer-motion";
import { Camera, Clock } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div 
      style={{ 
        minHeight: "100svh", 
        background: "var(--bg-primary)", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        padding: "var(--space-6)",
        textAlign: "center"
      }}
    >
      {/* Ambient backgrounds */}
      <div style={{ position: "fixed", top: "-10%", right: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(232,85,10,0.08) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-10%", left: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{ position: "relative", zIndex: 3 }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 80, height: 80, borderRadius: "50%", border: "2px solid var(--accent)", marginBottom: "var(--space-8)" }}>
          <Camera size={32} color="var(--accent)" />
        </div>
        
        <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", fontWeight: 900, marginBottom: "var(--space-4)", letterSpacing: "-0.03em" }}>
          Crafting Something <span style={{ color: "var(--accent)" }}>Cinematic</span>
        </h1>
        
        <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: 500, marginInline: "auto", lineHeight: 1.6, marginBottom: "var(--space-10)" }}>
          We&apos;re currently updating our gallery and site experience to serve you better. We&apos;ll be back online in a few moments.
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: "var(--accent)", fontSize: "0.9rem", fontWeight: 600 }}>
          <Clock size={18} />
          <span>Estimated downtime: 1 hour</span>
        </div>
      </motion.div>

      {/* Footer watermark */}
      <div style={{ position: "absolute", bottom: 40, opacity: 0.2, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        4K Movie Kesri · Surat
      </div>
    </div>
  );
}
