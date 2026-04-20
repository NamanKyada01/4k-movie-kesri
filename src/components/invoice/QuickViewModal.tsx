"use client";

import React from "react";
import { Invoice } from "@/types/invoice";
import { X, Download, FileText } from "lucide-react";
import InvoiceDocument from "./InvoiceDocument";

interface QuickViewProps {
  invoice: Invoice;
  onClose: () => void;
  onDownload: () => void;
}

export default function QuickViewModal({ invoice, onClose, onDownload }: QuickViewProps) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.92)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px",
      animation: "modalFadeIn 0.3s ease"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "900px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <FileText size={24} color="var(--accent)" />
            <div>
              <h2 style={{ fontSize: "1.5rem", fontFamily: "'Playfair Display', serif", color: "white", margin: 0 }}>
                {invoice.invoiceNumber}
              </h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>Reviewing Draft for {invoice.customerName}</p>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <button 
              onClick={onDownload}
              className="btn btn-primary"
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px" }}
            >
              <Download size={18} /> Download PDF
            </button>
            <button 
              onClick={onClose}
              style={{ padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", cursor: "pointer" }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scaled Preview Area */}
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: "20px", 
          background: "rgba(255,255,255,0.02)", 
          borderRadius: "20px", 
          border: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          justifyContent: "center"
        }}>
            <div style={{ width: "100%", maxWidth: "600px" }}>
                <InvoiceDocument invoice={invoice} />
            </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
