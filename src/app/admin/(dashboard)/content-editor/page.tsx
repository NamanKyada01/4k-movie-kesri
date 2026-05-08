"use client";

import { useState, useEffect } from "react";
import { Edit3, Loader2, Save, Plus, Trash2, User, Award, Eye, Heart, Zap, Shield, Camera, Video, MonitorPlay, Users, PackageOpen, Layout, BarChart3, Info, Wrench, Tv, Radio, ClipboardList, ZapOff, Sparkles } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

type TabType = "global" | "stats" | "portfolio" | "about" | "services" | "dhyey-tv" | "home-sections";

export default function ContentEditorPage() {
  const [activeTab, setActiveTab] = useState<TabType>("global");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- Content State ---
  const [globalContent, setGlobalContent] = useState({
    heroTitle: "",
    heroSubtitle: "",
    contactFooterText: "",
    dhyeyTvUrl: "",
  });

  const [stats, setStats] = useState({
    eventsCount: 500,
    resolution: 4,
    rating: 5,
    deliveryHours: 48,
    clientsCount: 500,
    photosDelivered: 10000,
    yearsExperience: 8,
    awardsWon: 50,
    fiveStarReviews: 200,
  });

  const [aboutContent, setAboutContent] = useState({
    aboutText: "",
    values: [] as any[],
    team: [] as any[],
    milestones: [] as any[],
  });

  const [homeSections, setHomeSections] = useState({
    howItWorks: [] as any[],
    highlights: [] as any[],
  });

  const [services, setServices] = useState<any[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>([]);
  const [dhyeyTvSchedule, setDhyeyTvSchedule] = useState<any[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [globalSnap, statsSnap, aboutSnap, servicesSnap, portfolioSnap, dhyeySnap, homeSnap] = await Promise.all([
        getDoc(doc(db, "settings", "globalContent")),
        getDoc(doc(db, "settings", "stats")),
        getDoc(doc(db, "settings", "aboutContent")),
        getDoc(doc(db, "settings", "servicesContent")),
        getDoc(doc(db, "settings", "portfolioContent")),
        getDoc(doc(db, "settings", "dhyeyTvContent")),
        getDoc(doc(db, "settings", "homeSections")),
      ]);

      if (globalSnap.exists()) setGlobalContent(prev => ({ ...prev, ...globalSnap.data() }));
      if (statsSnap.exists()) setStats(prev => ({ ...prev, ...statsSnap.data() }));
      if (aboutSnap.exists()) setAboutContent(prev => ({ ...prev, ...aboutSnap.data() }));
      if (servicesSnap.exists()) setServices(servicesSnap.data().services || []);
      if (portfolioSnap.exists()) setPortfolioProjects(portfolioSnap.data().projects || []);
      if (dhyeySnap.exists()) setDhyeyTvSchedule(dhyeySnap.data().schedule || []);
      if (homeSnap.exists()) setHomeSections(prev => ({ ...prev, ...homeSnap.data() }));

    } catch (err) {
      toast.error("Failed to load content.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        setDoc(doc(db, "settings", "globalContent"), globalContent, { merge: true }),
        setDoc(doc(db, "settings", "stats"), stats, { merge: true }),
        setDoc(doc(db, "settings", "aboutContent"), aboutContent, { merge: true }),
        setDoc(doc(db, "settings", "servicesContent"), { services }, { merge: true }),
        setDoc(doc(db, "settings", "portfolioContent"), { projects: portfolioProjects }, { merge: true }),
        setDoc(doc(db, "settings", "dhyeyTvContent"), { schedule: dhyeyTvSchedule }, { merge: true }),
        setDoc(doc(db, "settings", "homeSections"), homeSections, { merge: true }),
      ]);
      toast.success("All content synchronized successfully!");
    } catch (error) {
       toast.error("Failed to save content.");
       console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // --- List Management Helpers ---
  const addItem = (listKey: string) => {
    switch(listKey) {
      case "services":
        setServices([...services, { title: "New Service", desc: "", features: [], iconName: "Camera" }]);
        break;
      case "portfolio":
        setPortfolioProjects([...portfolioProjects, { id: Date.now().toString(), title: "New Project", category: "wedding", description: "", cloudinaryUrl: "", order: portfolioProjects.length }]);
        break;
      case "dhyey":
        setDhyeyTvSchedule([...dhyeyTvSchedule, { time: "00:00 - 00:00", title: "New Show", category: "Bhajan", day: "Daily" }]);
        break;
      case "team":
        setAboutContent({...aboutContent, team: [...aboutContent.team, { name: "", role: "", bio: "", initials: "" }]});
        break;
      case "values":
        setAboutContent({...aboutContent, values: [...aboutContent.values, { title: "", desc: "", iconName: "Zap" }]});
        break;
      case "milestones":
        setAboutContent({...aboutContent, milestones: [...aboutContent.milestones, { year: "", event: "" }]});
        break;
      case "howItWorks":
        setHomeSections({...homeSections, howItWorks: [...homeSections.howItWorks, { number: "01", title: "New Step", desc: "", icon: "💬", color: "rgba(212,160,23,0.08)" }]});
        break;
      case "highlights":
        setHomeSections({...homeSections, highlights: [...homeSections.highlights, { title: "New Highlight", emoji: "✨", desc: "" }]});
        break;
    }
  };

  const removeItem = (listKey: string, index: number) => {
    switch(listKey) {
      case "services": setServices(services.filter((_, i) => i !== index)); break;
      case "portfolio": setPortfolioProjects(portfolioProjects.filter((_, i) => i !== index)); break;
      case "dhyey": setDhyeyTvSchedule(dhyeyTvSchedule.filter((_, i) => i !== index)); break;
      case "team": setAboutContent({...aboutContent, team: aboutContent.team.filter((_, i) => i !== index)}); break;
      case "values": setAboutContent({...aboutContent, values: aboutContent.values.filter((_, i) => i !== index)}); break;
      case "milestones": setAboutContent({...aboutContent, milestones: aboutContent.milestones.filter((_, i) => i !== index)}); break;
      case "howItWorks": setHomeSections({...homeSections, howItWorks: homeSections.howItWorks.filter((_, i) => i !== index)}); break;
      case "highlights": setHomeSections({...homeSections, highlights: homeSections.highlights.filter((_, i) => i !== index)}); break;
    }
  };

  const updateItem = (listKey: string, index: number, field: string, value: any) => {
    let newList;
    switch(listKey) {
      case "services": 
        newList = [...services]; newList[index][field] = value; setServices(newList); break;
      case "portfolio": 
        newList = [...portfolioProjects]; newList[index][field] = value; setPortfolioProjects(newList); break;
      case "dhyey": 
        newList = [...dhyeyTvSchedule]; newList[index][field] = value; setDhyeyTvSchedule(newList); break;
      case "howItWorks":
        newList = [...homeSections.howItWorks]; newList[index][field] = value; setHomeSections({...homeSections, howItWorks: newList}); break;
      case "highlights":
        newList = [...homeSections.highlights]; newList[index][field] = value; setHomeSections({...homeSections, highlights: newList}); break;
      default:
        newList = [...(aboutContent as any)[listKey]]; newList[index][field] = value; setAboutContent({...aboutContent, [listKey]: newList}); break;
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
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "600px" }}>Orchestrate your studio&apos;s digital narrative with cinematic precision.</p>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div style={{ display: "flex", gap: 8, marginBottom: "var(--space-8)", background: "var(--bg-elevated)", padding: 6, borderRadius: 12, width: "fit-content", flexWrap: "wrap" }}>
        {(["global", "stats", "portfolio", "home-sections", "about", "services", "dhyey-tv"] as TabType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: activeTab === tab ? "var(--accent)" : "transparent",
              color: activeTab === tab ? "white" : "var(--text-muted)",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 8,
              textTransform: "capitalize"
            }}
          >
            {tab === "global" && <Layout size={14} />}
            {tab === "stats" && <BarChart3 size={14} />}
            {tab === "about" && <Info size={14} />}
            {tab === "services" && <Wrench size={14} />}
            {tab === "portfolio" && <Camera size={14} />}
            {tab === "dhyey-tv" && <Tv size={14} />}
            {tab === "home-sections" && <Sparkles size={14} />}
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)", paddingBottom: "120px" }}>
        
        {/* --- GLOBAL TAB --- */}
        {activeTab === "global" && (
          <div className="editor-card">
            <h3 className="editor-section-title">Hero & Master Config</h3>
            <div className="editor-grid">
              <div className="input-group">
                <label>Hero Headline</label>
                <input 
                  type="text" 
                  value={globalContent.heroTitle} 
                  onChange={e => setGlobalContent({...globalContent, heroTitle: e.target.value})} 
                  placeholder="Capture the moment..."
                />
              </div>
              <div className="input-group">
                <label>Hero Subtitle</label>
                <textarea 
                  value={globalContent.heroSubtitle} 
                  onChange={e => setGlobalContent({...globalContent, heroSubtitle: e.target.value})} 
                  rows={2}
                  placeholder="Premium 4K photography..."
                />
              </div>
              <div className="input-group">
                <label>Footer CTA Narrative</label>
                <input 
                  type="text" 
                  value={globalContent.contactFooterText} 
                  onChange={e => setGlobalContent({...globalContent, contactFooterText: e.target.value})} 
                  placeholder="Ready to tell your story?"
                />
              </div>
              <div className="input-group">
                <label>Dhyey TV Stream URL (YouTube)</label>
                <input 
                  type="text" 
                  value={globalContent.dhyeyTvUrl} 
                  onChange={e => setGlobalContent({...globalContent, dhyeyTvUrl: e.target.value})} 
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>
        )}

        {/* --- STATS TAB --- */}
        {activeTab === "stats" && (
          <div className="editor-card">
            <h3 className="editor-section-title">Impact Metrics</h3>
            <div className="stats-editor-grid">
              {[
                { label: "Events Count", key: "eventsCount" },
                { label: "Resolution (K)", key: "resolution" },
                { label: "Avg Rating", key: "rating" },
                { label: "Delivery Hours", key: "deliveryHours" },
                { label: "Clients Count", key: "clientsCount" },
                { label: "Photos Delivered", key: "photosDelivered" },
                { label: "Years Experience", key: "yearsExperience" },
                { label: "Awards Won", key: "awardsWon" },
                { label: "5-Star Reviews", key: "fiveStarReviews" },
              ].map(item => (
                <div key={item.key} className="input-group">
                  <label>{item.label}</label>
                  <input 
                    type="number" 
                    value={(stats as any)[item.key]} 
                    onChange={e => setStats({...stats, [item.key]: Number(e.target.value)})} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- HOME SECTIONS TAB --- */}
        {activeTab === "home-sections" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
             <div className="editor-card">
              <div className="section-header">
                <h3 className="editor-section-title">Process (How It Works)</h3>
                <button className="add-btn" onClick={() => addItem("howItWorks")}><Plus size={14} /> Add Step</button>
              </div>
              <div className="list-grid">
                {homeSections.howItWorks.map((step, i) => (
                  <div key={i} className="list-item-card">
                    <button className="remove-btn" onClick={() => removeItem("howItWorks", i)}><Trash2 size={14} /></button>
                    <input placeholder="Step Number (e.01)" value={step.number} onChange={e => updateItem("howItWorks", i, "number", e.target.value)} />
                    <input placeholder="Step Title" value={step.title} onChange={e => updateItem("howItWorks", i, "title", e.target.value)} />
                    <input placeholder="Emoji Icon" value={step.icon} onChange={e => updateItem("howItWorks", i, "icon", e.target.value)} />
                    <textarea placeholder="Description" value={step.desc} onChange={e => updateItem("howItWorks", i, "desc", e.target.value)} rows={2} />
                  </div>
                ))}
              </div>
            </div>

            <div className="editor-card">
              <div className="section-header">
                <h3 className="editor-section-title">Infinite Highlights (Marquee)</h3>
                <button className="add-btn" onClick={() => addItem("highlights")}><Plus size={14} /> Add Highlight</button>
              </div>
              <div className="list-grid">
                {homeSections.highlights.map((h, i) => (
                  <div key={i} className="list-item-card">
                    <button className="remove-btn" onClick={() => removeItem("highlights", i)}><Trash2 size={14} /></button>
                    <input placeholder="Emoji" value={h.emoji} onChange={e => updateItem("highlights", i, "emoji", e.target.value)} />
                    <input placeholder="Title" value={h.title} onChange={e => updateItem("highlights", i, "title", e.target.value)} />
                    <input placeholder="Subtitle" value={h.desc} onChange={e => updateItem("highlights", i, "desc", e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- PORTFOLIO TAB --- */}
        {activeTab === "portfolio" && (
          <div className="editor-card">
            <div className="section-header">
              <h3 className="editor-section-title">Cinematic Portfolio</h3>
              <button className="add-btn" onClick={() => addItem("portfolio")}><Plus size={14} /> Add Project</button>
            </div>
            <div className="list-grid">
              {portfolioProjects.map((p, i) => (
                <div key={p.id || i} className="list-item-card">
                  <button className="remove-btn" onClick={() => removeItem("portfolio", i)}><Trash2 size={14} /></button>
                  <input placeholder="Project Title" value={p.title} onChange={e => updateItem("portfolio", i, "title", e.target.value)} />
                  <input placeholder="Category (e.g. wedding)" value={p.category} onChange={e => updateItem("portfolio", i, "category", e.target.value)} />
                  <input placeholder="Cloudinary/Image URL" value={p.cloudinaryUrl} onChange={e => updateItem("portfolio", i, "cloudinaryUrl", e.target.value)} />
                  <textarea placeholder="Description" value={p.description} onChange={e => updateItem("portfolio", i, "description", e.target.value)} rows={3} />
                  <input type="number" placeholder="Order" value={p.order} onChange={e => updateItem("portfolio", i, "order", Number(e.target.value))} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ABOUT TAB --- */}
        {activeTab === "about" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
            <div className="editor-card">
              <h3 className="editor-section-title">The Studio Story</h3>
              <textarea 
                value={aboutContent.aboutText} 
                onChange={e => setAboutContent({...aboutContent, aboutText: e.target.value})} 
                rows={6}
                className="big-textarea"
              />
            </div>

            <div className="editor-card">
              <div className="section-header">
                <h3 className="editor-section-title">The Crew</h3>
                <button className="add-btn" onClick={() => addItem("team")}><Plus size={14} /> Add Member</button>
              </div>
              <div className="list-grid">
                {aboutContent.team.map((m, i) => (
                  <div key={i} className="list-item-card">
                    <button className="remove-btn" onClick={() => removeItem("team", i)}><Trash2 size={14} /></button>
                    <input placeholder="Name" value={m.name} onChange={e => updateItem("team", i, "name", e.target.value)} />
                    <input placeholder="Role" value={m.role} onChange={e => updateItem("team", i, "role", e.target.value)} />
                    <input placeholder="Initials (e.g. KP)" value={m.initials} onChange={e => updateItem("team", i, "initials", e.target.value)} />
                    <textarea placeholder="Bio" value={m.bio} onChange={e => updateItem("team", i, "bio", e.target.value)} rows={3} />
                  </div>
                ))}
              </div>
            </div>

            <div className="editor-card">
              <div className="section-header">
                <h3 className="editor-section-title">Core Values</h3>
                <button className="add-btn" onClick={() => addItem("values")}><Plus size={14} /> Add Value</button>
              </div>
              <div className="list-grid">
                {aboutContent.values.map((v, i) => (
                  <div key={i} className="list-item-card">
                    <button className="remove-btn" onClick={() => removeItem("values", i)}><Trash2 size={14} /></button>
                    <input placeholder="Title" value={v.title} onChange={e => updateItem("values", i, "title", e.target.value)} />
                    <select value={v.iconName} onChange={e => updateItem("values", i, "iconName", e.target.value)}>
                      <option value="Eye">Eye (Vision)</option>
                      <option value="Heart">Heart (Passion)</option>
                      <option value="Zap">Zap (Excellence)</option>
                      <option value="Shield">Shield (Reliability)</option>
                    </select>
                    <textarea placeholder="Description" value={v.desc} onChange={e => updateItem("values", i, "desc", e.target.value)} rows={2} />
                  </div>
                ))}
              </div>
            </div>

            <div className="editor-card">
              <div className="section-header">
                <h3 className="editor-section-title">Timeline</h3>
                <button className="add-btn" onClick={() => addItem("milestones")}><Plus size={14} /> Add Milestone</button>
              </div>
              <div className="list-grid">
                {aboutContent.milestones.map((m, i) => (
                  <div key={i} className="list-item-card" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <input placeholder="Year" value={m.year} style={{ width: 80 }} onChange={e => updateItem("milestones", i, "year", e.target.value)} />
                    <textarea placeholder="Event" value={m.event} style={{ flex: 1 }} onChange={e => updateItem("milestones", i, "event", e.target.value)} rows={2} />
                    <button className="remove-btn-inline" onClick={() => removeItem("milestones", i)}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- SERVICES TAB --- */}
        {activeTab === "services" && (
          <div className="editor-card">
            <div className="section-header">
              <h3 className="editor-section-title">The Repository</h3>
              <button className="add-btn" onClick={() => addItem("services")}><Plus size={14} /> Add Service</button>
            </div>
            <div className="list-grid">
              {services.map((s, i) => (
                <div key={i} className="list-item-card">
                  <button className="remove-btn" onClick={() => removeItem("services", i)}><Trash2 size={14} /></button>
                  <input placeholder="Service Title" value={s.title} onChange={e => updateItem("services", i, "title", e.target.value)} />
                  <select value={s.iconName} onChange={e => updateItem("services", i, "iconName", e.target.value)}>
                    <option value="Camera">Camera</option>
                    <option value="Video">Video</option>
                    <option value="Users">Users</option>
                    <option value="MonitorPlay">MonitorPlay</option>
                    <option value="PackageOpen">PackageOpen</option>
                    <option value="Award">Award</option>
                  </select>
                  <textarea placeholder="Description" value={s.desc} onChange={e => updateItem("services", i, "desc", e.target.value)} rows={3} />
                  <input 
                    placeholder="Features (comma separated)" 
                    value={s.features?.join(", ")} 
                    onChange={e => updateItem("services", i, "features", e.target.value.split(",").map((f: string) => f.trim()))} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- DHYEY TV TAB --- */}
        {activeTab === "dhyey-tv" && (
          <div className="editor-card">
            <div className="section-header">
              <h3 className="editor-section-title">॥ ધ્યેય ટીવી ॥ Schedule</h3>
              <button className="add-btn" onClick={() => addItem("dhyey")}><Plus size={14} /> Add Show</button>
            </div>
            <div className="list-grid">
              {dhyeyTvSchedule.map((s, i) => (
                <div key={i} className="list-item-card">
                  <button className="remove-btn" onClick={() => removeItem("dhyey", i)}><Trash2 size={14} /></button>
                  <input placeholder="Time (e.g. 06:00 – 08:00)" value={s.time} onChange={e => updateItem("dhyey", i, "time", e.target.value)} />
                  <input placeholder="Show Title" value={s.title} onChange={e => updateItem("dhyey", i, "title", e.target.value)} />
                  <select value={s.category} onChange={e => updateItem("dhyey", i, "category", e.target.value)}>
                    <option value="Bhajan">Bhajan</option>
                    <option value="Katha">Katha</option>
                    <option value="Dayro">Dayro</option>
                  </select>
                  <input placeholder="Day (e.g. Daily, Mon–Fri)" value={s.day} onChange={e => updateItem("dhyey", i, "day", e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        )}

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
        .editor-card {
          background: rgba(25, 25, 25, 0.4);
          backdrop-filter: blur(40px);
          padding: var(--space-8);
          border-radius: var(--radius-xl);
          border: 1px solid rgba(255, 255, 255, 0.03);
        }
        .editor-section-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: var(--space-6);
          color: var(--accent);
          font-family: Epilogue, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .editor-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .stats-editor-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }
        .input-group label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .input-group input, .input-group textarea, .big-textarea {
          width: 100%;
          padding: 12px 0;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.3s;
          font-size: 1rem;
        }
        .big-textarea {
          padding: 20px;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: var(--radius-lg);
          line-height: 1.8;
          resize: vertical;
        }
        input:focus, textarea:focus {
          border-bottom-color: var(--accent) !important;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
        }
        .add-btn {
          background: var(--accent-muted);
          color: var(--accent);
          border: 1px solid var(--border-accent);
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .list-item-card {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .list-item-card input, .list-item-card textarea, .list-item-card select {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 8px 0;
          outline: none;
          font-size: 0.9rem;
        }
        .list-item-card select {
          background: var(--bg-primary);
        }
        .remove-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          background: var(--error);
          color: white;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .list-item-card:hover .remove-btn {
          opacity: 1;
        }
        .remove-btn-inline {
          background: transparent;
          color: var(--error);
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        @media (max-width: 900px) {
          .stats-editor-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .stats-editor-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
