"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Plus, Loader2, Link as LinkIcon, Trash2, Edit } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from "firebase/firestore";
import type { Event } from "@/types";
import { toast } from "sonner";

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
      setEvents(prev => [{ id: docRef.id, ...(newEvent as Event) }, ...prev]);
      
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
    <div>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>Event Management</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Log client events and manage Google Drive delivery links.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-6)" }} className="manager-layout">
        
        {/* Add Form */}
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-5)", display: "flex", alignItems: "center", gap: 8 }}>
            <Plus size={18} color="var(--accent)" />
            Create New Event
          </h3>
          
          <form onSubmit={handleAddEvent} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)", alignItems: "end" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Event Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} placeholder="e.g. Rahul & Priya Wedding" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Client Name</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} placeholder="e.g. Rahul Patel" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Drive Delivering Link (Optional)</label>
              <input type="url" value={driveLink} onChange={e => setDriveLink(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} placeholder="https://drive.google.com/..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: "11px 16px" }} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={18} className="animate-spin-slow" /> : "Create Event"}
            </button>
          </form>
        </div>

        {/* Events Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <h3 style={{ fontSize: "1rem", margin: 0 }}>All Events ({events.length})</h3>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-10)" }}>
              <Loader2 size={32} className="animate-spin-slow" color="var(--text-muted)" />
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-muted)" }}>
              <CalendarDays size={32} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
              <p>No events logged yet.</p>
            </div>
          ) : (
             <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>Event</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>Client</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>Date</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>Status</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>Deliverable</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "center", color: "var(--text-muted)", fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "var(--space-4)", fontWeight: 600 }}>{event.name}</td>
                      <td style={{ padding: "var(--space-4)", color: "var(--text-secondary)" }}>{event.clientName}</td>
                      <td style={{ padding: "var(--space-4)", color: "var(--text-secondary)" }}>{new Date(event.date).toLocaleDateString()}</td>
                      <td style={{ padding: "var(--space-4)" }}>
                        <select 
                          value={event.status}
                          onChange={(e) => handleUpdateStatus(event.id, e.target.value)}
                          style={{ padding: "4px 8px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: "0.75rem" }}
                        >
                          <option value="planned">Planned</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ padding: "var(--space-4)" }}>
                        {event.googleDriveAlbumLink ? (
                          <a href={event.googleDriveAlbumLink} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--accent)" }}>
                            <LinkIcon size={14} /> Drive Link
                          </a>
                        ) : <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>No Link</span>}
                      </td>
                      <td style={{ padding: "var(--space-4)", textAlign: "center" }}>
                        <button onClick={() => handleDelete(event.id)} style={{ background: "transparent", border: "none", color: "var(--error)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }} title="Delete Event">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
