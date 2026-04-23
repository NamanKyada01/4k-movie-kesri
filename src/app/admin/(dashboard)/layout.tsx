"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, LayoutDashboard, Image, PlayCircle, Calendar as CalendarIcon, Wrench, Users, FileText, Edit3, Settings, MessageSquare, Star, UserCog, LogOut, Sun, Moon, ChevronRight, Bell, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import Particles from "@/components/ui/Particles";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard",           href: "/admin/dashboard",           icon: LayoutDashboard },
  { label: "Events",              href: "/admin/event-management",    icon: CalendarIcon },
  { label: "Inventory",           href: "/admin/equipment",           icon: Wrench },
  { label: "Personnel",           href: "/admin/staff",               icon: Users },
  { label: "Gallery Manager",     href: "/admin/gallery-manager",     icon: Image },
  { label: "YouTube Manager",     href: "/admin/youtube-manager",     icon: PlayCircle },
  { label: "Calendar",           href: "/admin/calendar",            icon: LayoutDashboard },
  { label: "Blog Manager",        href: "/admin/blog-manager",        icon: FileText },
  { label: "Content Editor",      href: "/admin/content-editor",      icon: Edit3 },
  { label: "Invoices",            href: "/admin/invoices",            icon: FileText },
  { label: "Testimonials",        href: "/admin/testimonials",        icon: Star },
  { label: "Inquiries",           href: "/admin/inquiries",           icon: MessageSquare },
  { label: "Site Settings",       href: "/admin/site-settings",       icon: Settings },
  { label: "Admin Users",         href: "/admin/admin-users",         icon: UserCog },
];


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
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, backdropFilter: "blur(8px)" }}
            className="admin-sidebar-overlay"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
          backdropFilter: "blur(20px)",
          boxShadow: "var(--shadow-lg)",
        }}
        className="admin-sidebar"
        role="navigation"
        aria-label="Admin navigation"
      >
        {/* Brand */}
        <div style={{ 
          padding: "var(--space-5) var(--space-5) var(--space-4)", 
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-primary)"
        }}>
          <Link 
            href="/admin/dashboard" 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 10, 
              textDecoration: "none",
              transition: "transform var(--transition-fast)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <motion.div 
              whileHover={{ rotate: 15 }}
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: "50%", 
                border: "2px solid var(--accent)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                flexShrink: 0,
                background: "var(--accent-muted)"
              }}
            >
              <Camera size={18} color="var(--accent)" />
            </motion.div>
            <div>
              <div style={{ 
                fontFamily: "var(--font-heading)", 
                fontWeight: 800, 
                fontSize: "0.85rem", 
                color: "var(--text-primary)", 
                letterSpacing: "-0.01em", 
                lineHeight: 1.1 
              }}>
                4K MOVIE KESRI
              </div>
              <div style={{ 
                fontSize: "0.6rem", 
                color: "var(--accent)", 
                letterSpacing: "0.12em", 
                textTransform: "uppercase",
                fontWeight: 600,
                marginTop: 2
              }}>
                Command Center
              </div>
            </div>
          </Link>
        </div>

        {/* Admin Profile */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ 
            padding: "var(--space-4) var(--space-5)", 
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-card)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              style={{ 
                width: 42, 
                height: 42, 
                borderRadius: "50%", 
                background: "var(--accent-muted)", 
                border: "2px solid var(--accent)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                flexShrink: 0, 
                fontFamily: "var(--font-heading)", 
                fontWeight: 700, 
                color: "var(--accent)", 
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
              onClick={() => router.push("/admin/admin-users")}
              aria-label="View admin profile"
            >
              {(adminData?.name?.[0] || user.email?.[0] || "A").toUpperCase()}
            </motion.div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{ 
                fontSize: "0.85rem", 
                fontWeight: 600, 
                color: "var(--text-primary)", 
                whiteSpace: "nowrap", 
                overflow: "hidden", 
                textOverflow: "ellipsis" 
              }}>
                {adminData?.name || "Admin"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <span className="badge badge-accent" style={{ 
                  fontSize: "0.6rem", 
                  padding: "2px 8px",
                  fontWeight: 700,
                  letterSpacing: "0.05em"
                }}>
                  {adminData?.role || "admin"}
                </span>
                <span style={{ 
                  fontSize: "0.6rem", 
                  color: "var(--text-muted)",
                  fontWeight: 500
                }}>
                  ID: {user.uid?.slice(0, 6)}...
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          style={{ padding: "var(--space-4) var(--space-5)" }}
        >
          <Link
            href="/admin/event-management?action=new"
            className="btn btn-primary btn-sm"
            style={{ 
              width: "100%", 
              justifyContent: "center",
              fontWeight: 600,
              letterSpacing: "0.02em",
              boxShadow: "0 4px 12px var(--accent-glow)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px var(--accent-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px var(--accent-glow)";
            }}
          >
            <Plus size={16} /> New Production
          </Link>
        </motion.div>

        {/* Nav items */}
        <nav style={{ 
          flex: 1, 
          padding: "var(--space-3) var(--space-3) var(--space-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-1)"
        }}>
          {navItems.map(({ label, href, icon: Icon }, index) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Link
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    padding: "0.65rem var(--space-4)",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "0.85rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--accent)" : "var(--text-muted)",
                    background: isActive ? "var(--accent-muted)" : "transparent",
                    transition: "all var(--transition-fast)",
                    textDecoration: "none",
                    position: "relative",
                    border: isActive ? "1px solid var(--border-accent)" : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      const el = e.currentTarget;
                      el.style.color = "var(--text-primary)";
                      el.style.background = "var(--bg-elevated)";
                      el.style.borderColor = "var(--border)";
                      el.style.transform = "translateX(4px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      const el = e.currentTarget;
                      el.style.color = "var(--text-muted)";
                      el.style.background = "transparent";
                      el.style.borderColor = "transparent";
                      el.style.transform = "translateX(0)";
                    }
                  }}
                  onFocus={(e) => {
                    if (!isActive) {
                      const el = e.currentTarget;
                      el.style.color = "var(--text-primary)";
                      el.style.background = "var(--bg-elevated)";
                      el.style.borderColor = "var(--border)";
                      el.style.transform = "translateX(4px)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!isActive) {
                      const el = e.currentTarget;
                      el.style.color = "var(--text-muted)";
                      el.style.background = "transparent";
                      el.style.borderColor = "transparent";
                      el.style.transform = "translateX(0)";
                    }
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={16} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        boxShadow: "0 0 8px var(--accent)",
                        flexShrink: 0
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ 
            padding: "var(--space-4) var(--space-4)", 
            borderTop: "1px solid var(--border)",
            background: "var(--bg-card)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)"
          }}
        >
          <button
            onClick={handleLogout}
            style={{ 
              background: "var(--bg-elevated)", 
              border: "1px solid var(--border)", 
              cursor: "pointer", 
              color: "var(--text-muted)", 
              padding: "0.65rem var(--space-3)", 
              borderRadius: "var(--radius-lg)", 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              fontSize: "0.85rem", 
              width: "100%", 
              transition: "all var(--transition-fast)",
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.color = "var(--error)";
              el.style.borderColor = "var(--error)";
              el.style.background = "var(--error-bg)";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.color = "var(--text-muted)";
              el.style.borderColor = "var(--border)";
              el.style.background = "var(--bg-elevated)";
              el.style.transform = "translateY(0)";
            }}
            onFocus={(e) => {
              const el = e.currentTarget;
              el.style.color = "var(--error)";
              el.style.borderColor = "var(--error)";
              el.style.background = "var(--error-bg)";
              el.style.transform = "translateY(-1px)";
            }}
            onBlur={(e) => {
              const el = e.currentTarget;
              el.style.color = "var(--text-muted)";
              el.style.borderColor = "var(--border)";
              el.style.background = "var(--bg-elevated)";
              el.style.transform = "translateY(0)";
            }}
            aria-label="Sign out of admin panel"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </motion.div>
      </motion.aside>

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
          <motion.button 
             onClick={() => setSidebarOpen(true)}
             style={{ 
               background: "var(--bg-elevated)", 
               border: "1px solid var(--border)", 
               cursor: "pointer", 
               color: "var(--text-primary)", 
               padding: "var(--space-2)",
               borderRadius: "var(--radius-md)",
               display: "none",
               width: 44,
               height: 44,
               alignItems: "center",
               justifyContent: "center"
             }}
             className="admin-mobile-toggle"
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             aria-label="Open admin menu"
             aria-expanded={sidebarOpen}
             aria-controls="admin-sidebar"
          >
             <Edit3 size={20} />
          </motion.button>

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
