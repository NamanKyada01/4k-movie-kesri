import { motion } from "framer-motion";
import { Camera, Clock } from "lucide-react";
import { CinemaBackground } from "@/components/layout/CinemaBackground";

export default function MaintenancePage() {
  return (
    <div 
      style={{ 
        minHeight: "100svh", 
        background: "transparent", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        padding: "var(--space-6)",
        textAlign: "center"
      }}
    >
      <CinemaBackground theme={{ primary: "sepia", secondary: "blue" }} />

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
