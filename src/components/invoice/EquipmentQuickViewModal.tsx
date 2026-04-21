"use client";

import React from "react";
import { Equipment } from "@/types";
import { HardDrive, AlertCircle, ShieldCheck, Box, Tag } from "lucide-react";

interface EquipmentQuickViewProps {
  item: Equipment;
  onClose: () => void;
}

export default function EquipmentQuickViewModal({ item, onClose }: EquipmentQuickViewProps) {
  const isAvailable = item.condition === 'available';

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.92)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      animation: "modalFadeIn 0.3s ease"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "600px",
        background: "#0A0A0B",
        borderRadius: "24px",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 40px 100px rgba(0,0,0,0.8)"
      }}>
        {/* Banner */}
        <div style={{ 
            height: "180px", 
            background: item.imageUrl ? `url(${item.imageUrl}) center/cover no-repeat` : "linear-gradient(135deg, #1a1a1b, #000)", 
            borderBottom: "1px solid rgba(255,255,255,0.05)", 
            display: "flex", 
            alignItems: "flex-end", 
            padding: "30px",
            position: "relative"
        }}>
            {item.imageUrl && (
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)" }} />
            )}
            <div style={{ position: "relative", zIndex: 1 }}>
                <h2 style={{ fontSize: "1.75rem", fontFamily: "'Playfair Display', serif", color: "white", margin: 0, fontWeight: 900 }}>
                    {item.name}
                </h2>
                <div style={{ color: "var(--accent)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, marginTop: "4px" }}>
                    {item.category.replace('-', ' ')}
                </div>
            </div>
        </div>

        {/* Content */}
        <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "30px" }}>
             <section>
                <h4 style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px", letterSpacing: "0.1em" }}>Asset Status</h4>
                <div style={{ padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 900, color: isAvailable ? "#4ade80" : "#fbbf24", textTransform: "capitalize", display: "flex", alignItems: "center", gap: "10px" }}>
                         {isAvailable ? <ShieldCheck /> : <AlertCircle />}
                         {item.condition.replace('-', ' ')}
                    </div>
                </div>
             </section>

             <section>
                <h4 style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px", letterSpacing: "0.1em" }}>Specifications</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "white" }}>
                        <Tag size={16} color="var(--accent)" /> 
                        <div>
                            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Serial Number</div>
                            <div style={{ fontWeight: 700 }}>{item.serialNumber || "N/A"}</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "white" }}>
                        <Box size={16} color="var(--accent)" /> 
                        <div>
                            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Quantity</div>
                            <div style={{ fontWeight: 700 }}>{item.quantity} Units</div>
                        </div>
                    </div>
                </div>
             </section>
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 40px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "flex-end" }}>
            <button 
                onClick={onClose}
                style={{ padding: "10px 24px", background: "transparent", color: "var(--text-muted)", border: "none", cursor: "pointer", fontWeight: 600 }}
            >
                Close View
            </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
