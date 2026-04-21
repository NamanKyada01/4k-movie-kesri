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
import CustomDropdown from "@/components/ui/CustomDropdown";
import CreationModal from "@/components/ui/CreationModal";

const statusOptions = [
  { value: "all", label: "All Records" },
  { value: "planned", label: "Planned" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function EventManagementPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Event | null>(null);
  const alerts = useAlerts();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditItem(null);
  };

  const handleEdit = (event: Event) => {
    setEditItem(event);
    setIsModalOpen(true);
  };

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
    const confirmed = await alerts.confirm("This event record will be permanently deleted from the vault.", "Confirm Deletion");
    if (!confirmed) return;
    const res = await deleteEvent(id);
    if (res.success) alerts.cinematic("Event purged from registry", "Registry Purged");
    else alerts.error("Purge failed: " + res.error, "Purge Failed");
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <CalendarDays size={20} color="var(--accent)" />
            <span style={{ color: "var(--accent)", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px" }}>Productions</span>
          </div>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "3.5rem", 
            lineHeight: 1,
            color: "white", 
            margin: 0
          }}>Events</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", letterSpacing: "0.05em", marginTop: "12px" }}>Curate and manage your studio's upcoming production schedule</p>
        </div>
        
        <button 
           onClick={() => setIsModalOpen(true)}
           className="btn btn-primary" 
           style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 32px", fontSize: "0.95rem", fontWeight: 700, borderRadius: "14px" }}
        >
          <Plus size={20} /> Create Event
        </button>
      </div>

      <CreationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        type="event" 
        editData={editItem}
      />

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
        
        <CustomDropdown
            value={activeFilter}
            options={statusOptions}
            onChange={(val) => setActiveFilter(val)}
            width="200px"
        />
      </div>

      {/* Grid */}
      {filteredEvents.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "8rem 0", 
          background: "rgba(255,255,255,0.01)", 
          borderRadius: "32px",
          border: "1px dashed rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <CalendarDays size={48} style={{ color: "rgba(255,255,255,0.1)", marginBottom: "1.5rem" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>No events found in this archive segment.</p>
        </div>
      ) : (
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", 
            gap: "2rem" 
        }}>
          {filteredEvents.map((ev) => (
            <EventCard 
              key={ev.id} 
              event={ev} 
              onEdit={() => handleEdit(ev)}
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
