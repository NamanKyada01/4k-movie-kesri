"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Filter, MoreVertical, Edit2, Copy, Trash2, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getInvoices, deleteInvoice } from "@/actions/invoice";
import { Invoice } from "@/types/invoice";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import DashboardSkeleton from "./DashboardSkeleton";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InvoiceDashboard() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user?.uid) {
      loadInvoices();
    }
  }, [user]);

  async function loadInvoices() {
    setLoading(true);
    const res = await getInvoices(user!.uid);
    if (res.success && res.invoices) {
      setInvoices(res.invoices);
    } else {
      toast.error("Failed to load invoices");
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this invoice?")) {
      const res = await deleteInvoice(id);
      if (res.success) {
        toast.success("Invoice deleted");
        loadInvoices();
      } else {
        toast.error("Delete failed");
      }
    }
  }

  const filtered = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.customerName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <DashboardSkeleton />;

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem" }}>
        <div>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "2.5rem", 
            color: "var(--text-primary)", 
            marginBottom: "0.5rem" 
          }}>Invoices</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Manage your professional bills and templates</p>
        </div>
        
        <Link href="/admin/invoices/create" style={{ textDecoration: "none" }}>
          <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Plus size={18} /> New Invoice
          </button>
        </Link>
      </div>

      {/* Toolbar */}
      <div style={{ 
        display: "flex", 
        gap: "1rem", 
        marginBottom: "2rem",
        padding: "1rem",
        background: "rgba(255,255,255,0.02)",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input 
            placeholder="Search by invoice # or client..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: "100%", 
              background: "rgba(255,255,255,0.03)", 
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "10px 10px 10px 38px",
              color: "white",
              fontSize: "0.85rem",
              outline: "none"
            }} 
          />
        </div>
        <button style={{ 
          background: "rgba(255,255,255,0.03)", 
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px",
          padding: "0 15px",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: "0.85rem",
          cursor: "pointer"
        }}>
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "5rem 0", 
          background: "rgba(255,255,255,0.01)", 
          borderRadius: "16px",
          border: "1px dashed rgba(255,255,255,0.05)" 
        }}>
          <FileText size={48} style={{ color: "rgba(255,255,255,0.1)", marginBottom: "1rem" }} />
          <p style={{ color: "var(--text-muted)" }}>No invoices found. Create your first one!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {filtered.map((inv) => (
            <div 
              key={inv.id}
              className="invoice-card"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "24px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                position: "relative"
              }}
              onClick={() => router.push(`/admin/invoices/edit/${inv.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <InvoiceStatusBadge status={inv.status} />
                <button 
                  onClick={(e) => { e.stopPropagation(); /* show menu */ }}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {inv.invoiceNumber}
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "white" }}>
                  {inv.customerName}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "2px" }}>Amount Due</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--accent)" }}>
                    ₹{inv.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "2px" }}>Due Date</div>
                  <div style={{ fontSize: "0.85rem", color: "white" }}>
                    {new Date(inv.dueDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function FileText({ size, style }: { size: number, style?: React.CSSProperties }) {
  return (
    <svg 
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}
