"use client";

import { useState, useEffect } from "react";
import { Settings, Loader2, Save, Globe, Phone, Mail, Camera, Link as LinkIcon, Video, Tv } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

export default function SiteSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [dhyeyTvUrl, setDhyeyTvUrl] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "settings", "globalConfig");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setMaintenanceMode(data.maintenanceMode || false);
        setSupportEmail(data.supportEmail || "");
        setSupportPhone(data.supportPhone || "");
        setInstagramUrl(data.instagramUrl || "");
        setFacebookUrl(data.facebookUrl || "");
        setYoutubeUrl(data.youtubeUrl || "");
        setDhyeyTvUrl(data.dhyeyTvUrl || "");
      }
    } catch (err) {
      toast.error("Failed to load settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(
        doc(db, "settings", "globalConfig"),
        { 
          maintenanceMode, 
          supportEmail, 
          supportPhone, 
          instagramUrl, 
          facebookUrl, 
          youtubeUrl,
          dhyeyTvUrl 
        },
        { merge: true }
      );
      toast.success("Global config updated successfully!");
    } catch (error) {
       toast.error("Failed to save config.");
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
    <div style={{ paddingBottom: "100px" }}>
      <div style={{ marginBottom: "var(--space-10)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 4, fontFamily: "Epilogue, sans-serif", textTransform: "uppercase" }}>Settings</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "600px" }}>Synchronize your studio's global configuration and visual identity.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="btn btn-primary" 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 12, 
            padding: "14px 32px", 
            fontWeight: 700, 
            borderRadius: "100px", 
            background: "linear-gradient(135deg, #E8550A, #C9A84C)",
            boxShadow: "0 10px 20px rgba(232, 85, 10, 0.2)"
          }}
        >
          {isSaving ? <Loader2 size={18} className="animate-spin-slow" /> : <Save size={18} />}
          {isSaving ? "Persisting..." : "Save Settings"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-10)" }} className="settings-grid">
        
        {/* VISUAL IDENTITY */}
        <div style={{ 
          background: "rgba(25, 25, 25, 0.4)", 
          backdropFilter: "blur(40px)", 
          padding: "var(--space-8)", 
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(255, 255, 255, 0.03)" 
        }}>
           <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-6)", color: "var(--accent)", fontFamily: "Epilogue, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Visual Identity</h3>
           
           <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
             <div style={{ display: "flex", alignItems: "center", justifyItems: "center", background: "rgba(0,0,0,0.3)", padding: 40, borderRadius: "var(--radius-lg)", border: "1px solid rgba(255,255,255,0.05)" }}>
                {/* Logo Placeholder */}
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", opacity: 0.5 }}>KS</div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#E8550A", boxShadow: "0 0 10px #E8550A" }} />
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#C9A84C", boxShadow: "0 0 10px #C9A84C" }} />
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#131313", border: "1px solid rgba(255,255,255,0.2)" }} />
                </div>
             </div>

             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", background: maintenanceMode ? "rgba(239, 68, 68, 0.1)" : "rgba(255,255,255,0.03)", border: "1px solid", borderColor: maintenanceMode ? "var(--error)" : "rgba(255,255,255,0.05)", borderRadius: "var(--radius-lg)" }}>
               <div>
                  <div style={{ fontWeight: 700, color: maintenanceMode ? "var(--error)" : "var(--text-primary)", fontSize: "1rem" }}>Maintenance Mode</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>Lock the public narrative for updates.</div>
               </div>
               <label className="toggle-switch" style={{ position: "relative", display: "inline-block", width: 50, height: 28 }}>
                 <input type="checkbox" checked={maintenanceMode} onChange={e => setMaintenanceMode(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                 <span style={{ position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: maintenanceMode ? "var(--error)" : "rgba(255,255,255,0.1)", transition: ".4s", borderRadius: 34 }}>
                   <span style={{ position: "absolute", height: 20, width: 20, left: 4, bottom: 4, backgroundColor: "white", transition: ".4s", borderRadius: "50%", transform: maintenanceMode ? "translateX(22px)" : "none" }}></span>
                 </span>
               </label>
             </div>
           </div>
        </div>

        {/* CONTACT INTELLIGENCE */}
        <div style={{ 
          background: "rgba(25, 25, 25, 0.4)", 
          backdropFilter: "blur(40px)", 
          padding: "var(--space-8)", 
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(255, 255, 255, 0.03)" 
        }}>
           <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-6)", color: "var(--accent)", fontFamily: "Epilogue, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact Intelligence</h3>
           
           <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
             <div>
               <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase" }}>Studio Hotline</label>
               <input 
                 type="tel" 
                 value={supportPhone} 
                 onChange={e => setSupportPhone(e.target.value)} 
                 style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)", fontSize: "1rem", outline: "none" }} 
               />
             </div>

             <div>
               <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase" }}>Support Envelope</label>
               <input 
                 type="email" 
                 value={supportEmail} 
                 onChange={e => setSupportEmail(e.target.value)} 
                 style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)", fontSize: "1rem", outline: "none" }} 
               />
             </div>

             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
               <div>
                 <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase" }}>Instagram</label>
                 <input type="url" value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)", fontSize: "0.9rem", outline: "none" }} />
               </div>
               <div>
                 <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase" }}>Facebook</label>
                 <input type="url" value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)", fontSize: "0.9rem", outline: "none" }} />
               </div>
             </div>
           </div>
        </div>

        {/* DHYEY TV */}
        <div style={{ 
          gridColumn: "1 / -1",
          background: "rgba(25, 25, 25, 0.4)", 
          backdropFilter: "blur(40px)", 
          padding: "var(--space-8)", 
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(255, 255, 255, 0.03)" 
        }}>
           <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-4)", color: "var(--accent)", fontFamily: "Epilogue, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Dhyey TV – Live Stream</h3>
           <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "var(--space-6)", maxWidth: 700 }}>
             Update the live broadcast signal IDs here. This directly affects the Dhyey TV theatre experience.
           </p>
           <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase" }}>Stream Identifier / URL</label>
              <input 
                type="text" 
                value={dhyeyTvUrl} 
                onChange={e => setDhyeyTvUrl(e.target.value)} 
                style={{ width: "100%", padding: "14px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "var(--radius-lg)", color: "var(--text-primary)", fontFamily: "monospace", fontSize: "1rem", outline: "none" }} 
              />
           </div>
        </div>

      </div>

      <style>{`
        input:focus { border-bottom-color: var(--accent) !important; }
        @media (max-width: 1000px) {
          .settings-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
