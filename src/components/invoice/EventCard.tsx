"use client";

import React from "react";
import { Event } from "@/types";
import { Calendar, User, MapPin, Link as LinkIcon, Trash2, Edit2, Maximize2 } from "lucide-react";
import TiltedCard from "../ui/TiltedCard";
import InvoiceStatusBadge from "./InvoiceStatusBadge"; // Reusing for consistent feel

interface EventCardProps {
  event: Event;
  onEdit: () => void;
  onQuickView: () => void;
  onDelete: () => void;
}

export default function EventCard({ event, onEdit, onQuickView, onDelete }: EventCardProps) {
  const dateStr = new Date(event.date).toLocaleDateString("en-IN", { 
    day: 'numeric', month: 'short', year: 'numeric' 
  });

  return (
    <div style={{ width: "100%", borderRadius: "18px", overflow: "hidden" }}>
      <TiltedCard>
        <div 
          onClick={onQuickView}
          style={{
            width: "100%",
            background: "rgba(255, 255, 255, 0.025)",
            border: "1.5px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            gap: "20px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            position: "relative"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
        >
          {/* Left: Indicator & Icon */}
          <div style={{ 
            width: "80px", 
            height: "110px", 
            borderRadius: "10px", 
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            flexShrink: 0
          }}>
            <Calendar size={28} color="var(--accent)" opacity={0.6} />
            <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontWeight: 800 }}>
                {event.type}
            </div>
          </div>

          {/* Center: INFO */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ 
                    fontSize: "0.65rem", 
                    textTransform: "uppercase", 
                    letterSpacing: "0.15em", 
                    color: "rgba(255,255,255,0.3)", 
                    fontWeight: 700 
                }}>
                  {dateStr}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: getStatusColor(event.status), boxShadow: `0 0 10px ${getStatusColor(event.status)}` }} />
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "white", textTransform: "uppercase" }}>{event.status}</span>
                </div>
              </div>
              
              <h3 style={{ fontSize: "1.1rem", color: "white", margin: "0 0 4px 0", fontWeight: 800 }}>
                {event.name}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                <User size={12} /> {event.clientName}
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px", display: "flex", gap: "12px" }}>
              {event.googleDriveAlbumLink && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)", fontSize: "0.75rem", fontWeight: 700 }}>
                    <LinkIcon size={12} /> Drive Active
                  </div>
              )}
              {event.location && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    <MapPin size={12} /> {event.location.split(',')[0]}
                  </div>
              )}
            </div>
          </div>

          {/* Right: ACTIONS */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "8px",
              borderLeft: "1px solid rgba(255,255,255,0.05)",
              paddingLeft: "16px",
              justifyContent: "center"
            }}
          >
            <button 
                onClick={onEdit}
                style={{
                    width: "38px", height: "38px", borderRadius: "8px",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.2s"
                }}
            >
                <Edit2 size={16} />
            </button>
            <button 
                onClick={onDelete}
                style={{
                    width: "38px", height: "38px", borderRadius: "8px",
                    background: "rgba(255,0,0,0.05)", border: "1px solid rgba(255,0,0,0.1)",
                    color: "#ff4444", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.2s"
                }}
            >
                <Trash2 size={16} />
            </button>
          </div>
        </div>
      </TiltedCard>
    </div>
  );
}

function getStatusColor(status: string) {
    switch(status) {
        case 'completed': return '#4ade80';
        case 'in-progress': return '#3b82f6';
        case 'confirmed': return '#f59e0b';
        case 'cancelled': return '#ef4444';
        default: return '#94a3b8';
    }
}
