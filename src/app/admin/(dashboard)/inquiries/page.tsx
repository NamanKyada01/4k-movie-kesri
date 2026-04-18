"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Loader2, Trash2, Mail, Phone, CalendarDays } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from "firebase/firestore";
import type { ContactInquiry } from "@/types";
import { toast } from "sonner";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as ContactInquiry[];
      setInquiries(data);
    } catch (err) {
      toast.error("Failed to fetch inquiries.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "contacts", id), { status: newStatus });
      setInquiries(p => p.map(i => i.id === id ? { ...i, status: newStatus as any } : i));
      toast.success("Status updated");
    } catch (error) {
       toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await deleteDoc(doc(db, "contacts", id));
      setInquiries(p => p.filter(i => i.id !== id));
      toast.success("Inquiry deleted");
    } catch (error) {
      toast.error("Failed to delete inquiry");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>Inquiries</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Manage leads coming directly from the contact page.</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <h3 style={{ fontSize: "1rem", margin: 0 }}>All Leads ({inquiries.length})</h3>
        </div>

        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-10)" }}>
            <Loader2 size={32} className="animate-spin-slow" color="var(--text-muted)" />
          </div>
        ) : inquiries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-muted)" }}>
            <MessageSquare size={32} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
            <p>No inquiries yet. When someone submits the contact form, it will appear here.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 1 }}>
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} style={{ background: "var(--bg-primary)", padding: "var(--space-6)", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "250px 1fr 200px", gap: "var(--space-6)", alignItems: "start" }} className="inquiry-row">
                
                {/* Contact Info */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 4 }}>{inquiry.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 4 }}>
                    <Mail size={12} color="var(--text-muted)" />
                    <a href={`mailto:${inquiry.email}`} style={{ color: "var(--accent)" }}>{inquiry.email}</a>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 4 }}>
                    <Phone size={12} color="var(--text-muted)" />
                    {inquiry.phone}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <CalendarDays size={12} color="var(--text-muted)" />
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div style={{ display: "inline-block", fontSize: "0.65rem", padding: "2px 8px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-full)", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-3)" }}>
                    {inquiry.serviceType}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.6, whiteSpace: "pre-wrap", background: "var(--bg-elevated)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                    {inquiry.message}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                  <select 
                    value={inquiry.status}
                    onChange={(e) => handleUpdateStatus(inquiry.id, e.target.value)}
                    style={{ width: "100%", padding: "6px 10px", background: inquiry.status === "new" ? "rgba(232, 85, 10, 0.1)" : "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: inquiry.status === "new" ? "var(--accent)" : "var(--text-primary)", fontSize: "0.8rem", fontWeight: inquiry.status === "new" ? 600 : 400 }}
                  >
                    <option value="new">🆕 New / Unread</option>
                    <option value="read">👀 Read</option>
                    <option value="responded">✅ Responded</option>
                  </select>

                  <button onClick={() => handleDelete(inquiry.id)} style={{ width: "100%", padding: "6px 10px", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--error)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: "0.8rem" }}>
                    <Trash2 size={14} /> Delete Lead
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .inquiry-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
