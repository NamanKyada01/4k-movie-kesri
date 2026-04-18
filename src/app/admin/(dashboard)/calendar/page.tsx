"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enIN } from "date-fns/locale/en-IN";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Event } from "@/types";
import { Loader2 } from "lucide-react";
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
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const snap = await getDocs(collection(db, "events"));
      const data = snap.docs.map(d => {
        const ev = d.data() as Event;
        // Convert timestamp to Date object for the calendar
        const startDate = new Date(ev.date);
        const endDate = new Date(ev.date);
        endDate.setHours(endDate.getHours() + 2); // Default to a 2 hour block

        return {
          id: d.id,
          title: ev.name,
          start: startDate,
          end: endDate,
          status: ev.status,
          type: ev.type,
          client: ev.clientName
        };
      });
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventStyle = (event: any) => {
    let backgroundColor = "var(--bg-elevated)";
    let borderColor = "var(--border)";
    let color = "var(--text-primary)";

    switch (event.status) {
      case "confirmed":
        backgroundColor = "var(--success-bg)";
        color = "var(--success)";
        borderColor = "var(--success)";
        break;
      case "in-progress":
        backgroundColor = "var(--accent-muted)";
        color = "var(--accent)";
        borderColor = "var(--accent)";
        break;
      case "completed":
        backgroundColor = "var(--gold-muted)";
        color = "var(--gold)";
        borderColor = "var(--gold)";
        break;
      case "cancelled":
        backgroundColor = "var(--error-bg)";
        color = "var(--error)";
        borderColor = "var(--error)";
        break;
      default:
        // planned
        backgroundColor = "var(--bg-elevated)";
        color = "var(--text-primary)";
        borderColor = "var(--border)";
        break;
    }

    return {
      style: {
        backgroundColor,
        color,
        border: `1px solid ${borderColor}`,
        borderRadius: "4px",
        fontSize: "0.75rem",
        fontWeight: 600,
        padding: "2px 5px",
      }
    };
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Loader2 className="animate-spin-slow" size={32} color="var(--accent)" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "var(--space-6)" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>Calendar View</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>A global perspective of all booked events and shoots.</p>
      </div>

      <div className="card" style={{ height: "75vh", padding: "var(--space-5)" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          onSelectEvent={(e) => router.push(`/admin/event-management?id=${e.id}`)}
          eventPropGetter={getEventStyle}
          tooltipAccessor={(e) => `${e.title}\nClient: ${e.client}\nType: ${e.type}\nStatus: ${e.status}`}
        />
      </div>

      {/* Global CSS override for react-big-calendar to fit the dark cinematic theme */}
      <style>{`
        .rbc-calendar {
          font-family: var(--font-sans);
          color: var(--text-primary);
        }
        .rbc-header {
          padding: 10px;
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border) !important;
        }
        .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
          border-color: var(--border) !important;
        }
        .rbc-day-bg, .rbc-header {
          border-left: 1px solid var(--border) !important;
        }
        .rbc-month-row, .rbc-time-header-content {
          border-top: 1px solid var(--border) !important;
        }
        .rbc-off-range-bg {
          background: rgba(0,0,0,0.1);
        }
        .rbc-today {
          background: var(--bg-elevated);
        }
        .rbc-event {
          background: transparent;
        }
        .rbc-toolbar button {
          color: var(--text-primary);
          border-color: var(--border);
          background: var(--bg-elevated);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
        }
        .rbc-toolbar button:hover, .rbc-toolbar button:active, .rbc-toolbar button.rbc-active {
          background: var(--accent-muted);
          color: var(--accent);
          border-color: var(--accent);
          box-shadow: none !important;
        }
        .rbc-show-more {
          color: var(--accent);
          font-size: 0.75rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
