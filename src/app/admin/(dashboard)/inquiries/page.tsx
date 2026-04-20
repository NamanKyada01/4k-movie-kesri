"use client";

import React, { useState, useMemo } from "react";
import { Search, Loader2, MessageSquare } from "lucide-react";
import { useLiveCollection } from "@/hooks/useLiveCollection";
import { orderBy } from "firebase/firestore";
import { ContactInquiry } from "@/types";
import { deleteInquiry, updateInquiry } from "@/actions/admin";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import InquiryCard from "@/components/invoice/InquiryCard";

export default function InquiriesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Real-time synchronization
  const { data: leads, loading } = useLiveCollection<ContactInquiry>("contacts", [
    orderBy("createdAt", "desc")
  ]);

  const filteredLeads = useMemo(() => {
    return leads.filter(i => {
        const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || 
                             i.email.toLowerCase().includes(search.toLowerCase()) ||
                             i.message.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || i.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const handleUpdateStatus = async (id: string, status: string) => {
    const res = await updateInquiry(id, { status });
    if (res.success) toast.success("Lead status updated");
    else toast.error("Action failed");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this production lead?")) return;
    const res = await deleteInquiry(id);
    if (res.success) toast.success("Lead purged from vault");
    else toast.error("Action failed");
  };

  if (loading) return (
      <div style={{ height: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
          <Loader2 size={40} className="animate-spin" color="var(--accent)" />
          <p style={{ color: "var(--text-muted)", letterSpacing: "0.1em", fontSize: "0.8rem", textTransform: "uppercase" }}>Synchronizing Leads...</p>
      </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.5s ease", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.75rem", color: "white", marginBottom: "0.5rem" }}>The Feed</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", letterSpacing: "0.05em" }}>Manage incoming production inquiries and potential studio leads</p>
      </div>

      {/* Toolbar */}
      <div style={{ 
        display: "flex", gap: "1.25rem", marginBottom: "3rem",
        padding: "1rem", background: "rgba(255,255,255,0.015)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)" }} />
          <input 
            placeholder="Search leads, metadata, or messages..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", background: "transparent", border: "none", padding: "12px 12px 12px 44px", color: "white", outline: "none" }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
            {["all", "new", "read", "responded"].map(status => (
                <button 
                    key={status} onClick={() => setStatusFilter(status)}
                    style={{ 
                        background: statusFilter === status ? "rgba(255,255,255,0.1)" : "transparent",
                        border: "none", color: statusFilter === status ? "white" : "var(--text-muted)",
                        padding: "6px 16px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer"
                    }}
                >
                    {status}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      {filteredLeads.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 0", color: "var(--text-muted)" }}>
          <MessageSquare size={48} opacity={0.1} style={{ margin: "0 auto 20px" }} />
          <p>No inquiries discovered in this archive segment.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2.5rem" }}>
          <AnimatePresence>
            {filteredLeads.map((inquiry) => (
                <InquiryCard 
                    key={inquiry.id} 
                    inquiry={inquiry} 
                    onUpdateStatus={(s) => handleUpdateStatus(inquiry.id, s)}
                    onDelete={() => handleDelete(inquiry.id)}
                />
            ))}
          </AnimatePresence>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
