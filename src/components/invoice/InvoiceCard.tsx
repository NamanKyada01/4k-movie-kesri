"use client";

import React from "react";
import { Invoice } from "@/types/invoice";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import InvoiceDocument from "./InvoiceDocument";
import BorderGlow from "../ui/BorderGlow";
import TiltedCard from "../ui/TiltedCard";
import { Maximize2, MoreVertical, Calendar, User, IndianRupee, Edit2, Trash2 } from "lucide-react";

interface InvoiceCardProps {
  invoice: Invoice;
  onEdit: () => void;
  onQuickView: () => void;
  onDelete: () => void;
}

export default function InvoiceCard({ invoice, onEdit, onQuickView, onDelete }: InvoiceCardProps) {
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
          {/* Left Side: PREVIEW */}
          <div 
            style={{ 
              width: "120px", 
              height: "170px", 
              borderRadius: "10px", 
              overflow: "hidden", 
              position: "relative",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
              flexShrink: 0,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ transform: "scale(0.3)", transformOrigin: "top left", width: "333%" }}>
              <InvoiceDocument invoice={invoice} />
            </div>
            
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.2s",
              color: "white"
            }} className="preview-overlay">
              <Maximize2 size={16} opacity={0.6} />
            </div>
          </div>

          {/* Center: METADATA */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ marginBottom: "12px" }}>
                <InvoiceStatusBadge status={invoice.status} />
              </div>
              
              <h4 style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent)", margin: "0 0 4px 0", fontWeight: 800 }}>
                {invoice.invoiceNumber}
              </h4>
              <h3 style={{ fontSize: "1.05rem", color: "white", margin: 0, fontWeight: 700, lineHeight: 1.2 }}>
                {invoice.customerName}
              </h3>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.65rem", marginBottom: "2px" }}>
                  <IndianRupee size={10} /> Amount
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "white" }}>
                  ₹{invoice.total.toLocaleString("en-IN")}
                </div>
            </div>
          </div>

          {/* Right Side: ACTIONS */}
          <div 
            onClick={(e) => e.stopPropagation()} // Prevent modal from opening when clicking actions
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "10px",
              borderLeft: "1px solid rgba(255,255,255,0.05)",
              paddingLeft: "16px",
              justifyContent: "center"
            }}
          >
            <button 
                onClick={onEdit}
                style={{
                    width: "42px", height: "42px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
                <Edit2 size={18} />
            </button>

            <button 
                onClick={onDelete}
                style={{
                    width: "42px", height: "42px", borderRadius: "10px",
                    background: "rgba(255,0,0,0.05)", border: "1px solid rgba(255,0,0,0.1)",
                    color: "#ff4444", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,0,0,0.15)"; e.currentTarget.style.borderColor = "#ff4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,0,0,0.05)"; e.currentTarget.style.borderColor = "rgba(255,0,0,0.1)"; }}
            >
                <Trash2 size={18} />
            </button>
          </div>
        </div>
    </TiltedCard>

    <style jsx>{`
      div:hover .preview-overlay {
        opacity: 1;
      }
    `}</style>
    </div>
  );
}
