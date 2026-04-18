import { adminDb } from "@/lib/firebase-admin";
import Link from "next/link";
import { CalendarDays, Camera, MessageSquare, TrendingUp, ArrowRight, Clock, CheckCircle2, AlertCircle, Circle } from "lucide-react";
import type { Event, ContactInquiry } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard | Admin" };

// ─── Stat Card Component ──────────────────────────────────────────────────
function StatCard({
  title, value, subtitle, icon: Icon, accent = false, urgent = false,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  accent?: boolean;
  urgent?: boolean;
}) {
  return (
    <div
      className="card"
      style={{
        borderColor: urgent ? "var(--error)" : accent ? "var(--border-accent)" : "var(--border)",
        boxShadow: accent ? "var(--shadow-accent)" : urgent ? "0 0 20px rgba(239,68,68,0.15)" : "var(--shadow-card)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-2)" }}>
            {title}
          </p>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "2rem", color: accent ? "var(--accent)" : urgent ? "var(--error)" : "var(--text-primary)", lineHeight: 1 }}>
            {value}
          </div>
          {subtitle && (
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
              {subtitle}
            </p>
          )}
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-xl)",
            background: urgent ? "var(--error-bg)" : accent ? "var(--accent-muted)" : "var(--bg-elevated)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} color={urgent ? "var(--error)" : accent ? "var(--accent)" : "var(--text-muted)"} />
        </div>
      </div>
    </div>
  );
}

// ─── Event Status Badge ───────────────────────────────────────────────────
const statusConfig = {
  planned:     { color: "var(--text-muted)",  bg: "var(--bg-elevated)",  icon: Circle,        label: "Planned" },
  confirmed:   { color: "var(--success)",      bg: "var(--success-bg)",   icon: CheckCircle2,  label: "Confirmed" },
  "in-progress": { color: "var(--accent)",     bg: "var(--accent-muted)", icon: Clock,         label: "In Progress" },
  completed:   { color: "var(--gold)",         bg: "var(--gold-muted)",   icon: CheckCircle2,  label: "Completed" },
  cancelled:   { color: "var(--error)",        bg: "var(--error-bg)",     icon: AlertCircle,   label: "Cancelled" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status as keyof typeof statusConfig] || statusConfig.planned;
  const Icon = cfg.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: "var(--radius-full)", background: cfg.bg, color: cfg.color, fontSize: "0.7rem", fontWeight: 600 }}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
}

