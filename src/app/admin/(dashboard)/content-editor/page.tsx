"use client";

import { useState, useEffect } from "react";
import { Edit3, Loader2, Save } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

export default function ContentEditorPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Content State
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [contactFooterText, setContactFooterText] = useState("");

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const docRef = doc(db, "settings", "globalContent");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setHeroTitle(data.heroTitle || "");
        setHeroSubtitle(data.heroSubtitle || "");
        setAboutText(data.aboutText || "");
        setContactFooterText(data.contactFooterText || "");
      }
    } catch (err) {
      toast.error("Failed to load content.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(
        doc(db, "settings", "globalContent"),
        { heroTitle, heroSubtitle, aboutText, contactFooterText },
        { merge: true }
      );
      toast.success("Global content updated successfully!");
    } catch (error) {
       toast.error("Failed to save content.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Loader2 className="animate-spin-slow" size={32} color="var(--accent)" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "var(--space-8)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>Content Editor</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Modify textual content across the public-facing pages instantly.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isSaving ? <Loader2 size={16} className="animate-spin-slow" /> : <Save size={16} />}
          {isSaving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <div style={{ display: "grid", gap: "var(--space-6)", maxWidth: 800 }}>
        
        {/* HOMEPAGE SECTION */}
        <div className="card">
           <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: 8 }}>
             <Edit3 size={18} color="var(--accent)" />
             Homepage Hero Section
           </h3>
           
           <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
             <div>
               <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Main Title (H1)</label>
               <input 
                 type="text" 
                 value={heroTitle} 
                 onChange={e => setHeroTitle(e.target.value)} 
                 style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontSize: "1rem" }} 
                 placeholder="Cinematic Storytelling" 
               />
             </div>
             <div>
               <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Subtitle text underneath Hero</label>
               <textarea 
                 value={heroSubtitle} 
                 onChange={e => setHeroSubtitle(e.target.value)} 
                 rows={3} 
                 style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", resize: "vertical" }} 
                 placeholder="Professional photography and videography based in Surat..." 
               />
             </div>
           </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="card">
           <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: 8 }}>
             <Edit3 size={18} color="var(--accent)" />
             About Us Paragraph
           </h3>
           
           <div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 12 }}>
                This text will appear in the About Us block. HTML tags are NOT permitted here to prevent XSS issues.
              </p>
              <textarea 
                value={aboutText} 
                onChange={e => setAboutText(e.target.value)} 
                rows={6} 
                style={{ width: "100%", padding: "14px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", resize: "vertical", lineHeight: 1.6 }} 
                placeholder="4K Movie Kesri is a leading production studio..." 
              />
           </div>
        </div>

        {/* CONTACT EMBED SECTION */}
        <div className="card">
           <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: 8 }}>
             <Edit3 size={18} color="var(--accent)" />
             Footer Call to Action
           </h3>
           
           <div>
              <input 
                type="text" 
                value={contactFooterText} 
                onChange={e => setContactFooterText(e.target.value)} 
                style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} 
                placeholder="Ready to craft your cinematic story? Let's talk!" 
              />
           </div>
        </div>

      </div>
    </div>
  );
}
