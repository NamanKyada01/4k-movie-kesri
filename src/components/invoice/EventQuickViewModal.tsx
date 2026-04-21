"use client";

import React from "react";
import { Event } from "@/types";
import { X, Calendar, User, MapPin, Link as LinkIcon, Info, Phone, Mail, Clock } from "lucide-react";

interface QuickViewProps {
  event: Event;
  onClose: () => void;
}

export default function EventQuickViewModal({ event, onClose }: QuickViewProps) {
  const dateStr = new Date(event.date).toLocaleDateString("en-IN", { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  });

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.92)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      animation: "modalFadeIn 0.3s ease"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "800px",
        background: "#0A0A0B",
        borderRadius: "24px",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 40px 100px rgba(0,0,0,0.8)"
      }}>
        {/* Banner */}
        <div style={{ height: "120px", background: "linear-gradient(135deg, #1a1a1b, #000)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "flex-end", padding: "30px" }}>
            <div>
                <h2 style={{ fontSize: "1.75rem", fontFamily: "'Playfair Display', serif", color: "white", margin: 0, fontWeight: 900 }}>
                    {event.name}
                </h2>
                <div style={{ color: "var(--accent)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, marginTop: "4px" }}>
                    {(event.type || 'Event').replace('-', ' ')}
                </div>
            </div>
        </div>

        {/* Content */}
        <div style={{ padding: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
            {/* Left: Schedule & Client */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <section>
                    <h4 style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px", letterSpacing: "0.1em" }}>Schedule Details</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "white" }}>
                            <Calendar size={16} color="var(--accent)" /> {dateStr}
                        </div>
                        {event.time && (
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "white" }}>
                                <Clock size={16} color="var(--accent)" /> {event.time} (Duration: {event.duration})
                            </div>
                        )}
                        {event.location && (
                             <a 
                                href={event.locationLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} 
                                target="_blank"
                                rel="noreferrer"
                                style={{ display: "flex", alignItems: "center", gap: "12px", color: "white", textDecoration: "none", cursor: "pointer" }}
                             >
                                <MapPin size={16} color="var(--accent)" /> 
                                <span style={{ borderBottom: "1px dashed rgba(255,255,255,0.3)", paddingBottom: "2px" }}>{event.location}</span>
                             </a>
                        )}
                    </div>
                </section>

                <section>
                    <h4 style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px", letterSpacing: "0.1em" }}>Client Identity</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "white" }}>
                            <User size={16} color="var(--accent)" /> {event.clientName}
                        </div>
                        {event.clientPhone && (
                             <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "white" }}>
                                <Phone size={16} color="var(--accent)" /> {event.clientPhone}
                             </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Right: Status & Tech */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                 <section>
                    <h4 style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px", letterSpacing: "0.1em" }}>Workflow Status</h4>
                    <div style={{ padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "white", textTransform: "capitalize", display: "flex", alignItems: "center", gap: "10px" }}>
                             <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }} />
                             {event.status}
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "8px", lineHeight: 1.5 }}>
                            The event is currently marked as **{event.status}**. All delivery links and staff assignments are synced.
                        </p>
                    </div>
                 </section>

                 <section>
                    <h4 style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px", letterSpacing: "0.1em" }}>Google Drive Album</h4>
                    {event.googleDriveAlbumLink ? (
                         <a 
                            href={event.googleDriveAlbumLink} 
                            target="_blank" 
                            rel="noreferrer"
                            style={{ 
                                display: "flex", alignItems: "center", gap: "12px", 
                                background: "var(--accent)", color: "black", 
                                padding: "12px 20px", borderRadius: "10px", 
                                textDecoration: "none", fontWeight: 800, fontSize: "0.85rem",
                                textAlign: "center", justifyContent: "center"
                            }}
                         >
                            <LinkIcon size={16} /> Access Drive Album
                         </a>
                    ) : (
                        <div style={{ padding: "12px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "10px", color: "rgba(255,255,255,0.3)", textAlign: "center", fontSize: "0.8rem" }}>
                            No Album Link Attached
                        </div>
                    )}
                 </section>
            </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 40px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "flex-end" }}>
            <button 
                onClick={onClose}
                style={{ padding: "10px 24px", background: "transparent", color: "var(--text-muted)", border: "none", cursor: "pointer", fontWeight: 600 }}
            >
                Close Record
            </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
