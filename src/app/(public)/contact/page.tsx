"use client";

import { Mail, MapPin, Phone, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CinemaBackground } from "@/components/layout/CinemaBackground";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <>
      <CinemaBackground theme={{ primary: "amber", secondary: "gold" }} />
      
      <motion.section 
        className="section" 
        style={{ background: "transparent", paddingTop: "clamp(8rem, 20vh, 15rem)" }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container">
          {/* Hero Content */}
          <motion.div variants={itemVariants} style={{ marginBottom: "var(--space-16)", textAlign: "left" }}>
            <span style={{ 
              fontSize: "0.85rem", 
              color: "var(--accent)", 
              letterSpacing: "0.2em", 
              textTransform: "uppercase", 
              fontWeight: 700,
              marginBottom: "var(--space-4)",
              display: "block"
            }}>
              Connect With Us
            </span>
            <h1 style={{ 
              fontSize: "clamp(3rem, 8vw, 6rem)", 
              textTransform: "uppercase", 
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              maxWidth: "900px"
            }}>
              Let&apos;s Frame Your <span style={{ color: "transparent", WebkitTextStroke: "1px var(--text-primary)" }}>Story</span>
            </h1>
            <p style={{ 
              fontSize: "clamp(1.1rem, 1.5vw, 1.3rem)", 
              color: "var(--text-muted)", 
              marginTop: "var(--space-6)",
              maxWidth: "600px",
              lineHeight: 1.6
            }}>
              Whether it&apos;s a legacy wedding or a commercial vision, our lens is ready. 
              Drop us a line to start your cinematic journey.
            </p>
          </motion.div>

          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "1.2fr 1fr", 
              gap: "var(--space-12)",
              alignItems: "start" 
            }} 
            className="contact-grid"
          >
            
            {/* Redesigned Contact Form */}
            <motion.div variants={itemVariants} style={{ position: "relative" }}>
              <div 
                className="glass" 
                style={{ 
                  padding: "clamp(2rem, 5vw, 4rem)", 
                  borderRadius: "var(--radius-2xl)",
                  background: "rgba(20, 20, 20, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }} className="form-grid">
                    <div className="form-field">
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="contact-input" placeholder=" " required />
                      <label className="contact-label">First Name</label>
                    </div>
                    <div className="form-field">
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="contact-input" placeholder=" " required />
                      <label className="contact-label">Last Name</label>
                    </div>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }} className="form-grid">
                    <div className="form-field">
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="contact-input" placeholder=" " required />
                      <label className="contact-label">Email Address</label>
                    </div>
                    <div className="form-field">
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="contact-input" placeholder=" " />
                      <label className="contact-label">Phone Number</label>
                    </div>
                  </div>

                  <div className="form-field">
                    <select name="eventType" value={formData.eventType} onChange={handleChange} className="contact-input" style={{ appearance: "none" }}>
                      <option value="" disabled hidden></option>
                      <option value="wedding">Wedding / Pre-Wedding</option>
                      <option value="corporate">Corporate Cinematic</option>
                      <option value="portrait">Editorial Portrait</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                    <label className="contact-label">Nature of Inquiry</label>
                  </div>

                  <div className="form-field">
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="contact-input" 
                      placeholder=" " 
                      rows={4} 
                      required 
                      style={{ resize: "none" }}
                    />
                    <label className="contact-label">Tell us your vision...</label>
                  </div>

                  <button type="submit" className="btn btn-primary btn-xl" style={{ width: "100%", height: "60px", fontSize: "1rem" }} disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 size={18} className="animate-spin-slow" /> Transmitting...</> : "Send Request"}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Studio Info Section */}
            <motion.div variants={itemVariants} style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
              <div style={{ paddingLeft: "var(--space-4)" }}>
                <h2 style={{ fontSize: "2rem", marginBottom: "var(--space-6)" }}>Inside the Studio</h2>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
                  <div style={{ display: "flex", gap: "var(--space-6)" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(232, 85, 10, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Headquarters</div>
                      <div style={{ color: "var(--text-primary)", fontSize: "1.1rem", fontWeight: 500, lineHeight: 1.5 }}>
                        4K Movie Kesri Studio,<br/>
                        VIP Road, Vesu,<br/>
                        Surat, Gujarat 395007
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "var(--space-6)" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(232, 85, 10, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                      <Phone size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Call Us</div>
                      <div style={{ color: "var(--text-primary)", fontSize: "1.1rem", fontWeight: 500 }}>
                        +91 98765 43210
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "var(--space-6)" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(232, 85, 10, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                      <Mail size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Email Us</div>
                      <div style={{ color: "var(--text-primary)", fontSize: "1.1rem", fontWeight: 500 }}>
                        hello@4kmoviekesri.com
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "var(--space-6)" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(232, 85, 10, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Availability</div>
                      <div style={{ color: "var(--text-primary)", fontSize: "1.1rem", fontWeight: 500 }}>
                        Mon - Sun: 10:00 AM - 8:00 PM
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Minimal social/links section */}
              <div 
                style={{ 
                  marginTop: "var(--space-4)",
                  padding: "var(--space-8)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px dashed var(--border)",
                  textAlign: "center"
                }}
              >
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Looking for our portfolio? <br/>
                  <a href="/gallery" style={{ color: "var(--accent)", fontWeight: 600 }}>Browse our latest exhibitions &rarr;</a>
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.section>

      <style>{`
        .form-field {
          position: relative;
          width: 100%;
        }

        .contact-input {
          width: 100%;
          padding: 12px 0;
          font-size: 1rem;
          color: var(--text-primary);
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          outline: none;
          transition: border-color 0.3s ease;
          font-family: var(--font-body);
        }

        .contact-input:focus {
          border-bottom-color: var(--accent);
        }

        .contact-label {
          position: absolute;
          top: 12px;
          left: 0;
          color: var(--text-muted);
          pointer-events: none;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .contact-input:focus ~ .contact-label,
        .contact-input:not(:placeholder-shown) ~ .contact-label {
          top: -12px;
          font-size: 0.75rem;
          color: var(--accent);
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        @media (max-width: 1024px) {
          .contact-grid { 
            grid-template-columns: 1fr !important; 
            gap: var(--space-20) !important;
          }
        }
        
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr !important; gap: var(--space-8) !important; }
        }
      `}</style>
    </>
  );
}
