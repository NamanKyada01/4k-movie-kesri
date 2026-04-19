"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  live?: boolean;
}

interface StaggeredMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  pathname: string;
  socials?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
}

export function StaggeredMenu({ isOpen, onClose, links, pathname, socials }: StaggeredMenuProps) {
  const containerVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <motion.div
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      exit="exit"
      variants={containerVariants}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: "var(--z-overlay)",
        background: "rgba(8, 8, 8, 0.98)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        padding: "calc(var(--nav-height) + var(--space-8)) var(--space-8) var(--space-12)",
      }}
    >
      {/* Top Header inside menu */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "var(--nav-height)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 var(--space-6)" }}>
        <button 
          onClick={onClose}
          style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", padding: 8 }}
        >
          <X size={26} />
        </button>
      </div>

      {/* Main Links */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-1)", justifyContent: "center" }}>
        {links.map((link) => {
          const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <motion.div key={link.href} variants={itemVariants}>
              <Link
                href={link.href}
                onClick={onClose}
                style={{
                  fontSize: "1.55rem",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  color: isActive ? "var(--accent)" : "var(--text-primary)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-4)",
                  letterSpacing: "-0.04em",
                  padding: "0.2rem 0",
                  transition: "color 0.3s ease",
                }}
              >
                {link.label}
                {link.live && (
                   <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#ef4444",
                    boxShadow: "0 0 6px 2px rgba(239,68,68,0.6)",
                    display: "inline-block",
                  }} />
                )}
                {isActive && <ArrowRight size={18} color="var(--accent)" />}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Socials & Footer */}
      <motion.div 
        variants={itemVariants}
        style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "var(--space-5)" }}
      >
        <div style={{ display: "flex", gap: "var(--space-5)", marginBottom: "var(--space-4)" }}>
          {socials?.instagram && (
            <a href={socials.instagram} target="_blank" rel="noreferrer" style={{ color: "var(--text-muted)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          )}
          {socials?.youtube && (
            <a href={socials.youtube} target="_blank" rel="noreferrer" style={{ color: "var(--text-muted)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
            </a>
          )}
          {socials?.facebook && (
            <a href={socials.facebook} target="_blank" rel="noreferrer" style={{ color: "var(--text-muted)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          )}
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          © 4K Movie Kesri Surat
        </p>
      </motion.div>
    </motion.div>
  );
}
