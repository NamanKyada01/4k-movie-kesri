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
    <>
      <div style={{ marginBottom: "var(--space-8)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 4, fontFamily: "Epilogue, sans-serif", textTransform: "uppercase" }}>Content</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "600px" }}>Manage your studio's digital narrative with cinematic precision.</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)", paddingBottom: "100px" }}>
        
        {/* HERO SECTION */}
        <div style={{ 
          background: "rgba(25, 25, 25, 0.4)", 
          backdropFilter: "blur(40px)", 
          padding: "var(--space-8)", 
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(255, 255, 255, 0.03)" 
        }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-6)", color: "var(--accent)", fontFamily: "Epilogue, sans-serif" }}>Hero Narrative</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Main Headline</label>
              <input 
                type="text" 
                value={heroTitle} 
                onChange={e => setHeroTitle(e.target.value)} 
                placeholder="Cinematic Excellence..."
                style={{ 
                  width: "100%", 
                  padding: "12px 0", 
                  background: "transparent", 
                  border: "none", 
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)", 
                  fontSize: "1.5rem",
                  color: "var(--text-primary)",
                  outline: "none",
                  transition: "border-color 0.3s"
                }} 
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Hero Subtitle</label>
              <textarea 
                value={heroSubtitle} 
                onChange={e => setHeroSubtitle(e.target.value)} 
                rows={2}
                placeholder="Crafting stories that breathe..."
                style={{ 
                  width: "100%", 
                  padding: "12px 0", 
                  background: "transparent", 
                  border: "none", 
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)", 
                  fontSize: "1rem",
                  color: "var(--text-secondary)",
                  outline: "none",
                  resize: "none"
                }} 
              />
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div style={{ 
          background: "rgba(25, 25, 25, 0.4)", 
          backdropFilter: "blur(40px)", 
          padding: "var(--space-8)", 
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(255, 255, 255, 0.03)" 
        }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-6)", color: "var(--accent)", fontFamily: "Epilogue, sans-serif" }}>Editorial Identity</h3>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>The Studio Story</label>
            <textarea 
              value={aboutText} 
              onChange={e => setAboutText(e.target.value)} 
              rows={8} 
              style={{ 
                width: "100%", 
                padding: "20px", 
                background: "rgba(0,0,0,0.2)", 
                border: "1px solid rgba(255,255,255,0.05)", 
                borderRadius: "var(--radius-lg)", 
                color: "var(--text-primary)", 
                fontSize: "1.1rem",
                lineHeight: "1.8",
                outline: "none",
                resize: "vertical"
              }} 
            />
          </div>
        </div>

        {/* FOOTER CTA */}
        <div style={{ 
          background: "rgba(25, 25, 25, 0.4)", 
          backdropFilter: "blur(40px)", 
          padding: "var(--space-8)", 
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(255, 255, 255, 0.03)" 
        }}>
           <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-6)", color: "var(--accent)", fontFamily: "Epilogue, sans-serif" }}>Conversion Anchor</h3>
           <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Footer Narrative</label>
              <input 
                type="text" 
                value={contactFooterText} 
                onChange={e => setContactFooterText(e.target.value)} 
                style={{ 
                  width: "100%", 
                  padding: "10px 0", 
                  background: "transparent", 
                  border: "none", 
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)", 
                  color: "var(--text-primary)",
                  fontSize: "1rem"
                }} 
              />
           </div>
        </div>

      </div>

      {/* Floating Save Bar */}
      <div style={{ 
        position: "fixed", 
        bottom: "40px", 
        left: "50%", 
        transform: "translateX(-50%)", 
        zIndex: 100,
        width: "auto"
      }}>
        <button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="btn btn-primary" 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 12, 
            padding: "16px 40px", 
            fontSize: "1rem", 
            fontWeight: 700,
            boxShadow: "0 20px 40px rgba(232, 85, 10, 0.3)",
            borderRadius: "100px",
            background: "linear-gradient(135deg, #E8550A, #C9A84C)"
          }}
        >
          {isSaving ? <Loader2 size={20} className="animate-spin-slow" /> : <Save size={20} />}
          {isSaving ? "Synchronizing..." : "Preserve Narrative"}
        </button>
      </div>

      <style>{`
        input:focus, textarea:focus {
          border-bottom-color: var(--accent) !important;
        }
      `}</style>
    </>
  );
}
