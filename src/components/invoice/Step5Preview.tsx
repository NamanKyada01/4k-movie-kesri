"use client";

import React, { useRef, useState } from "react";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import { saveInvoice } from "@/actions/invoice";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Download, Save, Copy, CheckCircle2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";

interface Step5Props {
  invoice: Partial<Invoice>;
  update: (patch: Partial<Invoice>) => void;
  mode: "create" | "edit";
}

export default function Step5Preview({ invoice, update, mode }: Step5Props) {
  const { user } = useAuth();
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const primaryColor = invoice.themeDetails?.primaryColor || "#C9A96E";
  const visibleColumns = (invoice.columns || []).filter(c => c.visible);

  const handleSave = async (asNew = false) => {
    if (!user?.uid) return;
    setIsSaving(true);
    
    const dataToSave = {
      ...invoice,
      status: "sent" as InvoiceStatus,
    } as any;

    if (asNew) {
      delete dataToSave.id;
      dataToSave.invoiceNumber = `${dataToSave.invoiceNumber}-COPY`;
    }

    const res = await saveInvoice(user.uid, dataToSave);
    
    if (res.success) {
      toast.success(asNew ? "Duplicated as new template" : "Invoice saved successfully");
      localStorage.removeItem("invoix_draft");
      router.push("/admin/invoices");
    } else {
      toast.error("Failed to save: " + res.error);
    }
    setIsSaving(false);
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: invoice.themeDetails?.id === "alabaster" || invoice.themeDetails?.id === "ivory" ? "#fff" : "#0A0A0B"
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoice.invoiceNumber || "invoice"}.pdf`);
      toast.success("PDF Generated");
    } catch (err) {
      console.error(err);
      toast.error("PDF generation failed");
    }
    setIsGenerating(false);
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <p style={{ 
        fontSize: "11px", 
        letterSpacing: "0.15rem", 
        textTransform: "uppercase", 
        color: "var(--accent)",
        marginBottom: "1rem",
        fontWeight: 600
      }}>Verification</p>
      <h3 style={{ 
        fontFamily: "'Playfair Display', serif", 
        fontSize: "2rem", 
        color: "white", 
        marginBottom: "2.5rem" 
      }}>Review & Finalize</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "2.5rem", alignItems: "start" }}>
        
        {/* Virtual A4 Render */}
        <div style={{ perspective: "1000px" }}>
          <div 
            ref={previewRef}
            style={{ 
              width: "100%",
              aspectRatio: "1/1.414",
              background: invoice.themeDetails?.id === "obsidian" || invoice.themeDetails?.id === "cobalt" || invoice.themeDetails?.id === "graphite" ? "#0A0A0B" : "#FAF9F7",
              color: invoice.themeDetails?.id === "obsidian" || invoice.themeDetails?.id === "cobalt" || invoice.themeDetails?.id === "graphite" ? "#F5F0E8" : "#111",
              borderRadius: "4px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              overflow: "hidden",
              fontFamily: "'Playfair Display', serif",
              position: "relative",
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
                       {invoice.businessDetails?.brandName[0]}
                     </div>
                   )}
                   <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>{invoice.businessDetails?.brandName}</h2>
                   <p style={{ fontSize: "0.75rem", opacity: 0.7, marginTop: "4px", maxWidth: "200px", lineHeight: 1.5 }}>
                     {invoice.businessDetails?.brandAddress}
                   </p>
                </div>
                <div style={{ textAlign: "right" }}>
                   <h1 style={{ fontSize: "2.5rem", fontWeight: 900, margin: 0, opacity: 0.1, position: "absolute", right: 40, top: 20 }}>INVOICE</h1>
                   <div style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>{invoice.invoiceNumber}</div>
                   <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>Date: {new Date(invoice.date || 0).toLocaleDateString()}</div>
                   <div style={{ fontSize: "0.7rem", color: primaryColor, fontWeight: 700, marginTop: "4px" }}>Due: {new Date(invoice.dueDate || 0).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Bill To */}
              <div style={{ 
                marginBottom: "32px", padding: "20px", background: `${primaryColor}11`, borderRadius: "8px", borderLeft: `3px solid ${primaryColor}` 
              }}>
                <div style={{ fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: primaryColor, marginBottom: "8px", fontWeight: 700 }}>Bill To</div>
                <div style={{ fontSize: "1rem", fontWeight: 700 }}>{invoice.customerName || "Customer Name"}</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.7, marginTop: "4px" }}>{invoice.customerEmail}</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>{invoice.customerAddress}</div>
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
                    <tr key={i} style={{ borderBottom: "1px solid rgba(128,128,128,0.1)" }}>
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

              <div style={{ position: "absolute", bottom: "40px", left: "40px", right: "40px", textAlign: "center", opacity: 0.4, fontSize: "0.6rem", borderTop: "1px solid rgba(128,128,128,0.1)", paddingTop: "16px" }}>
                Thank you for your business. Generated via Invoix Premium.
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button 
            disabled={isSaving}
            onClick={() => handleSave(false)}
            className="btn btn-primary"
            style={{ 
              width: "100%", justifyContent: "center", gap: "10px", padding: "16px",
              boxShadow: `0 8px 30px rgba(var(--accent-rgb), 0.3)` 
            }}
          >
            {isSaving ? "Saving..." : <><Save size={18} /> Finalize & Save</>}
          </button>
          
          <button 
            disabled={isGenerating}
            onClick={handleDownloadPDF}
            style={{
              width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer", transition: "all 0.2s"
            }}
          >
            {isGenerating ? "Generating..." : <><Download size={18} /> Download PDF</>}
          </button>

          <button 
            onClick={() => handleSave(true)}
            style={{
              width: "100%", padding: "14px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "var(--text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer"
            }}
          >
            <Copy size={18} /> Duplicate as New
          </button>

          <div style={{ 
            marginTop: "20px", padding: "16px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.1)", borderRadius: "12px", display: "flex", gap: "12px"
          }}>
            <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: "0.75rem", color: "#34d399", margin: 0, lineHeight: 1.4 }}>
              Ready to publish. All dynamic columns mapped.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
