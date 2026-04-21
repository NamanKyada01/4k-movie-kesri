"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Filter, CalendarDays, Loader2 } from "lucide-react";
import { useLiveCollection } from "@/hooks/useLiveCollection";
import { orderBy, where } from "firebase/firestore";
import { Event } from "@/types";
import { createEvent, deleteEvent, updateEvent } from "@/actions/admin";
import { useAlerts } from "@/lib/alerts";
import { motion, AnimatePresence } from "framer-motion";
import EventCard from "@/components/invoice/EventCard";
import EventQuickViewModal from "@/components/invoice/EventQuickViewModal";

export default function EventManagementPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const alerts = useAlerts();

  // Real-time synchronization
  const { data: events, loading } = useLiveCollection<Event>("events", [
    orderBy("date", "desc")
  ]);

  // Derived state for filtering
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
        const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                             e.clientName.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = activeFilter === "all" || e.status === activeFilter;
        return matchesSearch && matchesFilter;
    });
  }, [events, search, activeFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This event record will be permanently deleted from the vault.")) return;
    const res = await deleteEvent(id);
    if (res.success) alerts.cinematic("Event purged from registry", "Registry Purged");
    else alerts.error("Purge failed: " + res.error, "Purge Failed");
  };

  const handleCreateDummy = async () => {
    // This would typically open a form modal, but for the overhaul demonstration
    // we'll show the cinematic UI first.
    setIsCreating(true);
    const res = await createEvent({
        name: "New Cinematic Production",
        clientName: "Client Identity",
        date: Date.now() + 86400000 * 7,
        type: "wedding",
        status: "planned",
        location: "Surat, Gujarat"
    });
    setIsCreating(false);
    if (!res.success) alerts.error("Deployment failed", "Deployment Failed");
  };

  if (loading) return (
      <div style={{ height: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
          <Loader2 size={40} className="animate-spin" color="var(--accent)" />
          <p style={{ color: "var(--text-muted)", letterSpacing: "0.1em", fontSize: "0.8rem", textTransform: "uppercase" }}>Synchronizing Archive...</p>
      </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.5s ease", paddingBottom: "100px" }}>
      {/* Header section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "2.75rem", 
            color: "white", 
            marginBottom: "0.5rem" 
          }}>Registry</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", letterSpacing: "0.05em" }}>Curate and manage your studio's upcoming production schedule</p>
        </div>
        
        <button 
           onClick={handleCreateDummy}
           disabled={isCreating}
           className="btn btn-primary" 
           style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px" }}
        >
          {isCreating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} New Event
        </button>
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
            placeholder="Search events, clients, or production keys..." 
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
        
        <select 
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            style={{ 
              background: "rgba(255,255,255,0.03)", 
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "0 20px",
              color: "white",
              fontSize: "0.9rem",
              cursor: "pointer",
              outline: "none"
            }}
        >
            <option value="all">All Records</option>
            <option value="planned">Planned</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
        </select>
      </div>

      {/* Grid */}
      {filteredEvents.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "8rem 0", 
          background: "rgba(255,255,255,0.01)", 
          borderRadius: "32px",
          border: "1px dashed rgba(255,255,255,0.05)" 
        }}>
          <CalendarDays size={48} style={{ color: "rgba(255,255,255,0.1)", marginBottom: "1.5rem" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>No events found in this archive segment.</p>
        </div>
      ) : (
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", 
            gap: "2rem" 
        }}>
          {filteredEvents.map((ev) => (
            <EventCard 
              key={ev.id} 
              event={ev} 
              onEdit={() => alerts.info("Opening Editor flow...", "Editor")}
              onQuickView={() => setSelectedEvent(ev)}
              onDelete={() => handleDelete(ev.id)}
            />
          ))}
        </div>
      )}

      {/* Quick View */}
      {selectedEvent && (
        <EventQuickViewModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
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
