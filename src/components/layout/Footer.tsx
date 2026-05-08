"use client";
import Link from "next/link";
import { Camera, Phone, Mail, MapPin, ArrowUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const quickLinks = [
  { label: "Home",       href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services",  href: "/services" },
  { label: "Blog",      href: "/blog" },
  { label: "Pricing",   href: "/pricing" },
  { label: "Dhyey TV",  href: "/dhyey-tv" },
  { label: "Admin",     href: "/admin/login" },
];

const services = [
  "Wedding Photography",
  "Pre-Wedding Shoot",
  "Corporate Events",
  "Portrait Sessions",
  "Videography (4K)",
  "LED Screen Rental",
  "Live Telecast",
  "Crane Services",
];

const AWARDS = [
  { num: "500+", label: "Events" },
  { num: "5★",   label: "Rated" },
  { num: "4K",   label: "Quality" },
  { num: "48h",  label: "Delivery" },
];

export function Footer({ config }: { config?: any }) {
  const instagramUrl = config?.instagramUrl || "#";
  const youtubeUrl   = config?.youtubeUrl   || "#";
  const facebookUrl  = config?.facebookUrl  || "#";
  const supportEmail = config?.supportEmail || "4kmovie2672.2@gmail.com";
  const supportPhone = config?.supportPhone || "+91 XXXXX XXXXX";

  const socialLinks = [
    {
      label: "Instagram",
      href: instagramUrl,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: youtubeUrl,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: facebookUrl,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ),
    },
  ];

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="site-footer">
      {/* ── Noise grain overlay ── */}
      <div className="footer-grain" aria-hidden />

      {/* ── Glow orb ── */}
      <div className="footer-orb" aria-hidden />

      {/* ── Top gold gradient rule ── */}
      <div className="footer-top-rule" aria-hidden />

      <div className="container">

        {/* ── Brand statement strip ── */}
        <div className="footer-brand-strip">
          <div className="footer-brand-logo">
            <div className="footer-logo-icon">
              <Camera size={22} color="var(--accent)" />
            </div>
            <div>
              <div className="footer-logo-name">4K MOVIE KESRI</div>
              <div className="footer-logo-sub">SURAT, GUJARAT</div>
            </div>
          </div>
          <p className="footer-tagline">
            Every frame a masterpiece.<br />
            <span style={{ color: "var(--accent)", fontStyle: "italic" }}>Capturing forever, one shutter at a time.</span>
          </p>
          {/* Mini stats row */}
          <div className="footer-mini-stats">
            {AWARDS.map((a) => (
              <div key={a.label} className="footer-mini-stat">
                <span className="footer-mini-num">{a.num}</span>
                <span className="footer-mini-label">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="footer-grid">

          {/* About col */}
          <div className="footer-col footer-col-about">
            <p className="footer-body-text">
              Premium 4K photography &amp; videography studio based in Surat, serving all of Gujarat with cinematic precision.
            </p>
            {/* Social icons */}
            <div className="footer-socials">
              {socialLinks.map(({ label, href, icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social-btn"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-link-list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    <span className="footer-link-dot" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4 className="footer-col-title">Services</h4>
            <ul className="footer-link-list">
              {services.map((s) => (
                <li key={s}>
                  <Link href="/services" className="footer-link">
                    <span className="footer-link-dot" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Get In Touch</h4>
            <div className="footer-contact-list">
              {[
                { icon: Phone,  text: supportPhone, href: `tel:${supportPhone.replace(/[^0-9+]/g, "")}` },
                { icon: Mail,   text: supportEmail, href: `mailto:${supportEmail}` },
                { icon: MapPin, text: "Surat, Gujarat, India", href: "https://maps.google.com/?q=Surat,Gujarat" },
              ].map(({ icon: Icon, text, href }) => (
                <a key={text} href={href} className="footer-contact-item" target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  <div className="footer-contact-icon">
                    <Icon size={14} />
                  </div>
                  <span>{text}</span>
                </a>
              ))}
            </div>

            <Link href="/contact" className="btn btn-primary btn-sm footer-cta-btn">
              Book a Session <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} 4K Movie Kesri Surat. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link href="/privacy" className="footer-bottom-link">Privacy Policy</Link>
            <span className="footer-bottom-sep">·</span>
            <Link href="/terms" className="footer-bottom-link">Terms of Service</Link>
          </div>
          {/* Back to top */}
          <motion.button
            onClick={scrollToTop}
            className="footer-back-top"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            aria-label="Back to top"
          >
            <ArrowUp size={15} />
          </motion.button>
        </div>
      </div>

      <style>{`
        /* ─── Footer wrapper ─── */
        .site-footer {
          position: relative;
          background: var(--bg-primary);
          overflow: hidden;
          padding-top: clamp(3rem, 8vw, 5rem);
          padding-bottom: var(--space-8);
        }

        /* ─── Noise grain (CSS pseudo-noise via SVG data URI) ─── */
        .footer-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        /* ─── Glow orb ─── */
        .footer-orb {
          position: absolute;
          bottom: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 280px;
          background: radial-gradient(ellipse, rgba(212,160,23,0.07) 0%, transparent 65%);
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
        }

        /* ─── Top gold gradient rule ─── */
        .footer-top-rule {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--accent) 30%, var(--gold) 50%, var(--accent) 70%, transparent 100%);
          z-index: 1;
        }

        .site-footer .container {
          position: relative;
          z-index: 2;
        }

        /* ─── Brand statement strip ─── */
        .footer-brand-strip {
          display: flex;
          align-items: center;
          gap: clamp(var(--space-8), 4vw, var(--space-16));
          padding-bottom: clamp(var(--space-8), 5vw, var(--space-12));
          border-bottom: 1px solid var(--border);
          margin-bottom: clamp(var(--space-8), 5vw, var(--space-12));
          flex-wrap: wrap;
        }

        .footer-brand-logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-shrink: 0;
        }

        .footer-logo-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-xl);
          border: 1.5px solid var(--border-accent);
          background: var(--accent-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .footer-logo-name {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--accent);
          line-height: 1.1;
          letter-spacing: 0.05em;
        }

        .footer-logo-sub {
          font-size: 0.55rem;
          color: var(--text-muted);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-family: var(--font-body);
          margin-top: 2px;
        }

        .footer-tagline {
          font-family: var(--font-heading);
          font-size: clamp(1rem, 2.5vw, 1.35rem);
          line-height: 1.45;
          color: var(--text-primary);
          flex: 1;
          min-width: 200px;
        }

        .footer-mini-stats {
          display: flex;
          gap: var(--space-6);
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        .footer-mini-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .footer-mini-num {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--accent);
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .footer-mini-label {
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
        }

        /* ─── Main grid ─── */
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
          gap: clamp(var(--space-8), 4vw, var(--space-12));
          margin-bottom: clamp(var(--space-8), 5vw, var(--space-12));
        }

        .footer-col-title {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: var(--space-4);
          font-family: var(--font-body);
        }

        .footer-body-text {
          font-size: 0.85rem;
          line-height: 1.75;
          color: var(--text-muted);
          margin-bottom: var(--space-5);
        }

        /* Social */
        .footer-socials {
          display: flex;
          gap: var(--space-2);
        }

        .footer-social-btn {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
          text-decoration: none;
          cursor: pointer;
        }
        .footer-social-btn:hover {
          color: var(--accent);
          border-color: var(--border-accent);
          background: var(--accent-muted);
        }

        /* Links */
        .footer-link-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease, gap 0.2s ease;
        }
        .footer-link:hover {
          color: var(--accent);
          gap: var(--space-3);
        }

        .footer-link-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--border-accent);
          flex-shrink: 0;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .footer-link:hover .footer-link-dot {
          background: var(--accent);
          transform: scale(1.5);
        }

        /* Contact */
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-bottom: var(--space-5);
        }

        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          font-size: 0.83rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;
          line-height: 1.5;
        }
        .footer-contact-item:hover { color: var(--accent); }

        .footer-contact-icon {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-md);
          background: var(--accent-muted);
          border: 1px solid var(--border-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
          margin-top: 1px;
        }

        .footer-cta-btn {
          display: inline-flex !important;
          border-radius: var(--radius-full) !important;
        }

        /* ─── Bottom bar ─── */
        .footer-bottom {
          border-top: 1px solid var(--border);
          padding-top: var(--space-5);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .footer-copy {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .footer-bottom-link {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-bottom-link:hover { color: var(--accent); }

        .footer-bottom-sep {
          color: var(--border-strong);
          font-size: 0.7rem;
        }

        /* Back to top */
        .footer-back-top {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .footer-back-top:hover {
          color: var(--accent);
          border-color: var(--border-accent);
          background: var(--accent-muted);
        }

        /* ─── Responsive ─── */
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 900px) {
          .footer-brand-strip { flex-direction: column; align-items: flex-start; }
          .footer-tagline { font-size: 1rem; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: var(--space-8); }
          .footer-mini-stats { gap: var(--space-4); }
        }
        @media (max-width: 440px) {
          .footer-grid { grid-template-columns: 1fr; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
          .footer-mini-stats { width: 100%; justify-content: space-between; }
        }
      `}</style>
    </footer>
  );
}
