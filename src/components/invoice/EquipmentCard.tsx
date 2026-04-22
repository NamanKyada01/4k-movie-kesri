"use client";

import React from "react";
import { Equipment } from "@/types";
import { Camera, Box, Settings, HardDrive, Trash2, Edit2, ShieldCheck, AlertCircle } from "lucide-react";
import TiltedCard from "../ui/TiltedCard";

interface EquipmentCardProps {
  item: Equipment;
  onEdit: () => void;
  onDelete: () => void;
  onQuickView: () => void;
  onImageClick: (url: string) => void;
}

export default function EquipmentCard({ item, onEdit, onDelete, onQuickView, onImageClick }: EquipmentCardProps) {
  const isAvailable = item.condition === 'available';

  return (
    <div 
      style={{ 
        width: "100%", 
        background: "rgba(255, 255, 255, 0.025)",
        border: "1.5px solid rgba(255,255,255,0.06)",
        borderRadius: "18px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        transition: "all 0.3s ease",
        cursor: "pointer"
      }}
      onClick={onQuickView}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div 
          onClick={(e) => { 
            if (item.imageUrl) {
              e.stopPropagation();
              onImageClick(item.imageUrl);
            }
          }}
          style={{ 
            width: "50px", height: "50px", 
            borderRadius: "12px", 
            background: "rgba(255,255,255,0.03)", 
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--accent)",
            cursor: item.imageUrl ? "zoom-in" : "default"
          }}
        >
          {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
          ) : (
              <Camera size={24} />
          )}
        </div>
        
        <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Edit2 size={14} /></button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(255,0,0,0.05)", border: "1px solid rgba(255,0,0,0.1)", color: "#ff4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Trash2 size={14} /></button>
        </div>
      </div>

      {/* Info */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: 700 }}>
                {item.category}
            </span>
            <div style={{ 
                display: "flex", alignItems: "center", gap: "6px", 
                color: isAvailable ? "#4ade80" : "#fbbf24", 
                fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase" 
            }}>
                {isAvailable ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
                {item.condition}
            </div>
        </div>
        <h3 style={{ fontSize: "1.1rem", color: "white", fontWeight: 800, margin: 0 }}>
            {item.name}
        </h3>
      </div>

      {/* Specs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Quantity</span>
            <span style={{ fontSize: "0.85rem", color: "white", fontWeight: 700 }}>x{item.quantity} Units</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Serial</span>
            <span style={{ fontSize: "0.85rem", color: "white", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>{item.serialNumber || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}
