"use client";

import React from "react";
import { Invoice } from "@/types/invoice";

interface InvoiceDocumentProps {
  invoice: Partial<Invoice>;
  previewRef?: React.RefObject<HTMLDivElement>;
  scale?: number;
}

export default function InvoiceDocument({ invoice, previewRef, scale = 1 }: InvoiceDocumentProps) {
  const primaryColor = invoice.themeDetails?.primaryColor || "#C9A96E";
  const visibleColumns = (invoice.columns || []).filter(c => c.visible);

  return (
    <div 
      ref={previewRef}
      style={{ 
        width: "100%",
        aspectRatio: "1/1.414",
        background: invoice.themeDetails?.id === "obsidian" || invoice.themeDetails?.id === "cobalt" || invoice.themeDetails?.id === "graphite" ? "#0A0A0B" : "#FAF9F7",
        color: invoice.themeDetails?.id === "obsidian" || invoice.themeDetails?.id === "cobalt" || invoice.themeDetails?.id === "graphite" ? "#F5F0E8" : "#111",
        borderRadius: "4px",
        border: "1px solid rgba(128,128,128,0.1)",
        overflow: "hidden",
        fontFamily: "'Playfair Display', serif",
        position: "relative",
        transform: scale !== 1 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
      }}
    >
      <div style={{ background: primaryColor, height: "8px", width: "100%" }} />
      
      <div style={{ padding: "40px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
             {invoice.businessDetails?.showLogo && (
               <div style={{ 
                  width: "48px", height: "48px", background: primaryColor, borderRadius: "8px", 
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", fontSize: "20px", color: "black", fontWeight: 900 
               }}>
                 {invoice.businessDetails?.brandName?.[0] || "B"}
               </div>
             )}
             <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>{invoice.businessDetails?.brandName || "Business Identity"}</h2>
             <p style={{ fontSize: "0.75rem", opacity: 0.7, marginTop: "4px", maxWidth: "200px", lineHeight: 1.5 }}>
               {invoice.businessDetails?.brandAddress || "Select or create profile in Step 3"}
             </p>
          </div>
          <div style={{ textAlign: "right" }}>
             <h1 style={{ fontSize: "2.5rem", fontWeight: 900, margin: 0, opacity: 0.1, position: "absolute", right: 40, top: 20 }}>INVOICE</h1>
             <div style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>{invoice.invoiceNumber || "INV-XXXX"}</div>
             <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>Date: {new Date(invoice.date || Date.now()).toLocaleDateString()}</div>
             <div style={{ fontSize: "0.7rem", color: primaryColor, fontWeight: 700, marginTop: "4px" }}>Due: {new Date(invoice.dueDate || Date.now()).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Bill To */}
        <div style={{ 
          marginBottom: "32px", padding: "20px", background: `${primaryColor}11`, borderRadius: "8px", borderLeft: `3px solid ${primaryColor}` 
        }}>
          <div style={{ fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: primaryColor, marginBottom: "8px", fontWeight: 700 }}>Bill To</div>
          <div style={{ fontSize: "1rem", fontWeight: 700 }}>{invoice.customerName || "Customer Name"}</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.7, marginTop: "4px" }}>{invoice.customerEmail || "customer@example.com"}</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>{invoice.customerAddress || "Billing Address"}</div>
        </div>

        {/* Dynamic Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${primaryColor}` }}>
              {visibleColumns.map((col, idx) => (
                <th 
                  key={col.id}
                  style={{ 
                    textAlign: idx === 0 ? "left" : "right", 
                    padding: "12px 0", 
                    fontSize: "10px", 
                    textTransform: "uppercase", 
                    color: primaryColor,
                    letterSpacing: "0.05em",
                    paddingLeft: idx === 0 ? "0" : "12px",
                    paddingRight: idx === visibleColumns.length - 1 ? "0" : "12px"
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item, i) => (
              <tr key={item.id || i} style={{ borderBottom: "1px solid rgba(128,128,128,0.1)" }}>
                {visibleColumns.map((col, idx) => (
                  <td 
                    key={col.id} 
                    style={{ 
                      padding: "14px 0", 
                      textAlign: idx === 0 ? "left" : "right",
                      paddingLeft: idx === 0 ? "0" : "12px",
                      paddingRight: idx === visibleColumns.length - 1 ? "0" : "12px",
                      fontWeight: (idx === 0 || col.id === "amount") ? 700 : 400,
                      opacity: (idx === 0 || col.id === "amount") ? 1 : 0.7
                    }}
                  >
                    {(col.id === "amount" || col.id === "rate") 
                      ? `₹${(item[col.id] || 0).toLocaleString("en-IN")}` 
                      : (item[col.id] || "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "200px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "8px" }}>
              <span style={{ opacity: 0.6 }}>Subtotal</span>
              <span>₹{(invoice.subtotal || 0).toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid rgba(128,128,128,0.2)" }}>
              <span style={{ opacity: 0.6 }}>GST ({invoice.taxRate}%)</span>
              <span>₹{(invoice.taxAmount || 0).toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 800 }}>Total</span>
              <span style={{ fontSize: "1.2rem", fontWeight: 900, color: primaryColor }}>₹{(invoice.total || 0).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "40px", left: "40px", right: "40px", textAlign: "center", opacity: 0.3, fontSize: "0.6rem", borderTop: "1px solid rgba(128,128,128,0.1)", paddingTop: "16px" }}>
          Thank you for your business. Generated via Invoix Premium.
        </div>
      </div>
    </div>
  );
}
