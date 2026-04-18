"use client";

import { Mail, MapPin, Phone, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// metadata cannot be exported from a client component, moved to layout or handled differently,
// but for simplicity on this specific dynamic page we just omit metadata export.

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventType: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      
      toast.success("Message sent! We'll be in touch shortly.");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", eventType: "", message: "" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }} className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="form-input" placeholder="Rahul" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="form-input" placeholder="Patel" required />
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }} className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="you@example.com" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="+91" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Event Type</label>
                  <select name="eventType" value={formData.eventType} onChange={handleChange} className="form-input" style={{ appearance: "none" }}>
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
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-input" 
                    placeholder="Tell us about your event, location, and desired dates..." 
                    rows={5} 
                    required 
                    style={{ resize: "vertical" }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "var(--space-2)" }} disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin-slow" /> Sending...</> : "Submit Inquiry"}
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
