"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCw, RotateCcw, ZoomIn, ZoomOut, Check, ImageOff, Loader2 } from "lucide-react";
import BorderGlow from "./BorderGlow";

interface ImageEditorModalProps {
  isOpen: boolean;
  src: string;
  onSave: (blob: Blob) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

interface CropState {
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

export default function ImageEditorModal({ isOpen, src, onSave, onCancel, isSaving }: ImageEditorModalProps) {
  const [cropState, setCropState] = useState<CropState>({ scale: 1, rotation: 0, offsetX: 0, offsetY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const resetCropState = () => setCropState({ scale: 1, rotation: 0, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    if (isOpen) resetCropState();
  }, [isOpen]);

  const handleApply = async () => {
    if (!src || !imgRef.current) return;

    const exportWidth = 1200; // High-def 3:2
    const exportHeight = 800;
    const canvas = document.createElement("canvas");
    canvas.width = exportWidth;
    canvas.height = exportHeight;
    const ctx = canvas.getContext("2d")!;
    
    const img = imgRef.current;
    const displayImg = img.getBoundingClientRect();
    const container = img.parentElement!.getBoundingClientRect();
    
    // Scale factor between screen pixels and export pixels
    // The frame on screen is 360px wide
    const screenToExportScale = exportWidth / 360;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, exportWidth, exportHeight);

    // 1. Move to center of canvas
    ctx.translate(exportWidth / 2, exportHeight / 2);
    
    // 2. Rotate
    ctx.rotate((cropState.rotation * Math.PI) / 180);

    // 3. Scale & Position
    // We need to calculate how large the 'natural' image would be on screen at scale 1
    // browser's 'contain' fit logic:
    const ratio = Math.min(container.width / img.naturalWidth, container.height / img.naturalHeight);
    const screenBaseWidth = img.naturalWidth * ratio;
    const screenBaseHeight = img.naturalHeight * ratio;

    // Apply user scale and convert to export coordinates
    const finalWidth = screenBaseWidth * cropState.scale * screenToExportScale;
    const finalHeight = screenBaseHeight * cropState.scale * screenToExportScale;
    
    // Convert screen offsets to export offsets
    const exportOffsetX = cropState.offsetX * screenToExportScale;
    const exportOffsetY = cropState.offsetY * screenToExportScale;

    // The rotation and offset are applied. Drawing is centered.
    // To handle the offset correctly under rotation, we apply it via translation *before* rotation or account for it. 
    // In our UI, offset is 'panning' the image, so it should be applied relative to rotation center.
    
    // Redo translation logic to match UI feel:
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
    ctx.translate(exportWidth / 2 + exportOffsetX, exportHeight / 2 + exportOffsetY);
    ctx.rotate((cropState.rotation * Math.PI) / 180);
    
    ctx.drawImage(
      img, 
      -finalWidth / 2, 
      -finalHeight / 2, 
      finalWidth, 
      finalHeight
    );

    canvas.toBlob((blob) => {
      if (blob) onSave(blob);
    }, "image/jpeg", 0.92);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setDragStart({ x: e.clientX - cropState.offsetX, y: e.clientY - cropState.offsetY });
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return;
    setCropState(prev => ({ ...prev, offsetX: e.clientX - dragStart.x, offsetY: e.clientY - dragStart.y }));
  };

  const onMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(15px)" }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{ width: "100%", maxWidth: "800px", zIndex: 1101, position: "relative" }}
          >
            <BorderGlow glowColor="232 85 10" backgroundColor="rgba(10, 10, 12, 0.95)" borderRadius={32}>
              <div style={{ padding: "40px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                  <div>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "white", margin: 0 }}>Refine Asset Image</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>Rotate, zoom, and position your technical asset</p>
                  </div>
                  <button onClick={onCancel} style={closeBtnStyle}><X size={20} /></button>
                </div>

                <div 
                  style={editorContainerStyle(isDragging)}
                  onMouseDown={onMouseDown} 
                  onMouseMove={onMouseMove} 
                  onMouseUp={onMouseUp} 
                  onMouseLeave={onMouseUp}
                >
                  <img
                    ref={imgRef}
                    src={src}
                    alt="Editor Preview"
                    style={{
                      transform: `translate(${cropState.offsetX}px, ${cropState.offsetY}px) rotate(${cropState.rotation}deg) scale(${cropState.scale})`,
                      transition: isDragging ? "none" : "transform 0.2s ease",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      pointerEvents: "none",
                      display: "block",
                    }}
                  />
                  
                  {/* Visual Crop Outline */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <div style={{
                      width: "360px",
                      height: "240px",
                      border: "2px dashed var(--accent)",
                      borderRadius: "8px",
                      boxShadow: "0 0 0 5000px rgba(0,0,0,0.6)",
                      position: "relative"
                    }}>
                      <div style={{
                        position: "absolute",
                        top: -25,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: "0.6rem",
                        color: "var(--accent)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        fontWeight: 800,
                        whiteSpace: "nowrap"
                      }}>
                        Export Boundary (3:2)
                      </div>
                    </div>
                  </div>

                  <div style={dragHintStyle}>Drag to Pan Asset</div>
                </div>

                <div style={controlsContainerStyle}>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="button" onClick={() => setCropState(p => ({ ...p, rotation: p.rotation - 90 }))} style={iconBtnStyle} title="Rotate Left">
                      <RotateCcw size={18} />
                    </button>
                    <button type="button" onClick={() => setCropState(p => ({ ...p, rotation: p.rotation + 90 }))} style={iconBtnStyle} title="Rotate Right">
                      <RotateCw size={18} />
                    </button>
                  </div>

                  <div style={separatorStyle} />

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="button" onClick={() => setCropState(p => ({ ...p, scale: Math.max(p.scale - 0.1, 0.3) }))} style={iconBtnStyle} title="Zoom Out">
                      <ZoomOut size={18} />
                    </button>
                    <button type="button" onClick={() => setCropState(p => ({ ...p, scale: Math.min(p.scale + 0.1, 3) }))} style={iconBtnStyle} title="Zoom In">
                      <ZoomIn size={18} />
                    </button>
                  </div>

                  <div style={separatorStyle} />
                  
                  <button type="button" onClick={resetCropState} style={iconBtnStyle} title="Reset All Transforms">
                    <ImageOff size={18} />
                  </button>
                </div>

                <div style={{ display: "flex", gap: "16px", marginTop: "40px" }}>
                  <button onClick={onCancel} style={secondaryBtnStyle}>Abandon Changes</button>
                  <button onClick={handleApply} disabled={isSaving} style={primaryBtnStyle}>
                    {isSaving ? <><Loader2 size={18} className="animate-spin" /> Finalizing...</> : <><Check size={18} /> Apply & Deploy</>}
                  </button>
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Styles
const closeBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "none",
  color: "rgba(255,255,255,0.3)",
  padding: "10px",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.2s ease"
};

const editorContainerStyle = (isDragging: boolean): React.CSSProperties => ({
  width: "100%",
  height: "400px",
  background: "#000",
  borderRadius: "20px",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: isDragging ? "grabbing" : "grab",
  position: "relative",
  userSelect: "none"
});

const dragHintStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(0,0,0,0.6)",
  backdropFilter: "blur(4px)",
  padding: "6px 16px",
  borderRadius: "100px",
  fontSize: "0.7rem",
  color: "rgba(255,255,255,0.5)",
  letterSpacing: "1px",
  textTransform: "uppercase"
};

const controlsContainerStyle: React.CSSProperties = {
  marginTop: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "20px"
};

const iconBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "white",
  padding: "12px",
  borderRadius: "14px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const separatorStyle: React.CSSProperties = {
  width: "1px",
  height: "24px",
  background: "rgba(255,255,255,0.1)"
};

const primaryBtnStyle: React.CSSProperties = {
  flex: 2,
  padding: "16px",
  background: "var(--accent)",
  border: "none",
  borderRadius: "16px",
  color: "white",
  fontWeight: 700,
  fontSize: "0.95rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  boxShadow: "0 8px 24px var(--accent-glow)"
};

const secondaryBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: "16px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  color: "rgba(255,255,255,0.6)",
  fontWeight: 600,
  fontSize: "0.95rem",
  cursor: "pointer"
};
