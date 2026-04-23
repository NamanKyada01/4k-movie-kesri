"use client";

import { useState, useEffect } from "react";
import { Star, Plus, Loader2, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from "firebase/firestore";
import type { Testimonial } from "@/types";
import { toast } from "sonner";
import CustomDropdown from "@/components/ui/CustomDropdown";

const ratingOptions = [
    { value: '5', label: '⭐️⭐️⭐️⭐️⭐️ (5)' },
    { value: '4', label: '⭐️⭐️⭐️⭐️ (4)' },
    { value: '3', label: '⭐️⭐️⭐️ (3)' }
];

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [clientName, setClientName] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [featured, setFeatured] = useState(true);
  const [status, setStatus] = useState("approved");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Testimonial[];
      setTestimonials(data);
    } catch (err) {
      toast.error("Failed to fetch testimonials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !text) return toast.error("Please fill required fields.");

    setIsSubmitting(true);
    try {
      const newReview: Omit<Testimonial, "id"> = {
        clientName,
        eventType,
        rating,
        text,
        featured,
        status: status as any,
        createdAt: Date.now()
      };

      const docRef = await addDoc(collection(db, "testimonials"), newReview);
      setTestimonials(prev => [{ id: docRef.id, ...newReview }, ...prev]);
      
      toast.success("Testimonial added successfully!");
      setClientName("");
      setText("");
      setRating(5);
      
    } catch (error) {
      toast.error("Failed to add testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this testimonial?")) return;
    try {
      await deleteDoc(doc(db, "testimonials", id));
      setTestimonials(p => p.filter(t => t.id !== id));
      toast.success("Testimonial deleted");
    } catch (error) {
       toast.error("Failed to delete testimonial");
    }
  };

  const toggleFeatured = async (id: string, currentVal: boolean) => {
    try {
      await updateDoc(doc(db, "testimonials", id), { featured: !currentVal });
      setTestimonials(p => p.map(t => t.id === id ? { ...t, featured: !currentVal } : t));
      toast.success("Featured status updated");
    } catch (error) {
       toast.error("Failed to update status");
    }
  };

  return (
    <div style={{ paddingBottom: "100px" }}>
      <div style={{ marginBottom: "var(--space-10)" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 4, fontFamily: "Epilogue, sans-serif", textTransform: "uppercase" }}>Testimonials</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "600px" }}>The voices of those whose stories we've had the honor to tell.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-10)" }} className="manager-layout">
        
        {/* Add Form */}
        <div style={{ 
          background: "rgba(25, 25, 25, 0.4)", 
          backdropFilter: "blur(40px)", 
          padding: "var(--space-8)", 
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(255, 255, 255, 0.03)",
          alignSelf: "start",
          position: "sticky",
          top: "calc(var(--nav-height) + 20px)"
        }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-6)", color: "var(--accent)", fontFamily: "Epilogue, sans-serif", display: "flex", alignItems: "center", gap: 12 }}>
            Capture Love
          </h3>
          
          <form onSubmit={handleAddTestimonial} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase" }}>Client Identity</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} required style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)", fontSize: "1rem", outline: "none" }} placeholder="Full Name" />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase" }}>Production Event</label>
              <input type="text" value={eventType} onChange={e => setEventType(e.target.value)} required style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)", fontSize: "1rem", outline: "none" }} placeholder="e.g. Cinematic Wedding" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase" }}>Star Rating</label>
                <CustomDropdown 
                  options={ratingOptions}
                  value={String(rating)}
                  onChange={val => setRating(Number(val))}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, alignSelf: "end", paddingBottom: "10px" }}>
                <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--accent)" }} />
                <label htmlFor="featured" style={{ fontSize: "0.85rem", cursor: "pointer", color: "var(--text-secondary)" }}>Feature on Home?</label>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase" }}>The Quote</label>
              <textarea value={text} onChange={e => setText(e.target.value)} required rows={4} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "var(--radius-lg)", color: "var(--text-primary)", resize: "vertical", fontSize: "0.95rem", outline: "none" }} placeholder="Write the heartfelt words here..." />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px", fontWeight: 700, borderRadius: "100px", background: "linear-gradient(135deg, #E8550A, #C9A84C)", marginTop: "var(--space-2)" }} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 size={18} className="animate-spin-slow" /> Publishing...</> : "Publish Narrative"}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <h3 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>Legacy of Love ({testimonials.length})</h3>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-10)" }}>
              <Loader2 size={40} className="animate-spin-slow" color="var(--accent)" />
            </div>
          ) : testimonials.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-muted)", background: "rgba(25,25,25,0.4)", borderRadius: "var(--radius-xl)", border: "1px solid rgba(255,255,255,0.03)" }}>
              <Star size={40} style={{ margin: "0 auto 16px", opacity: 0.1 }} />
              <p>No narratives yet.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "var(--space-6)" }}>
              {testimonials.map(t => (
                <div key={t.id} style={{ 
                  padding: "var(--space-8)", 
                  background: "rgba(25, 25, 25, 0.4)", 
                  backdropFilter: "blur(40px)",
                  borderRadius: "var(--radius-xl)", 
                  border: "1px solid rgba(255, 255, 255, 0.03)",
                  position: "relative",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  overflow: "hidden"
                }} className="testimonial-card">
                  
                  {t.featured && (
                    <div style={{ 
                      position: "absolute", 
                      top: 0, 
                      right: 0, 
                      width: "120px", 
                      height: "120px", 
                      background: "radial-gradient(circle, rgba(201, 168, 76, 0.15) 0%, transparent 70%)",
                      pointerEvents: "none"
                    }} />
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "var(--space-6)" }}>
                    <div>
                      <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.2rem", fontFamily: "Epilogue, sans-serif" }}>{t.clientName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--accent)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{t.eventType}</div>
                    </div>
                    <div style={{ display: "flex", gap: 3 }}>
                       {Array.from({ length: t.rating }).map((_, i) => (
                         <Star key={i} size={16} fill="var(--gold)" color="transparent" style={{ filter: "drop-shadow(0 0 5px rgba(201, 168, 76, 0.5))" }} />
                       ))}
                    </div>
                  </div>
                  
                  <p style={{ 
                    fontSize: "1.3rem", 
                    color: "var(--text-primary)", 
                    fontFamily: "Epilogue, sans-serif",
                    fontWeight: 500,
                    fontStyle: "italic", 
                    lineHeight: 1.5, 
                    marginBottom: "var(--space-8)",
                    opacity: 0.9
                  }}>
                    "{t.text}"
                  </p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: "var(--space-6)" }}>
                    <div 
                      onClick={() => toggleFeatured(t.id, t.featured)}
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 8, 
                        fontSize: "0.8rem", 
                        cursor: "pointer", 
                        color: t.featured ? "var(--gold)" : "var(--text-muted)",
                        fontWeight: 600,
                        textTransform: "uppercase"
                      }}
                    >
                      <div style={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: "50%", 
                        background: t.featured ? "var(--gold)" : "transparent",
                        border: `2px solid ${t.featured ? "var(--gold)" : "var(--text-muted)"}`,
                        boxShadow: t.featured ? "0 0 10px var(--gold)" : "none"
                      }} />
                      Featured on Home
                    </div>
                    <button 
                      onClick={() => handleDelete(t.id)} 
                      style={{ 
                        background: "transparent", 
                        border: "none", 
                        color: "var(--error)", 
                        cursor: "pointer", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 6, 
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        opacity: 0.6,
                        transition: "opacity 0.2s"
                      }}
                      className="delete-pill"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          border-color: rgba(255,255,255,0.08) !important;
        }
        .delete-pill:hover { opacity: 1 !important; }
        @media (max-width: 1100px) {
          .manager-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
