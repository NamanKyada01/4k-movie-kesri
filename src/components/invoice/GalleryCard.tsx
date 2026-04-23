"use client";

import React from "react";
import { GalleryPhoto } from "@/types";
import { Trash2, Edit2, Maximize2, Star } from "lucide-react";
import TiltedCard from "../ui/TiltedCard";

interface GalleryCardProps {
  photo: GalleryPhoto;
  onEdit: () => void;
  onDelete: () => void;
}

export default function GalleryCard({ photo, onEdit, onDelete }: GalleryCardProps) {
  return (
    <div style={{ width: "100%", borderRadius: "14px", overflow: "hidden" }}>
      <TiltedCard>
        <div style={{ 
            position: "relative", 
            aspectRatio: "1/1", 
            borderRadius: "14px", 
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.05)",
            background: "#000"
        }}>
          <img 
            src={photo.cloudinaryUrl} 
            alt={photo.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Featured Badge */}
          {photo.featured && (
              <div style={{ 
                position: "absolute", top: 12, left: 12, 
                background: "var(--accent)", color: "black", 
                padding: "4px 8px", borderRadius: "6px", 
                fontSize: "0.6rem", fontWeight: 800, 
                display: "flex", alignItems: "center", gap: "4px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
              }}>
                <Star size={10} fill="currentColor" /> FEATURED
              </div>
          )}

          {/* Action Overlay */}
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            padding: "16px",
            background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end"
          }}>
            <div>
                <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--accent)", fontWeight: 800, letterSpacing: "0.05em" }}>
                    {photo.category}
                </div>
                <h4 style={{ fontSize: "0.85rem", color: "white", margin: "2px 0 0 0", fontWeight: 700, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {photo.title || "Untitled Photo"}
                </h4>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
                <button 
                  onClick={onEdit}
                  style={{ 
                    width: "32px", height: "32px", borderRadius: "8px", 
                    background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", 
                    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", backdropFilter: "blur(4px)"
                  }}
                >
                    <Edit2 size={14} />
                </button>
                <button 
                  onClick={onDelete}
                  style={{ 
                    width: "32px", height: "32px", borderRadius: "8px", 
                    background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.1)", 
                    color: "#ff4444", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", backdropFilter: "blur(4px)"
                  }}
                >
                    <Trash2 size={14} />
                </button>
            </div>
          </div>
        </div>
      </TiltedCard>
    </div>
  );
}
