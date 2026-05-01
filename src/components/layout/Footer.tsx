"use client";
import Link from "next/link";

import { Camera, Phone, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { label: "Home",      href: "/" },
  { label: "Gallery",   href: "/gallery" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services",  href: "/services" },
  { label: "Blog",      href: "/blog" },
  { label: "Pricing",   href: "/pricing" },
  { label: "Dhyey TV",  href: "/dhyey-tv" },
  { label: "Admin Login", href: "/admin/login" },
];

const services = [
  "Wedding Photography",
  "Engagement Shoots",
  "Corporate Events",
  "Portrait Sessions",
  "Product Photography",
  "Videography (4K)",
];

export function Footer({ config }: { config?: any }) {
  const instagramUrl = config?.instagramUrl || "#";
  const youtubeUrl = config?.youtubeUrl || "#";
  const facebookUrl = config?.facebookUrl || "#";
  const supportEmail = config?.supportEmail || "4kmovie2672.2@gmail.com";
  const supportPhone = config?.supportPhone || "+91 XXXXX XXXXX";

  const socialLinks = [
    { label: "Instagram", href: instagramUrl, svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
    { label: "YouTube",   href: youtubeUrl,   svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg> },
    { label: "Facebook",  href: facebookUrl,  svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
  ];

  return (
    <footer
      style={{
        background: "var(--bg-primary)",
        borderTop: "1px solid var(--border)",
        paddingTop: "var(--space-16)",
        paddingBottom: "var(--space-8)",
      }}
    >
      <div className="container">
        {/* Top Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1.4fr",
            gap: "var(--space-12)",
            marginBottom: "var(--space-12)",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-4)" }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "var(--radius-lg)",
                  border: "1.5px solid var(--border-accent)",
                  background: "var(--accent-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Camera size={18} color="var(--accent)" />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.05rem", color: "var(--accent)", lineHeight: 1.1, letterSpacing: "0.04em" }}>
                  4K MOVIE KESRI
                </div>
                <div style={{ fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "var(--font-body)" }}>
                  SURAT
                </div>
              </div>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "var(--text-muted)", maxWidth: 280, marginBottom: "var(--space-5)" }}>
              Capturing life's most defining moments through cinematic photography and 4K videography. Based in Surat, serving all of Gujarat.
            </p>
            {/* Social */}
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              {socialLinks.map(({ label, href, svg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    transition: "all var(--transition-base)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.color = "var(--accent)";
                    el.style.borderColor = "var(--border-accent)";
                    el.style.background = "var(--accent-muted)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.color = "var(--text-muted)";
                    el.style.borderColor = "var(--border)";
                    el.style.background = "transparent";
                  }}
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{ fontSize: "0.85rem", color: "var(--text-secondary)", transition: "color var(--transition-fast)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
              Services
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {services.map((s) => (
                <li key={s}>
                  <Link
                    href="/services"
                    style={{ fontSize: "0.85rem", color: "var(--text-secondary)", transition: "color var(--transition-fast)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
              Get In Touch
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {[
                { icon: Phone,   text: supportPhone, href: `tel:${supportPhone.replace(/[^0-9+]/g, "")}` },
                { icon: Mail,    text: supportEmail, href: `mailto:${supportEmail}` },
                { icon: MapPin,  text: "Surat, Gujarat, India", href: "#" },
              ].map(({ icon: Icon, text, href }) => (
                <a
                  key={text}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--space-3)",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    transition: "color var(--transition-fast)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                >
                  <Icon size={15} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
                  {text}
                </a>
              ))}
            </div>
            <Link
              href="/contact"
              className="btn btn-primary btn-sm"
              style={{ marginTop: "var(--space-5)", display: "inline-flex" }}
            >
              Book a Session
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-bottom" style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-6)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-3)" }}>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} 4K Movie Kesri Surat. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "var(--space-5)" }}>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: "0.78rem", color: "var(--text-muted)", transition: "color var(--transition-fast)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: var(--space-8) !important; }
        }
        @media (max-width: 550px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: var(--space-8) !important; }
        }
        @media (max-width: 480px) {
          .footer-bottom { flex-direction: column !important; align-items: flex-start !important; gap: var(--space-3) !important; }
        }
      `}</style>
    </footer>
  );
}