// ─── Format date ──────────────────────────────────────────────────────────
function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Main Dashboard ───────────────────────────────────────────────────────
export default async function AdminDashboardPage() {
  let totalEvents = 0;
  let totalPhotos = 0;
  let pendingInquiries = 0;
  let upcomingEvents: Event[] = [];
  let recentInquiries: ContactInquiry[] = [];

  try {
    const now = Date.now();
    const [eventsSnap, photosSnap, inquiriesSnap, upcomingSnap] = await Promise.all([
      adminDb.collection("events").count().get(),
      adminDb.collection("gallery").count().get(),
      adminDb.collection("contacts").where("status", "==", "new").get(),
      adminDb.collection("events").where("date", ">=", now).orderBy("date").limit(5).get(),
    ]);
    totalEvents       = eventsSnap.data().count;
    totalPhotos       = photosSnap.data().count;
    pendingInquiries  = inquiriesSnap.size;
    upcomingEvents    = upcomingSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Event[];
    recentInquiries   = inquiriesSnap.docs.slice(0, 3).map((d) => ({ id: d.id, ...d.data() })) as ContactInquiry[];
  } catch {
    // Firebase not yet configured — show empty dashboard
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div>
      {/* Page heading */}
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>
          {greeting}, Admin 👋
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-5)", marginBottom: "var(--space-8)" }}
        className="stat-cards-grid"
      >
        <StatCard title="Total Events"      value={totalEvents}       subtitle="All time"           icon={CalendarDays} accent />
        <StatCard title="Photos Uploaded"   value={totalPhotos}       subtitle="In gallery"         icon={Camera} />
        <StatCard title="Pending Inquiries" value={pendingInquiries}  subtitle="Needs response"     icon={MessageSquare} urgent={pendingInquiries > 0} />
        <StatCard title="This Month"        value="—"                 subtitle="Events booked"      icon={TrendingUp} />
      </div>

      {/* Main Grid: Events table + Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "var(--space-6)" }} className="dashboard-main-grid">
        {/* Upcoming Events */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1rem", margin: 0 }}>Upcoming Events</h3>
            <Link href="/admin/event-management" style={{ fontSize: "0.78rem", color: "var(--accent)", display: "flex", alignItems: "center", gap: 4 }}>
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <div style={{ padding: "var(--space-10)", textAlign: "center", color: "var(--text-muted)" }}>
              <CalendarDays size={28} style={{ opacity: 0.3, marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
              <p style={{ fontSize: "0.85rem" }}>No upcoming events.<br />
                <Link href="/admin/event-management" style={{ color: "var(--accent)", fontSize: "0.82rem" }}>Create your first event →</Link>
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Event", "Client", "Date", "Type", "Status", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.map((event) => (
                    <tr key={event.id} style={{ borderBottom: "1px solid var(--border)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                    >
                      <td style={{ padding: "var(--space-4)", fontWeight: 600, color: "var(--text-primary)", maxWidth: 200 }}>
                        {event.name}
                      </td>
                      <td style={{ padding: "var(--space-4)", color: "var(--text-secondary)" }}>{event.clientName}</td>
                      <td style={{ padding: "var(--space-4)", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{formatDate(event.date)}</td>
                      <td style={{ padding: "var(--space-4)" }}>
                        <span className="badge badge-gold" style={{ textTransform: "capitalize" }}>{event.type}</span>
                      </td>
                      <td style={{ padding: "var(--space-4)" }}>
                        <StatusBadge status={event.status} />
                      </td>
                      <td style={{ padding: "var(--space-4)" }}>
                        <Link href={`/admin/event-management?id=${event.id}`} style={{ fontSize: "0.75rem", color: "var(--accent)" }}>
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions + Recent Inquiries */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          {/* Quick Actions */}
          <div className="card">
            <h3 style={{ fontSize: "0.9rem", marginBottom: "var(--space-4)" }}>Quick Actions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
              {[
                { label: "+ Add Event", href: "/admin/event-management?action=new", accent: true },
                { label: "↑ Upload",    href: "/admin/gallery-manager" },
                { label: "✦ Blog Post", href: "/admin/blog-manager?action=new" },
                { label: "⚙ Settings",  href: "/admin/site-settings" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  style={{
                    display: "block",
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-lg)",
                    border: `1px solid ${action.accent ? "var(--accent)" : "var(--border)"}`,
                    background: action.accent ? "var(--accent-muted)" : "var(--bg-elevated)",
                    color: action.accent ? "var(--accent)" : "var(--text-secondary)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    textAlign: "center",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="card" style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
              <h3 style={{ fontSize: "0.9rem", margin: 0 }}>Recent Inquiries</h3>
              <Link href="/admin/inquiries" style={{ fontSize: "0.72rem", color: "var(--accent)" }}>View all</Link>
            </div>
            {recentInquiries.length === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No new inquiries.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {recentInquiries.map((inq) => (
                  <div key={inq.id} style={{ padding: "var(--space-3)", background: "var(--bg-elevated)", borderRadius: "var(--radius-lg)", borderLeft: "3px solid var(--accent)" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--text-primary)" }}>{inq.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{inq.serviceType} · {inq.phone}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .stat-cards-grid  { grid-template-columns: repeat(4, 1fr) !important; }
        .dashboard-main-grid { grid-template-columns: 1fr 300px !important; }
        @media (max-width: 1100px) {
          .stat-cards-grid  { grid-template-columns: repeat(2, 1fr) !important; }
          .dashboard-main-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 580px) {
          .stat-cards-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
