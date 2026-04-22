"use client";

import React from "react";
import { Staff } from "@/types";
import { User, Phone, Mail, Award, Trash2, Edit2 } from "lucide-react";
import TiltedCard from "../ui/TiltedCard";

interface StaffCardProps {
  staff: Staff;
  onEdit: () => void;
  onDelete: () => void;
  onImageClick: (url: string) => void;
}

export default function StaffCard({ staff, onEdit, onDelete, onImageClick }: StaffCardProps) {
  return (
    <div 
      style={{
        width: "100%",
        background: "rgba(255, 255, 255, 0.025)",
        border: "1.5px solid rgba(255,255,255,0.06)",
        borderRadius: "20px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        transition: "all 0.3s ease",
        cursor: "default"
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      {/* Top: Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div 
          onClick={() => staff.profilePhoto && onImageClick(staff.profilePhoto)}
          style={{ 
            width: "60px", height: "60px", 
            borderRadius: "50%", 
            background: "var(--accent)", 
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "black", boxShadow: "0 0 20px rgba(232, 85, 10, 0.2)",
            cursor: staff.profilePhoto ? "zoom-in" : "default",
            overflow: "hidden"
        }}>
          {staff.profilePhoto ? (
              <img src={staff.profilePhoto} alt={staff.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
          ) : <User size={28} />}
        </div>
        
        <div style={{ display: "flex", gap: "8px" }}>
            <button 
              onClick={onEdit}
              style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
                <Edit2 size={14} />
            </button>
            <button 
              onClick={onDelete}
              style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(255,0,0,0.05)", border: "1px solid rgba(255,0,0,0.1)", color: "#ff4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
                <Trash2 size={14} />
            </button>
        </div>
      </div>

      {/* Info */}
      <div>
        <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent)", fontWeight: 800, marginBottom: "4px" }}>
            {staff.position}
        </div>
        <h3 style={{ fontSize: "1.25rem", color: "white", fontWeight: 800, margin: 0 }}>
            {staff.name}
        </h3>
      </div>

      {/* Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-muted)", fontSize: "0.8rem" }}>
            <Phone size={14} /> {staff.phone}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-muted)", fontSize: "0.8rem" }}>
            <Mail size={14} /> {staff.email}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
            {(staff.skills || []).slice(0, 3).map(skill => (
                <span key={skill} style={{ fontSize: "0.6rem", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", padding: "4px 10px", borderRadius: "20px", fontWeight: 600, border: "1px solid rgba(255,255,255,0.05)" }}>
                    {skill}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
}
