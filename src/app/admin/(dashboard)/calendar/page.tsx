"use client";

import { useState, useCallback, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enIN } from "date-fns/locale/en-IN";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useLiveCollection } from "@/hooks/useLiveCollection";
import type { Event } from "@/types";
import { Loader2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useRouter } from "next/navigation";

// Setup date-fns localizer for the react-big-calendar
const locales = {
  "en-IN": enIN,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarViewPage() {
  const router = useRouter();
  
  // REAL-TIME DATA SYNC
  const { data: rawEvents, loading: isLoading } = useLiveCollection<Event>("events");

  // CONTROLLED CALENDAR STATE
  const [view, setView] = useState<any>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  // TRANSFORM DATA FOR CALENDAR
  const events = useMemo(() => {
    return rawEvents.map((ev) => {
      const startDate = new Date(ev.date);
      const endDate = new Date(ev.date);
      // Default to a 1.5 hour block for cinematic events
      endDate.setMinutes(endDate.getMinutes() + 90); 

      return {
        id: ev.id,
        title: ev.name,
        start: startDate,
        end: endDate,
        status: ev.status,
        type: ev.type,
        client: ev.clientName,
        price: ev.totalPrice
      };
    });
  }, [rawEvents]);

  // COLOR MAPPING (Matches Cinematic Design System)
  const getEventStyle = useCallback((event: any) => {
    let backgroundColor = "rgba(255, 255, 255, 0.03)";
    let borderColor = "rgba(255, 255, 255, 0.1)";
    let color = "var(--text-primary)";
    let glow = "none";

    switch (event.status) {
      case "confirmed":
        backgroundColor = "rgba(16, 185, 129, 0.15)";
        borderColor = "rgba(16, 185, 129, 0.5)";
        color = "#34d399";
        break;
      case "in-progress":
        backgroundColor = "rgba(14, 165, 233, 0.15)";
        borderColor = "rgba(14, 165, 233, 0.5)";
        color = "#38bdf8";
        break;
      case "completed":
        backgroundColor = "rgba(245, 158, 11, 0.15)";
        borderColor = "rgba(245, 158, 11, 0.5)";
        color = "#fbbf24";
        break;
      case "cancelled":
        backgroundColor = "rgba(239, 68, 68, 0.15)";
        borderColor = "rgba(239, 68, 68, 0.5)";
        color = "#f87171";
        break;
      default:
        // planned
        backgroundColor = "rgba(255, 255, 255, 0.05)";
        color = "var(--text-muted)";
        break;
    }

    return {
      style: {
        backgroundColor,
        color,
        border: `1px solid ${borderColor}`,
        borderRadius: "6px",
        fontSize: "0.72rem",
        fontWeight: 600,
        padding: "4px 8px",
        boxShadow: glow !== "none" ? `0 0 10px ${glow}` : "none",
        transition: "all 0.2s ease"
      }
    };
  }, []);

  // HANDLERS
  const onNavigate = useCallback((newDate: Date) => setDate(newDate), []);
  const onView = useCallback((newView: any) => setView(newView), []);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Loader2 className="animate-spin-slow" size={32} color="var(--accent)" />
      </div>
    );
  }

  return (
    <div className="calendar-vault" style={{ animation: "fadeIn 0.6s ease-out" }}>
      {/* HEADER SECTION */}
      <div style={{ marginBottom: "var(--space-8)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "var(--space-2)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(232, 85, 10, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
              <CalendarIcon size={20} />
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.03em" }}>The <span style={{ color: "var(--accent)" }}>Timeline</span></h1>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: "500px" }}>
            Real-time orbital view of all studio bookings, cinematic shoots, and production milestones.
          </p>
        </div>

        {/* LEGEND */}
        <div style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-3) var(--space-4)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", fontSize: "0.7rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399" }}></span> Confirmed</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#38bdf8" }}></span> In-Progress</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24" }}></span> Completed</div>
        </div>
      </div>

      {/* CALENDAR CONTAINER */}
      <div 
        className="glass-card" 
        style={{ 
          height: "calc(100vh - 280px)", 
          padding: "var(--space-6)",
          borderRadius: "var(--radius-3xl)",
          background: "linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(15, 15, 15, 0.9) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          date={date}
          onView={onView}
          onNavigate={onNavigate}
          onSelectEvent={(e) => router.push(`/admin/event-management?id=${e.id}`)}
          eventPropGetter={getEventStyle}
          tooltipAccessor={(e) => `${e.title}\nClient: ${e.client}\nType: ${e.type}\nStatus: ${e.status}`}
          className="onyx-calendar"
        />
      </div>

      {/* STYLES */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .onyx-calendar {
          font-family: var(--font-sans);
          color: var(--text-primary);
          background: transparent;
        }

        /* Toolbar Customization */
        .rbc-toolbar {
          margin-bottom: var(--space-6) !important;
          padding-bottom: var(--space-6);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .rbc-toolbar-label {
          font-size: 1.25rem !important;
          font-weight: 800 !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-primary);
        }
        .rbc-toolbar button {
          color: var(--text-secondary);
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          background: rgba(255, 255, 255, 0.03) !important;
          padding: 8px 16px !important;
          border-radius: 10px !important;
          font-size: 0.8rem !important;
          font-weight: 600 !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          text-transform: capitalize;
        }
        .rbc-toolbar button:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: var(--text-primary) !important;
          transform: translateY(-1px);
        }
        .rbc-toolbar button.rbc-active {
          background: var(--accent) !important;
          color: white !important;
          border-color: var(--accent) !important;
          box-shadow: 0 4px 15px rgba(232, 85, 10, 0.3) !important;
        }

        /* Month View Grid */
        .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
          border: none !important;
          background: transparent;
        }
        .rbc-header {
          padding: 15px !important;
          text-transform: uppercase;
          font-size: 0.65rem !important;
          letter-spacing: 0.1em;
          color: var(--text-muted) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          background: transparent !important;
        }
        .rbc-day-bg + .rbc-day-bg, .rbc-header + .rbc-header {
          border-left: 1px solid rgba(255, 255, 255, 0.03) !important;
        }
        .rbc-month-row + .rbc-month-row {
          border-top: 1px solid rgba(255, 255, 255, 0.03) !important;
        }
        .rbc-off-range-bg {
          background: rgba(0, 0, 0, 0.2) !important;
        }
        .rbc-today {
          background: rgba(232, 85, 10, 0.03) !important;
        }
        .rbc-now.rbc-header {
           color: var(--accent) !important;
           font-weight: 800 !important;
        }

        /* Events */
        .rbc-event {
          margin-bottom: 3px !important;
          border: none !important;
          filter: saturate(1.2);
        }
        .rbc-event:hover {
          filter: brightness(1.2);
          transform: scale(1.02);
          z-index: 10;
        }
        .rbc-show-more {
          background: transparent !important;
          color: var(--accent) !important;
          font-weight: 700 !important;
          font-size: 0.7rem !important;
          margin-top: 4px;
        }

        /* Custom Scrollbar for Agenda/Time views */
        .rbc-time-content::-webkit-scrollbar { width: 6px; }
        .rbc-time-content::-webkit-scrollbar-thumb { background: var(--border); borderRadius: 10px; }
      `}</style>
    </div>
  );
}
