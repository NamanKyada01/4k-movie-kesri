"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Box, Maximize2 } from "lucide-react";
import { GalleryLightbox } from "./GalleryLightbox";
import DomeGallery from "../ui/DomeGallery";

interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  cloudinaryUrl: string;
}

interface GalleryGridProps {
  photos: GalleryPhoto[];
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ photos }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"masonry" | "dome">("masonry");

  const handleNext = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length);
  };

  // Format images for DomeGallery
  const domeImages = photos.map(p => ({ src: p.cloudinaryUrl, alt: p.title }));

  return (
    <div style={{ position: "relative" }}>
      {/* ── View Toggle ── */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: "var(--space-12)",
          gap: "var(--space-4)"
        }}
      >
        <button
          onClick={() => setViewMode("masonry")}
          className={`btn ${viewMode === "masonry" ? "btn-primary" : "btn-ghost"}`}
          style={{ gap: 10 }}
        >
          <LayoutGrid size={18} /> Masonry Grid
        </button>
        <button
          onClick={() => setViewMode("dome")}
          className={`btn ${viewMode === "dome" ? "btn-primary" : "btn-ghost"}`}
          style={{ gap: 10 }}
        >
          <Box size={18} /> Cinematic Showcase
        </button>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "masonry" ? (
          <motion.div
            key="masonry"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ columnCount: 3, columnGap: "var(--space-5)" }} className="gallery-masonry">
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  layoutId={`photo-${photo.id}`}
                  style={{
                    breakInside: "avoid",
                    marginBottom: "var(--space-5)",
                    borderRadius: "var(--radius-xl)",
                    border: "1px solid var(--border)",
                    position: "relative",
                    overflow: "hidden",
                    background: "var(--bg-elevated)",
                    cursor: "pointer",
                  }}
                  onClick={() => setActivePhotoIndex(i)}
                  whileHover={{ scale: 0.98 }}
                >
                  <img 
                    src={photo.cloudinaryUrl} 
                    alt={photo.title} 
                    style={{ width: "100%", height: "auto", display: "block" }} 
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div 
                    style={{ 
                      position: "absolute", 
                      inset: 0, 
                      background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: "var(--space-5)"
                    }}
                    className="gallery-item-overlay"
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "white" }}>{photo.title}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--accent)", textTransform: "capitalize" }}>{photo.category}</div>
                      </div>
                      <Maximize2 size={16} color="white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              width: "100vw",
              height: "85vh",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
              position: "relative",
              background: "rgba(0,0,0,0.8)",
              overflow: "hidden",
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DomeGallery 
              images={domeImages} 
              fit={0.7}
              grayscale={false}
              overlayBlurColor="transparent"
              imageBorderRadius="12px"
            />
            
            {/* Hint */}
            <div 
              style={{ 
                position: "absolute", 
                bottom: 30, 
                left: "50%", 
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.6)",
                padding: "8px 20px",
                borderRadius: 100,
                fontSize: "0.75rem",
                color: "var(--text-primary)",
                pointerEvents: "none",
                zIndex: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(4px)",
              }}
            >
              DRAG TO ROTATE • SCROLL TO ZOOM • CLICK TO ENLARGE
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activePhotoIndex !== null && (
          <GalleryLightbox
            photo={photos[activePhotoIndex]}
            onClose={() => setActivePhotoIndex(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>

      <style>{`
        .gallery-masonry div:hover .gallery-item-overlay { opacity: 1 !important; }
        @media (max-width: 900px) { .gallery-masonry { column-count: 2 !important; } }
        @media (max-width: 500px) { .gallery-masonry { column-count: 1 !important; } }
      `}</style>
    </div>
  );
};
