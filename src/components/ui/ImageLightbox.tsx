"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Download, Maximize } from "lucide-react";

interface ImageLightboxProps {
  isOpen: boolean;
  src: string;
  onClose: () => void;
  alt?: string;
}

export default function ImageLightbox({ isOpen, src, onClose, alt = "Technical Asset Preview" }: ImageLightboxProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", backdropFilter: "blur(20px)" }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{ 
                position: "relative", 
                maxWidth: "90vw", 
                maxHeight: "90vh", 
                zIndex: 3001,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
          >
            {/* toolbar */}
            <div style={{ 
                position: "absolute", 
                top: "-60px", 
                right: 0, 
                display: "flex", 
                gap: "12px" 
            }}>
                <button onClick={onClose} style={controlBtnStyle} title="Return to Inventory">
                    <X size={20} /> Close
                </button>
            </div>

            <div style={{ 
                position: "relative", 
                borderRadius: "24px", 
                overflow: "hidden", 
                boxShadow: "0 50px 100px rgba(0,0,0,0.9)",
                border: "1px solid rgba(255,255,255,0.1)"
            }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={src} 
                    alt={alt} 
                    style={{ 
                        maxWidth: "100%", 
                        maxHeight: "80vh", 
                        display: "block",
                        objectFit: "contain"
                    }} 
                />
                
                {/* Info Overlay */}
                <div style={infoOverlayStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ padding: "8px", background: "rgba(232, 85, 10, 0.2)", borderRadius: "8px" }}>
                            <Maximize size={16} color="var(--accent)" />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: "0.85rem", color: "white", fontWeight: 700 }}>High-Fidelity Preview</p>
                            <p style={{ margin: 0, fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Cinematic Asset Archive</p>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const controlBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "white",
  padding: "10px 20px",
  borderRadius: "100px",
  fontSize: "0.85rem",
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.2s ease"
};

const infoOverlayStyle: React.CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: "24px 30px",
  background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end"
};
