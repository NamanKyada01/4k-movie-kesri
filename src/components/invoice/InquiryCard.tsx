"use client";

import React from "react";
import { ContactInquiry } from "@/types";
import { Mail, Phone, Calendar, Trash2, CheckCircle, Eye, MessageSquare } from "lucide-react";
import TiltedCard from "../ui/TiltedCard";

interface InquiryCardProps {
  inquiry: ContactInquiry;
  onUpdateStatus: (status: string) => void;
  onDelete: () => void;
}

export default function InquiryCard({ inquiry, onUpdateStatus, onDelete }: InquiryCardProps) {
  const isNew = inquiry.status === "new";
  const dateStr = new Date(inquiry.createdAt).toLocaleString("en-IN", { 
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" 
  });

  return (
    <div style={{ width: "100%", borderRadius: "18px", overflow: "hidden" }}>
      <TiltedCard>
        <div style={{
          width: "100%",
          background: isNew ? "rgba(232, 85, 10, 0.05)" : "rgba(255, 255, 255, 0.025)",
          border: isNew ? "1.5px solid rgba(232, 85, 10, 0.2)" : "1.5px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          transition: "all 0.3s ease"
        }}>
          {/* Top: Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
                <div style={{ 
                    fontSize: "0.65rem", 
                    textTransform: "uppercase", 
                    letterSpacing: "0.15em", 
                    color: isNew ? "var(--accent)" : "rgba(255,255,255,0.4)", 
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                  {isNew && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }} />}
                  {inquiry.serviceType} Inquiry
                </div>
                <h3 style={{ fontSize: "1.25rem", color: "white", fontWeight: 800, margin: "8px 0 0 0" }}>
                    {inquiry.name}
                </h3>
            </div>
            
            <div style={{ display: "flex", gap: "8px" }}>
                 <select 
                    value={inquiry.status}
                    onChange={(e) => onUpdateStatus(e.target.value)}
                    style={{ 
                        background: "rgba(255,255,255,0.03)", 
                        border: "1px solid rgba(255,255,255,0.1)", 
                        borderRadius: "8px", padding: "6px 12px", 
                        color: "white", fontSize: "0.75rem", fontWeight: 700 
                    }}
                 >
                    <option value="new">Unread</option>
                    <option value="read">Read</option>
                    <option value="responded">Responded</option>
                 </select>
                 <button 
                  onClick={onDelete}
                  style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(255,0,0,0.05)", border: "1px solid rgba(255,0,0,0.1)", color: "#ff4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                    <Trash2 size={14} />
                </button>
            </div>
          </div>

          {/* Message Segment */}
          <div style={{ 
              background: "rgba(0,0,0,0.2)", 
              padding: "16px", 
              borderRadius: "12px", 
              border: "1px solid rgba(255,255,255,0.03)",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.6,
              fontStyle: "italic"
          }}>
            "{inquiry.message}"
          </div>

          {/* Bottom Actions/Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    <Mail size={12} color="var(--accent)" /> {inquiry.email}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    <Phone size={12} color="var(--accent)" /> {inquiry.phone}
                </div>
          </div>
          
          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.15)", fontWeight: 700, textTransform: "uppercase", textAlign: "right" }}>
            Received: {dateStr}
          </div>
        </div>
      </TiltedCard>
    </div>
  );
}
