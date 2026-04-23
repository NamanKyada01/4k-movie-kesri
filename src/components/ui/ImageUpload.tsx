"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Loader2, X, Edit3, Image as ImageIcon, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ImageEditorModal from "./ImageEditorModal";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({ value, onChange, folder = "general", label = "Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [tempSrc, setTempSrc] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB.");
      return;
    }

    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempSrc(e.target?.result as string);
      setIsEditorOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleEditorSave = async (blob: Blob) => {
    setIsUploading(true);
    try {
      const fileName = pendingFile?.name || "upload.jpg";
      const fileToUpload = new File([blob], fileName, { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("folder", `4kmoviekesri-${folder}`);

      const response = await fetch("/api/admin/upload", { 
        method: "POST", 
        body: formData 
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");

      onChange(data.results[0].secure_url);
      setIsEditorOpen(false);
      setTempSrc(null);
      setPendingFile(null);
      toast.success("Image integrated into studio registry.");
    } catch (error: any) {
      toast.error(error.message || "Failed to bridge image to Cloudinary.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <label style={labelStyle}>{label}</label>

      {value ? (
        <div 
          style={previewContainerStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={`${value}?v=${Date.now()}`} // Bust cache to show cropped version immediately 
            alt="Preview" 
            style={{ ...previewImageStyle, cursor: "zoom-in" }} 
            onClick={() => setShowLightbox(true)}
          />
          <div style={{ ...previewOverlayStyle, opacity: isHovered ? 1 : 0, pointerEvents: isHovered ? "auto" : "none" }}>
            <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: "8px" }}>
                <button type="button" onClick={() => setShowLightbox(true)} style={iconBtnOverlayStyle}>
                    <Maximize2 size={14} />
                </button>
                <button type="button" onClick={() => onChange("")} style={iconBtnOverlayStyleRed}>
                    <X size={14} />
                </button>
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} style={actionBtnStyle}>
                <Edit3 size={14} /> Replace Photo
            </button>
          </div>
        </div>
      ) : (
        <div onClick={() => fileInputRef.current?.click()} style={dropZoneStyle}>
          <div style={iconContainerStyle}>
            <UploadCloud size={24} color="var(--accent)" />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "white", fontWeight: 600 }}>Deploy Technical Asset Image</p>
            <p style={{ margin: "4px 0 0", fontSize: "0.7rem", color: "var(--text-muted)" }}>PNG, JPG, WEBP (Maximum 10MB)</p>
          </div>
        </div>
      )}

      <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={onFileSelect} />

      {tempSrc && (
        <ImageEditorModal 
          isOpen={isEditorOpen}
          src={tempSrc}
          isSaving={isUploading}
          onSave={handleEditorSave}
          onCancel={() => { setIsEditorOpen(false); setTempSrc(null); setPendingFile(null); }}
        />
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && value && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={lightboxOverlayStyle} 
              onClick={() => setShowLightbox(false)}
            >
                <div style={lightboxContentStyle}>
                    <button style={lightboxCloseBtnStyle} onClick={() => setShowLightbox(false)}>
                        <X size={28} />
                    </button>
                    
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        style={lightboxFrameStyle}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Loading Spinner for High-Res */}
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 0 }}>
                            <Loader2 size={32} className="animate-spin" color="rgba(255,255,255,0.1)" />
                        </div>

                        <img 
                            src={`${value}${value.includes('?') ? '&' : '?'}v=${Date.now()}`} 
                            alt="View" 
                            style={lightboxImgStyle} 
                            onLoad={(e) => {
                                (e.currentTarget as HTMLImageElement).style.opacity = "1";
                            }}
                        />

                        {/* Top Inner Glow */}
                        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", boxShadow: "inset 0 0 100px rgba(0,0,0,0.5)", borderRadius: "12px" }} />
                    </motion.div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Additional Styles
const iconBtnOverlayStyle: React.CSSProperties = {
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "white",
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease"
};

const iconBtnOverlayStyleRed: React.CSSProperties = {
    ...iconBtnOverlayStyle,
    background: "rgba(255,50,50,0.4)",
    color: "white"
};

const lightboxOverlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(5,5,7,0.94)",
    backdropFilter: "blur(30px)",
    zIndex: 2500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    cursor: "zoom-out"
};

const lightboxContentStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none"
};

const lightboxFrameStyle: React.CSSProperties = {
    position: "relative",
    maxWidth: "92vw",
    maxHeight: "85vh",
    background: "rgba(255,255,255,0.02)",
    padding: "6px", // Thickness of the frame
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 30px 100px rgba(0,0,0,0.8), 0 0 40px var(--accent-glow)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "auto",
    overflow: "hidden"
};

const lightboxImgStyle: React.CSSProperties = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: "12px",
    display: "block",
    opacity: 0,
    transition: "opacity 0.4s ease",
    position: "relative",
    zIndex: 1
};

const lightboxCloseBtnStyle: React.CSSProperties = {
    position: "fixed",
    top: "30px",
    right: "30px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "50%",
    color: "white",
    width: "54px",
    height: "54px",
    cursor: "pointer",
    zIndex: 2501,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "auto",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
};

// Styles
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.65rem",
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  fontWeight: 700
};

const dropZoneStyle: React.CSSProperties = {
  width: "100%",
  height: "120px",
  background: "rgba(255,255,255,0.02)",
  borderRadius: "16px",
  border: "1.5px dashed rgba(255,255,255,0.08)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  gap: "12px",
  transition: "all 0.3s ease"
};

const iconContainerStyle: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  background: "rgba(232, 85, 10, 0.05)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const previewContainerStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "180px",
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.1)"
};

const previewImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};

const previewOverlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  opacity: 0,
  transition: "opacity 0.2s ease"
};

// Add hover effect via CSS is difficult in inline styles, so we'll just allow clicks
// But for visual feedback we'll rely on the parent container's hover if we were using CSS.

const actionBtnStyle: React.CSSProperties = {
  padding: "8px 16px",
  background: "white",
  border: "none",
  borderRadius: "8px",
  color: "black",
  fontSize: "0.75rem",
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const removeBtnStyle: React.CSSProperties = {
  padding: "8px",
  background: "rgba(255,50,50,0.9)",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer"
};
