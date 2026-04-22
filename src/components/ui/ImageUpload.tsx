"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Loader2, X, Edit3, Image as ImageIcon } from "lucide-react";
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
        <div style={previewContainerStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" style={previewImageStyle} />
          <div style={previewOverlayStyle}>
            <button type="button" onClick={() => fileInputRef.current?.click()} style={actionBtnStyle}>
                <Edit3 size={14} /> Refine Asset
            </button>
            <button type="button" onClick={() => onChange("")} style={removeBtnStyle}>
                <X size={14} />
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
    </div>
  );
}

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
