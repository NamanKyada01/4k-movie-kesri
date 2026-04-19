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
    <div>
      <div style={{ marginBottom: "var(--space-8)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>Site Settings</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Global configuration covering SEO tools, maintenance status, and social mapping.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isSaving ? <Loader2 size={16} className="animate-spin-slow" /> : <Save size={16} />}
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }} className="settings-grid">
        
        {/* GENERAL CONF */}
        <div className="card">
           <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-5)", display: "flex", alignItems: "center", gap: 8 }}>
             <Globe size={18} color="var(--accent)" />
             General Configuration
           </h3>
           
           <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
             {/* Maintenance Toggle */}
             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: maintenanceMode ? "rgba(239, 68, 68, 0.1)" : "var(--bg-elevated)", border: "1px solid", borderColor: maintenanceMode ? "var(--error)" : "var(--border)", borderRadius: "var(--radius-md)" }}>
               <div>
                  <div style={{ fontWeight: 600, color: maintenanceMode ? "var(--error)" : "var(--text-primary)", fontSize: "0.9rem" }}>Maintenance Mode</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>Locks the public site and shows a maintenance screen.</div>
               </div>
               <label className="toggle-switch" style={{ position: "relative", display: "inline-block", width: 44, height: 24 }}>
                 <input type="checkbox" checked={maintenanceMode} onChange={e => setMaintenanceMode(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                 <span style={{ position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: maintenanceMode ? "var(--error)" : "var(--border)", transition: ".4s", borderRadius: 34 }}>
                   <span style={{ position: "absolute", height: 18, width: 18, left: 3, bottom: 3, backgroundColor: "white", transition: ".4s", borderRadius: "50%", transform: maintenanceMode ? "translateX(20px)" : "none" }}></span>
                 </span>
               </label>
             </div>

             <div>
               <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>
                 <Mail size={14} /> Global Support Email
               </label>
               <input 
                 type="email" 
                 value={supportEmail} 
                 onChange={e => setSupportEmail(e.target.value)} 
                 style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} 
               />
             </div>

             <div>
               <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>
                 <Phone size={14} /> Global Contact Phone
               </label>
               <input 
                 type="tel" 
                 value={supportPhone} 
                 onChange={e => setSupportPhone(e.target.value)} 
                 style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} 
               />
             </div>
           </div>
        </div>

        {/* SOCIAL LINKS */}
        <div className="card">
           <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-5)", display: "flex", alignItems: "center", gap: 8 }}>
             <Camera size={18} color="var(--accent)" />
             Social Media Links
           </h3>
           
           <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <div>
               <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>
                 <Camera size={14} /> Instagram URL
               </label>
               <input 
                 type="url" 
                 value={instagramUrl} 
                 onChange={e => setInstagramUrl(e.target.value)} 
                 style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} 
                 placeholder="https://instagram.com/..."
               />
             </div>

             <div>
               <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>
                 <LinkIcon size={14} /> Facebook URL
               </label>
               <input 
                 type="url" 
                 value={facebookUrl} 
                 onChange={e => setFacebookUrl(e.target.value)} 
                 style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} 
                 placeholder="https://facebook.com/..."
               />
             </div>

             <div>
               <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>
                 <Video size={14} /> YouTube Channel URL
               </label>
               <input 
                 type="url" 
                 value={youtubeUrl} 
                 onChange={e => setYoutubeUrl(e.target.value)} 
                 style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} 
                 placeholder="https://youtube.com/..."
               />
             </div>
           </div>
        </div>

        {/* DHYEY TV */}
        <div className="card" style={{ gridColumn: "1 / -1" }}>
           <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-5)", display: "flex", alignItems: "center", gap: 8 }}>
             <Tv size={18} color="var(--accent)" />
             Dhyey TV – Live Stream Broadcasting
           </h3>
           <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
             Paste the full YouTube Live watch URL or a YouTube video ID below. This is what will be embedded on the public <strong>/dhyey-tv</strong> page. Update this whenever the stream link changes.
           </p>
           <div>
             <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>
               <Tv size={14} /> YouTube Live URL or Video ID
             </label>
             <input 
               type="url" 
               value={dhyeyTvUrl} 
               onChange={e => setDhyeyTvUrl(e.target.value)} 
               style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontFamily: "monospace", fontSize: "0.85rem" }} 
               placeholder="https://youtu.be/eQuoqPa1XIE"
             />
             <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 6 }}>
               Accepted: full YouTube URL (e.g. <code>https://youtu.be/VIDEO_ID</code>) or just the video ID (e.g. <code>eQuoqPa1XIE</code>)
             </p>
           </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 800px) {
          .settings-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
