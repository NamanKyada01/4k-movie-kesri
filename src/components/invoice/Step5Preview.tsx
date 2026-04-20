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
import InvoiceDocument from "./InvoiceDocument";

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

  const handleSave = async (asNew = false) => {
    if (!user?.uid) return;
    setIsSaving(true);
    
    const dataToSave = { ...invoice, status: "sent" as InvoiceStatus } as any;
    if (asNew) {
      delete dataToSave.id;
      dataToSave.invoiceNumber = `${dataToSave.invoiceNumber}-COPY`;
    }

    const res = await saveInvoice(user.uid, dataToSave);
    if (res.success) {
      toast.success(asNew ? "Duplicated as template" : "Invoice saved successfully");
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
        scale: 2, useCORS: true,
        backgroundColor: invoice.themeDetails?.id === "alabaster" || invoice.themeDetails?.id === "ivory" ? "#fff" : "#0A0A0B"
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
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
      <p style={{ fontSize: "11px", letterSpacing: "0.15rem", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem", fontWeight: 600 }}>Verification</p>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "white", marginBottom: "2.5rem" }}>Review & Finalize</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "2.5rem", alignItems: "start" }}>
        <div style={{ perspective: "1000px" }}>
            <InvoiceDocument invoice={invoice} previewRef={previewRef} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button disabled={isSaving} onClick={() => handleSave(false)} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", gap: "10px", padding: "16px", boxShadow: `0 8px 30px rgba(var(--accent-rgb), 0.3)` }}>
            {isSaving ? "Saving..." : <><Save size={18} /> Finalize & Save</>}
          </button>
          
          <button disabled={isGenerating} onClick={handleDownloadPDF} style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer", transition: "all 0.2s" }}>
            {isGenerating ? "Generating..." : <><Download size={18} /> Download PDF</>}
          </button>

          <button onClick={() => handleSave(true)} style={{ width: "100%", padding: "14px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer" }}>
            <Copy size={18} /> Duplicate as New
          </button>

          <div style={{ marginTop: "20px", padding: "16px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.1)", borderRadius: "12px", display: "flex", gap: "12px" }}>
            <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: "0.75rem", color: "#34d399", margin: 0, lineHeight: 1.4 }}>Ready to publish. All dynamic columns mapped.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
