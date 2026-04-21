import { Calendar, User, MapPin, Link as LinkIcon, Trash2, Edit2, Phone, ExternalLink, Camera } from "lucide-react";
import TiltedCard from "../ui/TiltedCard";
import InvoiceStatusBadge from "./InvoiceStatusBadge"; 

interface EventCardProps {
  event: Event;
  onEdit: () => void;
  onQuickView: () => void;
  onDelete: () => void;
}

export default function EventCard({ event, onEdit, onQuickView, onDelete }: EventCardProps) {
  const dateStr = new Date(event.date).toLocaleDateString("en-IN", { 
    day: 'numeric', month: 'short', year: 'numeric' 
  });

  return (
    <div 
      onClick={onQuickView}
      style={{
        width: "100%",
        background: "rgba(255, 255, 255, 0.025)",
        border: "1.5px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        gap: "20px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative"
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      {/* Left: Indicator & Icon Box */}
      <div style={{ 
        width: "90px", 
        height: "110px", 
        borderRadius: "12px", 
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        flexShrink: 0
      }}>
        {(event.type || '').includes('photo') ? <Camera size={28} color="var(--accent)" /> : <Calendar size={28} color="var(--accent)" opacity={0.6} />}
        <div style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: 800, textAlign: "center", padding: "0 4px" }}>
            {(event.type || 'wedding').replace('-', ' ')}
        </div>
      </div>

      {/* Center: INFO */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ 
                fontSize: "0.65rem", 
                textTransform: "uppercase", 
                letterSpacing: "0.15em", 
                color: "rgba(255,255,255,0.3)", 
                fontWeight: 700 
            }}>
              {dateStr}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: getStatusColor(event.status), boxShadow: `0 0 10px ${getStatusColor(event.status)}` }} />
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "white", textTransform: "uppercase" }}>{event.status}</span>
            </div>
          </div>
          
          <h3 style={{ fontSize: "1.1rem", color: "white", margin: "0 0 4px 0", fontWeight: 800 }}>
            {event.name}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "var(--text-muted)", fontSize: "0.8rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <User size={12} /> {event.clientName}
            </div>
            {event.clientPhone && (
                <a href={`tel:${event.clientPhone}`} onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)", textDecoration: "none" }}>
                    <Phone size={12} /> {event.clientPhone}
                </a>
            )}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px", display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {event.location && (
              <a 
                href={event.locationLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                target="_blank" 
                onClick={e => e.stopPropagation()} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  color: "white", 
                  fontSize: "0.85rem", 
                  textDecoration: "none",
                  background: "rgba(232, 85, 10, 0.1)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(232, 85, 10, 0.2)"
                }}
              >
                <MapPin size={14} color="var(--accent)" /> {event.location.split(',')[0]} <ExternalLink size={12} style={{ opacity: 0.6 }} />
              </a>
          )}
          {event.googleDriveAlbumLink && (
              <a href={event.googleDriveAlbumLink} target="_blank" onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4ade80", fontSize: "0.75rem", fontWeight: 700, textDecoration: "none" }}>
                <LinkIcon size={12} /> View Album
              </a>
          )}
        </div>
      </div>

      {/* Right: ACTIONS Box */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "8px",
          borderLeft: "1px solid rgba(255,255,255,0.05)",
          paddingLeft: "16px",
          justifyContent: "center"
        }}
      >
        <button 
            onClick={onEdit}
            style={{
                width: "40px", height: "40px", borderRadius: "8px",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
        >
            <Edit2 size={18} />
        </button>
        <button 
            onClick={onDelete}
            style={{
                width: "40px", height: "40px", borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.1)",
                color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)"}
        >
            <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
    switch(status) {
        case 'completed': return '#4ade80';
        case 'in-progress': return '#3b82f6';
        case 'confirmed': return '#f59e0b';
        case 'cancelled': return '#ef4444';
        default: return '#94a3b8';
    }
}
