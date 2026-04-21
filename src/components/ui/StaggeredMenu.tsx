"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

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
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap for accessibility
  useEffect(() => {
    if (isOpen) {
      // Focus the close button when menu opens
      closeButtonRef.current?.focus();
      
      // Trap focus inside menu
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
        
        if (e.key === 'Tab' && menuRef.current) {
          const focusableElements = menuRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const containerVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
    exit: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.25,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      x: 30, 
      scale: 0.95,
      transition: { duration: 0.2 }
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: "calc(var(--z-overlay) - 1)",
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
            aria-hidden="true"
          />
          
          {/* Menu */}
          <motion.div
            ref={menuRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: "var(--z-overlay)",
              background: "var(--bg-primary)",
              display: "flex",
              flexDirection: "column",
              padding: "calc(var(--nav-height) + var(--space-6)) var(--space-6) var(--space-8)",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation menu"
          >
            {/* Top Header inside menu */}
            <div style={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              right: 0, 
              height: "var(--nav-height)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "flex-end", 
              padding: "0 var(--space-5)",
              background: "var(--bg-primary)",
              borderBottom: "1px solid var(--border)"
            }}>
              <button 
                ref={closeButtonRef}
                onClick={onClose}
                style={{ 
                  background: "var(--bg-elevated)", 
                  border: "1px solid var(--border)", 
                  color: "var(--text-primary)", 
                  cursor: "pointer", 
                  padding: "var(--space-2)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44
                }}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Main Links */}
            <nav style={{ 
              flex: 1, 
              display: "flex", 
              flexDirection: "column", 
              gap: "var(--space-2)", 
              justifyContent: "center",
              padding: "var(--space-4) 0"
            }}>
              {links.map((link, index) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                const linkRef = index === 0 ? firstLinkRef : undefined;
                
                return (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link
                      ref={linkRef}
                      href={link.href}
                      onClick={onClose}
                      style={{
                        fontSize: "clamp(1.8rem, 5vw, 2.2rem)",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 800,
                        color: isActive ? "var(--accent)" : "var(--text-primary)",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "var(--space-4)",
                        letterSpacing: "-0.02em",
                        padding: "var(--space-3) var(--space-4)",
                        borderRadius: "var(--radius-lg)",
                        background: isActive ? "var(--accent-muted)" : "transparent",
                        transition: "all var(--transition-fast)",
                        border: "1px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          const el = e.currentTarget;
                          el.style.background = "var(--bg-elevated)";
                          el.style.borderColor = "var(--border)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          const el = e.currentTarget;
                          el.style.background = "transparent";
                          el.style.borderColor = "transparent";
                        }
                      }}
                      onFocus={(e) => {
                        if (!isActive) {
                          const el = e.currentTarget;
                          el.style.background = "var(--bg-elevated)";
                          el.style.borderColor = "var(--border)";
                        }
                      }}
                      onBlur={(e) => {
                        if (!isActive) {
                          const el = e.currentTarget;
                          el.style.background = "transparent";
                          el.style.borderColor = "transparent";
                        }
                      }}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                        {link.live && (
                          <span style={{
                            width: 8, 
                            height: 8, 
                            borderRadius: "50%",
                            background: "#ef4444",
                            boxShadow: "0 0 8px 3px rgba(239,68,68,0.6)",
                            display: "inline-block",
                            flexShrink: 0,
                            animation: "pulse 2s infinite"
                          }} />
                        )}
                        {link.label}
                      </div>
                      {isActive && (
                        <ArrowRight size={20} color="var(--accent)" style={{ opacity: 0.7 }} />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Socials & Footer */}
            <motion.div 
              variants={itemVariants}
              style={{ 
                marginTop: "auto", 
                borderTop: "1px solid var(--border)", 
                paddingTop: "var(--space-6)",
                paddingBottom: "var(--space-4)"
              }}
            >
              {socials && (
                <div style={{ 
                  display: "flex", 
                  gap: "var(--space-4)", 
                  marginBottom: "var(--space-5)",
                  justifyContent: "center"
                }}>
                  {socials.instagram && (
                    <a 
                      href={socials.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        color: "var(--text-muted)",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-full)",
                        width: 44,
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all var(--transition-fast)"
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.color = "var(--accent)";
                        el.style.borderColor = "var(--accent)";
                        el.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.color = "var(--text-muted)";
                        el.style.borderColor = "var(--border)";
                        el.style.transform = "translateY(0)";
                      }}
                      aria-label="Visit our Instagram"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </a>
                  )}
                  {socials.youtube && (
                    <a 
                      href={socials.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        color: "var(--text-muted)",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-full)",
                        width: 44,
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all var(--transition-fast)"
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.color = "#FF0000";
                        el.style.borderColor = "#FF0000";
                        el.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.color = "var(--text-muted)";
                        el.style.borderColor = "var(--border)";
                        el.style.transform = "translateY(0)";
                      }}
                      aria-label="Visit our YouTube channel"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
                    </a>
                  )}
                  {socials.facebook && (
                    <a 
                      href={socials.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        color: "var(--text-muted)",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-full)",
                        width: 44,
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all var(--transition-fast)"
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.color = "#1877F2";
                        el.style.borderColor = "#1877F2";
                        el.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.color = "var(--text-muted)";
                        el.style.borderColor = "var(--border)";
                        el.style.transform = "translateY(0)";
                      }}
                      aria-label="Visit our Facebook page"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                  )}
                </div>
              )}
              
              <p style={{ 
                fontSize: "0.75rem", 
                color: "var(--text-muted)", 
                letterSpacing: "0.05em", 
                textTransform: "uppercase",
                textAlign: "center",
                margin: 0
              }}>
                © {new Date().getFullYear()} 4K Movie Kesri Surat
              </p>
            </motion.div>
          </motion.div>
          
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
