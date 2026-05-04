"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Camera } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { StaggeredMenu } from "@/components/ui/StaggeredMenu";
import { useScrollPercent } from "@/components/ui/ScrollProgress";

const navLinks = [
  { label: "Home",      href: "/" },
  { label: "Gallery",   href: "/gallery" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services",  href: "/services" },
  { label: "Blog",      href: "/blog" },
  { label: "About",     href: "/about" },
  { label: "Contact",   href: "/contact" },
  { label: "Dhyey TV",  href: "/dhyey-tv", live: true },
];

export function Navbar() {
  const pathname             = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const scrollPercent              = useScrollPercent();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      {/* ── Pill container ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: "var(--z-nav)" as unknown as number,
          display: "flex",
          justifyContent: "center",
          padding: scrolled ? "10px 20px" : "16px 20px",
          transition: "padding var(--transition-slow)",
          pointerEvents: "none",
        }}
      >
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "100%",
            maxWidth: scrolled ? "960px" : "1280px",
            height: "var(--nav-height)",
            display: "flex",
            alignItems: "center",
            background: "var(--bg-glass)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid var(--bg-glass-border)",
            borderRadius: scrolled ? "9999px" : "var(--radius-2xl)",
            paddingInline: "var(--space-5)",
            boxShadow: scrolled
              ? "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px var(--border-accent)"
              : "0 4px 20px rgba(0,0,0,0.3)",
            transition: "all var(--transition-slow)",
            pointerEvents: "auto",
          }}
        >
          {/* ── Logo ── */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-lg)",
                border: "1.5px solid var(--border-accent)",
                background: "var(--accent-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Camera size={15} color="var(--accent)" strokeWidth={2} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--accent)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.1,
                  display: "block",
                }}
              >
                4K MOVIE KESRI
              </span>
              <span
                style={{
                  fontSize: "0.48rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  display: "block",
                  lineHeight: 1,
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                }}
              >
                SURAT
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-5)",
              flex: 1,
              justifyContent: "center",
            }}
            className="hidden-mobile"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: link.live ? 600 : 500,
                    color: isActive
                      ? "var(--accent)"
                      : link.live
                      ? "var(--accent-2)"
                      : "var(--text-secondary)",
                    transition: "color var(--transition-fast)",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    whiteSpace: "nowrap",
                    paddingBottom: 2,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        link.live ? "var(--accent-2)" : "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        link.live ? "var(--accent-2)" : "var(--text-secondary)";
                  }}
                >
                  {link.live && (
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "var(--accent-2)",
                        boxShadow: "0 0 5px 2px rgba(200,16,46,0.5)",
                        display: "inline-block",
                        flexShrink: 0,
                        animation: "nav-pulse 1.5s ease-in-out infinite",
                      }}
                    />
                  )}
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      style={{
                        position: "absolute",
                        bottom: -4,
                        left: "50%",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        x: "-50%",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right: Scroll % + Theme + CTA + Hamburger ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexShrink: 0 }}>


            <ThemeToggle />

            <Link
              href="/contact"
              className="btn btn-primary btn-sm hidden-mobile"
              style={{ borderRadius: "var(--radius-full)", fontSize: "0.78rem" }}
            >
              Book Now
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="show-mobile"
              style={{
                background: "none",
                border: "none",
                color: "var(--text-primary)",
                cursor: "pointer",
                padding: 4,
                display: "none",
              }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <StaggeredMenu
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            links={navLinks}
            pathname={pathname}
            socials={{
              instagram: "https://instagram.com",
              youtube: "https://youtube.com",
              facebook: "https://facebook.com",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Responsive CSS ── */}
      <style>{`
        .hidden-mobile { display: flex; }
        .show-mobile   { display: none !important; }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @keyframes nav-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </>
  );
}
