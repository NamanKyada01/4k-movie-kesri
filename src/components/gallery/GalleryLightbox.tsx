"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Tag, Info, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import React, { useEffect } from "react";

interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  cloudinaryUrl: string;
}

interface GalleryLightboxProps {
  photo: GalleryPhoto;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  photo,
  onClose,
  onNext,
  onPrev,
}) => {
  // Prevent scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(10, 8, 0, 0.98)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1rem, 5vw, 4rem)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 350px",
          gap: "var(--space-10)",
          maxWidth: 1400,
          margin: "0 auto",
        }}
        className="lightbox-layout"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Media Container ── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "var(--radius-2xl)",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={photo.id}
              src={photo.cloudinaryUrl}
              alt={photo.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                boxShadow: "0 20px 80px rgba(0,0,0,0.8)",
              }}
            />
          </AnimatePresence>

          {/* Nav Controls */}
          <button
            onClick={onPrev}
            style={{
              position: "absolute",
              left: 20,
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            className="nav-btn"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={onNext}
            style={{
              position: "absolute",
              right: 20,
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            className="nav-btn"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* ── Info Container ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--accent)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Photography Dossier
              </span>
              <h2 style={{ fontSize: "2rem", lineHeight: 1.1, fontWeight: 900 }}>{photo.title}</h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              <X size={32} />
            </button>
          </div>

          <div
            style={{
              padding: "var(--space-6)",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-5)",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Tag size={16} color="var(--accent)" />
              <div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", textTransform: "capitalize" }}>{photo.category}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Calendar size={16} color="var(--accent)" />
              <div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Session Date</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>Autumn 2024</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Info size={16} color="var(--accent)" />
              <div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Technical Notes</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  Captured in native 4K RAW. Optimized for cinematic HDR reproduction. Post-processed at 4K Movie Kesri Studios.
                </div>
              </div>
            </div>
          </div>

          <div style={{ flexGrow: 1 }} />

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "var(--space-6)" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              This masterpiece is part of our legacy collection. Interested in a similar cinematic session?
            </p>
            <a
              href="/contact"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "var(--space-4)" }}
            >
              Enquire About This Style
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .nav-btn:hover { background: var(--accent) !important; color: black !important; transform: scale(1.1); }
        @media (max-width: 1100px) {
          .lightbox-layout { grid-template-columns: 1fr !important; overflow-y: auto; height: auto !important; max-height: 100%; }
        }
      `}</style>
    </motion.div>
  );
};
