"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Plus, Loader2, Link as LinkIcon, Trash2, Edit, ChevronRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from "firebase/firestore";
import type { Event } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export default function EventManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("wedding");
  const [status, setStatus] = useState("planned");
  const [driveLink, setDriveLink] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const q = query(collection(db, "events"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Event[];
      setEvents(data);
    } catch (err) {
      toast.error("Failed to fetch events.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientName || !date) return toast.error("Please fill required fields.");

    setIsSubmitting(true);
    try {
      const timestamp = new Date(date).getTime();
      
      const newEvent: Partial<Event> = {
        name,
        clientName,
        type: type as any,
        status: status as any,
        date: timestamp,
        googleDriveAlbumLink: driveLink,
        createdAt: Date.now(),
        clientPhone: "",
        clientEmail: "",
        time: "",
        reachTime: "",
        location: "",
        duration: "",
        description: "",
        budget: 0,
        teamLeadId: "",
        staffIds: [],
        equipmentIds: [],
        paymentStatus: "pending",
        reminderSent: false,
        updatedAt: Date.now()
      };

      const docRef = await addDoc(collection(db, "events"), newEvent);
      setEvents(prev => [{ ...newEvent, id: docRef.id } as Event, ...prev]);
      
      toast.success("Event created successfully!");
      setName("");
      setClientName("");
      setDate("");
      setDriveLink("");
      
    } catch (error: any) {
      toast.error("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "events", id));
      setEvents(p => p.filter(e => e.id !== id));
      toast.success("Event deleted");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "events", id), { status: newStatus, updatedAt: Date.now() });
      setEvents(p => p.map(e => e.id === id ? { ...e, status: newStatus as any } : e));
      toast.success("Status updated");
    } catch (error) {
       toast.error("Failed to update status");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 4, fontWeight: 800 }}>Event Management</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Log client events and manage Google Drive delivery links.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-6)" }} className="manager-layout">
        
        {/* Add Form */}
        <SpotlightCard className="card" style={{ marginBottom: "var(--space-2)", padding: "var(--space-6)" }} spotlightColor="rgba(232, 85, 10, 0.05)">
          <h3 style={{ fontSize: "1.1rem", marginBottom: "var(--space-6)", display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
            <Plus size={18} color="var(--accent)" />
            Create New Event
          </h3>
          
          <form onSubmit={handleAddEvent} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-5)", alignItems: "end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Event Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", color: "var(--text-primary)", fontSize: "0.85rem" }} placeholder="e.g. Rahul & Priya Wedding" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Client Name</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} required style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", color: "var(--text-primary)", fontSize: "0.85rem" }} placeholder="e.g. Rahul Patel" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", color: "var(--text-primary)", fontSize: "0.85rem" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Drive Link (Optional)</label>
              <input type="url" value={driveLink} onChange={e => setDriveLink(e.target.value)} style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", color: "var(--text-primary)", fontSize: "0.85rem" }} placeholder="https://drive.google.com/..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: 46, fontWeight: 700 }} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Deploy Event"}
            </button>
          </form>
        </SpotlightCard>

        {/* Events Table Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card" 
          style={{ padding: 0, overflow: "hidden", border: "1px solid var(--border)" }}
        >
          <div style={{ padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.01)" }}>
             <h3 style={{ fontSize: "1.1rem", margin: 0, fontWeight: 700 }}>Event Registry ({events.length})</h3>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 16 }}>
              <Loader2 size={32} className="animate-spin" color="var(--accent)" />
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Retrieving archives...</p>
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
              <CalendarDays size={48} style={{ margin: "0 auto 16px", opacity: 0.1 }} />
              <p style={{ fontSize: "1rem" }}>No events found in the ledger.</p>
            </div>
          ) : (
             <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ textAlign: "left", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Event Name</th>
                    <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Partner / Client</th>
                    <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Scheduled Date</th>
                    <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                    <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Deliverable</th>
                    <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <AnimatePresence mode="popLayout">
                  <tbody>
                    {events.map((event, idx) => (
                      <motion.tr 
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                        style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s ease" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <td style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-primary)" }}>{event.name}</td>
                        <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>{event.clientName}</td>
                        <td style={{ padding: "16px 24px", color: "var(--text-muted)" }}>{new Date(event.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td style={{ padding: "16px 24px" }}>
                          <select 
                            value={event.status}
                            onChange={(e) => handleUpdateStatus(event.id, e.target.value)}
                            style={{ padding: "6px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            <option value="planned">Planned</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={{ padding: "16px 24px" }}>
                          {event.googleDriveAlbumLink ? (
                            <a href={event.googleDriveAlbumLink} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--accent)", textDecoration: "none", fontWeight: 600, fontSize: "0.8rem" }}>
                              <LinkIcon size={14} /> Drive Access
                            </a>
                          ) : <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontStyle: "italic" }}>Pending Upload</span>}
                        </td>
                        <td style={{ padding: "16px 24px", textAlign: "center" }}>
                          <button 
                            onClick={() => handleDelete(event.id)} 
                            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--error)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                            title="Delete Event"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </AnimatePresence>
              </table>
            </div>
          )}
        </motion.div>

      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}
