"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, LayoutDashboard, Image, PlayCircle, Calendar as CalendarIcon, Wrench, Users, FileText, Edit3, Settings, MessageSquare, Star, UserCog, LogOut, Sun, Moon, ChevronRight, Bell, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect as useEffectReact } from "react";
import { ReactNode } from "react";
import Particles from "@/components/ui/Particles";

const navItems = [
  { label: "Dashboard",           href: "/admin/dashboard",           icon: LayoutDashboard },
  { label: "Gallery Manager",     href: "/admin/gallery-manager",     icon: Image },
  { label: "YouTube Manager",     href: "/admin/youtube-manager",     icon: PlayCircle },
  { label: "Event Management",    href: "/admin/event-management",    icon: CalendarIcon },
  { label: "Calendar View",       href: "/admin/calendar",            icon: CalendarIcon },
  { label: "Equipment",           href: "/admin/equipment",           icon: Wrench },
  { label: "Staff Management",    href: "/admin/staff",               icon: Users },
  { label: "Blog Manager",        href: "/admin/blog-manager",        icon: FileText },
  { label: "Content Editor",      href: "/admin/content-editor",      icon: Edit3 },

  { label: "Site Settings",       href: "/admin/site-settings",       icon: Settings },
  { label: "Inquiries",           href: "/admin/inquiries",           icon: MessageSquare },
  { label: "Testimonials",        href: "/admin/testimonials",        icon: Star },
  { label: "Admin Users",         href: "/admin/admin-users",         icon: UserCog },
];

function ThemeToggleAdmin() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffectReact(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 8, borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", width: "100%", transition: "color var(--transition-fast)" }}
      onMouseEnter={(e) => { (e.currentTarget).style.color = "var(--text-primary)"; }}
      onMouseLeave={(e) => { (e.currentTarget).style.color = "var(--text-muted)"; }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, adminData, loading, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Close sidebar on route change
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--accent)", animation: "spin 1s linear infinite", marginInline: "auto", marginBottom: 16 }} />
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading admin panel...</p>
        </div>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100svh", background: "var(--bg-primary)", position: "relative" }}>
      {/* Subtle Admin Particles */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.3 }}>
        <Particles
          particleCount={50}
          particleColors={["var(--accent)", "var(--text-muted)"]}
          moveSpeed={0.2}
          sizeRange={[0.5, 2]}
          alphaRange={[0.05, 0.15]}
        />
      </div>
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, backdropFilter: "blur(4px)" }}
          className="admin-sidebar-overlay"
        />
      )}
      <aside
        style={{
          width: "var(--sidebar-width)",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          background: "var(--bg-primary)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          zIndex: 101,
          overflowY: "auto",
          overflowX: "hidden",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          backdropFilter: "blur(20px)",
        }}
        className="admin-sidebar"
      >
        {/* Brand */}
        <div style={{ padding: "var(--space-5) var(--space-5) var(--space-4)", borderBottom: "1px solid var(--border)" }}>
          <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", border: "2px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Camera size={15} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.8rem", color: "var(--text-primary)", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                4K MOVIE KESRI
              </div>
              <div style={{ fontSize: "0.575rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Admin Panel
              </div>
            </div>
          </Link>
        </div>

        {/* Admin Profile */}
        <div style={{ padding: "var(--space-4) var(--space-5)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent-muted)", border: "2px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--accent)", fontSize: "0.85rem" }}>
              {(adminData?.name?.[0] || user.email?.[0] || "A").toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {adminData?.name || "Admin"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <span className="badge badge-accent" style={{ fontSize: "0.58rem", padding: "2px 6px" }}>
                  {adminData?.role || "admin"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "var(--space-3) var(--space-5)" }}>
          <Link
            href="/admin/event-management?action=new"
            className="btn btn-primary btn-sm"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <Plus size={14} /> New Event
          </Link>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "var(--space-1) var(--space-3) var(--space-4)" }}>
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "0.55rem var(--space-3)",
                  borderRadius: "var(--radius-lg)",
                  marginBottom: 2,
                  fontSize: "0.82rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--accent)" : "var(--text-muted)",
                  background: isActive ? "var(--accent-muted)" : "transparent",
                  transition: "all var(--transition-fast)",
                  textDecoration: "none",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget;
                    el.style.color = "var(--text-primary)";
                    el.style.background = "var(--bg-elevated)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget;
                    el.style.color = "var(--text-muted)";
                    el.style.background = "transparent";
                  }
                }}
              >
                <Icon size={15} />
                {label}
                {isActive && (
                  <ChevronRight size={13} style={{ marginLeft: "auto", opacity: 0.6 }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: "var(--space-3) var(--space-4)", borderTop: "1px solid var(--border)" }}>
          <ThemeToggleAdmin />
          <button
            onClick={handleLogout}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "8px var(--space-2)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", width: "100%", transition: "color var(--transition-fast)" }}
            onMouseEnter={(e) => {
              (e.currentTarget).style.color = "var(--error)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget).style.color = "var(--text-muted)";
            }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div 
        style={{ 
          marginLeft: 0, 
          paddingLeft: "var(--sidebar-width)", // This will be overriden in mobile styles
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          minHeight: "100svh",
          position: "relative",
          zIndex: 1
        }} 
        className="admin-main-wrapper"
      >
        {/* Top bar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 90,
            background: "rgba(var(--bg-primary-rgb, 13, 13, 13), 0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border)",
            padding: "0 var(--space-4) 0 clamp(1rem, 4vw, 2rem)",
            height: "var(--topbar-height)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
          }}
        >
          {/* Mobile Menu Toggle */}
          <button 
             onClick={() => setSidebarOpen(true)}
             style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)", padding: 8, display: "none" }}
             className="admin-mobile-toggle"
          >
             <Edit3 size={20} />
          </button>

          {/* Page breadcrumb — rendered by each page as <h1> */}
          <div id="admin-topbar-title" />

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginLeft: "auto" }}>
            {/* Bell */}
            <button
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)", position: "relative" }}
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: "var(--accent)", fontSize: "0.58rem", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
                3
              </span>
            </button>

            {/* Public site link */}
            <Link
              href="/"
              target="_blank"
              style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}
            >
              View Site ↗
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "clamp(1rem, 4vw, 2rem)" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 1025px) {
          .admin-sidebar { transform: translateX(0) !important; }
          .admin-sidebar-overlay { display: none !important; }
        }
        @media (max-width: 1024px) {
          .admin-main-wrapper { padding-left: 0 !important; }
          .admin-mobile-toggle { display: flex !important; }
        }
        .w-full { width: 100%; }
      `}</style>
    </div>
  );
}
