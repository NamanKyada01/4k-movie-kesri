"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLiveCollection } from "@/hooks/useLiveCollection";
import { where, orderBy } from "firebase/firestore";
import { Invoice } from "@/types/invoice";
import { deleteInvoice } from "@/actions/invoice";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InvoiceCard from "./InvoiceCard";
import QuickViewModal from "./QuickViewModal";

export default function InvoiceDashboard() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  // Real-time synchronization
  // Note: Using userId filter for security parity with the creation logic
  const { data: invoices, loading } = useLiveCollection<Invoice>("invoices", 
    user?.uid ? [where("userId", "==", user.uid), orderBy("createdAt", "desc")] : []
  );

  const handleDownloadPDF = async (inv: Invoice) => {
    setIsGenerating(true);
    try {
      toast.info("Generating cinematic PDF...");
      router.push(`/admin/invoices/edit/${inv.id}?step=5`);
    } catch (err) {
      toast.error("PDF generation failed");
    }
    setIsGenerating(false);
  };

  const handleDelete = async (id: string) => {
     if (!confirm("Permanently purge this statement from the archive?")) return;
     const res = await deleteInvoice(id);
     if (res.success) toast.success("Invoice purged");
     else toast.error("Action failed");
  };

  const filtered = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.customerName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ height: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
        <Loader2 size={40} className="animate-spin" color="var(--accent)" />
        <p style={{ color: "var(--text-muted)", letterSpacing: "0.1em", fontSize: "0.8rem", textTransform: "uppercase" }}>Synchronizing Statement Vault...</p>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.5s ease", paddingBottom: "100px" }}>
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "2.75rem", 
            color: "white", 
            marginBottom: "0.5rem" 
          }}>Vault</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", letterSpacing: "0.05em" }}>Your curated collection of premium statements</p>
        </div>
        
        <Link href="/admin/invoices/create" style={{ textDecoration: "none" }}>
          <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px" }}>
            <Plus size={18} /> New Invoice
          </button>
        </Link>
      </div>

      {/* Toolbar */}
      <div style={{ 
        display: "flex", 
        gap: "1.25rem", 
        marginBottom: "3rem",
        padding: "1.25rem",
        background: "rgba(255,255,255,0.02)",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
          <input 
            placeholder="Search invoice number or client identity..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: "100%", 
              background: "rgba(255,255,255,0.03)", 
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "16px 16px 16px 48px",
              color: "white",
              fontSize: "0.9rem",
              outline: "none"
            }} 
          />
        </div>
        <button style={{ 
          background: "rgba(255,255,255,0.03)", 
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          padding: "0 20px",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: "0.9rem",
          fontWeight: 600,
          cursor: "pointer"
        }}>
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "8rem 0", 
          background: "rgba(255,255,255,0.01)", 
          borderRadius: "32px",
          border: "1px dashed rgba(255,255,255,0.05)" 
        }}>
          <FileText size={48} style={{ color: "rgba(255,255,255,0.1)", marginBottom: "1.5rem" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Your vault is currently empty.</p>
        </div>
      ) : (
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", 
            gap: "2rem" 
        }}>
          {filtered.map((inv) => (
            <InvoiceCard 
              key={inv.id} 
              invoice={inv} 
              onEdit={() => router.push(`/admin/invoices/edit/${inv.id}`)}
              onQuickView={() => setSelectedInvoice(inv)}
              onDelete={() => handleDelete(inv.id)}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {selectedInvoice && (
        <QuickViewModal 
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onDownload={() => handleDownloadPDF(selectedInvoice)}
        />
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
