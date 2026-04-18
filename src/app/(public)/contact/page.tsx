import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with 4K Movie Kesri Surat to book your session.",
};

export default function ContactPage() {
  return (
    <>
      <section className="section" style={{ background: "var(--bg-primary)", paddingTop: "clamp(8rem, 15vh, 12rem)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto", marginBottom: "var(--space-10)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
              Let&apos;s Connect
            </span>
            <h1 style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-3)" }}>
              Contact Us
            </h1>
            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Have an upcoming wedding, event, or project? Reach out to us for a custom quote and consultation.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "var(--space-8)" }} className="contact-grid">
            
            {/* Contact Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              <div className="card" style={{ padding: "var(--space-6)" }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-5)" }}>Studio Info</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                  <div style={{ display: "flex", gap: "var(--space-3)" }}>
                    <MapPin className="text-accent" style={{ color: "var(--accent)", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Visit Us</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                        4K Movie Kesri Studio,<br/>
                        VIP Road, Vesu,<br/>
                        Surat, Gujarat 395007
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "var(--space-3)" }}>
                    <Phone className="text-accent" style={{ color: "var(--accent)", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Call Us</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        +91 98765 43210
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "var(--space-3)" }}>
                    <Mail className="text-accent" style={{ color: "var(--accent)", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Email Us</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        hello@4kmoviekesri.com
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "var(--space-3)" }}>
                    <Clock className="text-accent" style={{ color: "var(--accent)", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Hours</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        Mon - Sun: 10:00 AM - 8:00 PM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card" style={{ padding: "clamp(1.5rem, 4vw, 3rem)" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "var(--space-6)" }}>Send an Inquiry</h3>
              <form style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }} className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input type="text" className="form-input" placeholder="Rahul" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input type="text" className="form-input" placeholder="Patel" required />
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }} className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" className="form-input" placeholder="you@example.com" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" placeholder="+91" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Event Type</label>
                  <select className="form-input" style={{ appearance: "none" }}>
                    <option value="">Select Event...</option>
                    <option value="wedding">Wedding / Pre-Wedding</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="portrait">Portrait Session</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Details *</label>
                  <textarea 
                    className="form-input" 
                    placeholder="Tell us about your event, location, and desired dates..." 
                    rows={5} 
                    required 
                    style={{ resize: "vertical" }}
                  />
                </div>

                <button type="button" className="btn btn-primary" style={{ width: "100%", marginTop: "var(--space-2)" }}>
                  Submit Inquiry
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
