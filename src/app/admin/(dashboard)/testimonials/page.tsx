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
    <div>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>Testimonials Manager</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Curate client love to display on your homepage.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "var(--space-6)" }} className="manager-layout">
        
        {/* Add Form */}
        <div className="card" style={{ alignSelf: "start", position: "sticky", top: "calc(var(--nav-height) + 20px)" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-5)", display: "flex", alignItems: "center", gap: 8 }}>
            <Plus size={18} color="var(--accent)" />
            Add Review
          </h3>
          
          <form onSubmit={handleAddTestimonial} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Client Name</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Event Type</label>
              <input type="text" value={eventType} onChange={e => setEventType(e.target.value)} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} placeholder="e.g. Wedding, Corporate..." />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Rating</label>
              <CustomDropdown 
                options={ratingOptions}
                value={String(rating)}
                onChange={val => setRating(Number(val))}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Review Text</label>
              <textarea value={text} onChange={e => setText(e.target.value)} required rows={4} style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
              <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} />
              <label htmlFor="featured" style={{ fontSize: "0.85rem", cursor: "pointer" }}>Feature on Homepage?</label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "var(--space-2)" }} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 size={16} className="animate-spin-slow" /> Adding...</> : "Publish Review"}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
             <h3 style={{ fontSize: "1rem" }}>All Testimonials ({testimonials.length})</h3>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-10)" }}>
              <Loader2 size={32} className="animate-spin-slow" color="var(--text-muted)" />
            </div>
          ) : testimonials.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-muted)", background: "var(--bg-elevated)", borderRadius: "var(--radius-lg)" }}>
              <Star size={32} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
              <p>No testimonials added yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {testimonials.map(t => (
                <div key={t.id} style={{ padding: "var(--space-5)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "var(--space-3)" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{t.clientName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--accent)", marginTop: 2 }}>{t.eventType}</div>
                    </div>
                    <div style={{ display: "flex", gap: 2 }}>
                       {Array.from({ length: t.rating }).map((_, i) => (
                         <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />
                       ))}
                    </div>
                  </div>
                  
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.6, marginBottom: "var(--space-4)" }}>
                    "{t.text}"
                  </p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "var(--space-3)", marginTop: "var(--space-2)" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", cursor: "pointer", color: t.featured ? "var(--text-primary)" : "var(--text-muted)" }}>
                      <input type="checkbox" checked={t.featured} onChange={() => toggleFeatured(t.id, t.featured)} />
                      Featured on Home
                    </label>
                    <button onClick={() => handleDelete(t.id)} style={{ background: "transparent", border: "none", color: "var(--error)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem" }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .manager-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
