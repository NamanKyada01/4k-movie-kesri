"use client";

import { useState, useEffect } from "react";
import { Video, Plus, Loader2, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import type { YouTubeVideo } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export default function YouTubeManagerPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("wedding");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const q = query(collection(db, "youtubeVideos"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as YouTubeVideo[];
      setVideos(data);
    } catch (err) {
      toast.error("Failed to fetch videos.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const extractVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return toast.error("Please provide both URL and title.");

    const videoId = extractVideoId(url);
    if (!videoId) return toast.error("Invalid YouTube URL.");

    setIsSubmitting(true);
    try {
      const newVideo: Omit<YouTubeVideo, "id"> = {
        youtubeId: videoId,
        title,
        url,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        category: category as any,
        featured: true,
        order: videos.length + 1,
        createdAt: Date.now()
      };

      const docRef = await addDoc(collection(db, "youtubeVideos"), newVideo);
      setVideos(prev => [...prev, { id: docRef.id, ...newVideo }]);
      
      toast.success("Video added successfully!");
      setUrl("");
      setTitle("");
      
    } catch (error: any) {
      toast.error("Failed to add video");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this video from your platform?")) return;
    try {
      await deleteDoc(doc(db, "youtubeVideos", id));
      setVideos(p => p.filter(v => v.id !== id));
      toast.success("Video removed successfully");
    } catch (error) {
      toast.error("Failed to delete video");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 4, fontWeight: 800 }}>YouTube Manager</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Embed and arrange cinematic videos from YouTube.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "var(--space-6)" }} className="manager-layout">
        
        {/* Add Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SpotlightCard 
            className="card" 
            style={{ alignSelf: "start", position: "sticky", top: "calc(var(--topbar-height) + 20px)", padding: "var(--space-6)" }}
            spotlightColor="rgba(232, 85, 10, 0.05)"
          >
            <h3 style={{ fontSize: "1.1rem", marginBottom: "var(--space-6)", display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
              <Plus size={18} color="var(--accent)" />
              Add New Video
            </h3>
            
            <form onSubmit={handleAddVideo} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>YouTube URL</label>
                <input 
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Title / Couples Name</label>
                <input 
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Rahul & Priya Wedding Film"
                  required
                  style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", color: "var(--text-primary)", fontSize: "0.85rem", cursor: "pointer" }}
                >
                   <option value="wedding">Wedding Film</option>
                   <option value="pre-wedding">Pre-Wedding</option>
                   <option value="corporate">Corporate Coverage</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: "100%", marginTop: "var(--space-2)", height: 48, fontWeight: 700 }} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <Loader2 size={18} className="animate-spin" /> Processing...
                  </div>
                ) : "Publish Video"}
              </button>
            </form>
          </SpotlightCard>
        </motion.div>

        {/* Videos Grid */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{ minHeight: 600, padding: "var(--space-6)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-8)" }}>
             <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Current Videos ({videos.length})</h3>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 16 }}>
              <Loader2 size={40} className="animate-spin" color="var(--accent)" style={{ opacity: 0.8 }} />
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Synchronizing video feed...</p>
            </div>
          ) : videos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)", background: "rgba(255,255,255,0.01)", borderRadius: "var(--radius-xl)", border: "1px dashed var(--border)" }}>
              <Video size={48} style={{ margin: "0 auto 16px", opacity: 0.2 }} />
              <p style={{ fontSize: "1rem" }}>Your cinematic vault is currently empty.</p>
              <p style={{ fontSize: "0.8rem", marginTop: 8 }}>Embed YouTube links to showcase your wedding films.</p>
            </div>
          ) : (
            <motion.div 
              layout
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "var(--space-6)" }}
            >
              <AnimatePresence mode="popLayout">
                {videos.map((video, idx) => (
                  <motion.div 
                    key={video.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: Math.min(idx * 0.05, 1) }}
                  >
                    <SpotlightCard 
                      className="card" 
                      style={{ padding: 0, overflow: "hidden", border: "1px solid var(--border)" }}
                      spotlightColor="rgba(255, 255, 255, 0.05)"
                    >
                      <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                        <img 
                          src={video.thumbnail!} 
                          alt={video.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                        />
                        <div style={{ position: "absolute", top: 12, right: 12 }}>
                           <span className="badge badge-accent" style={{ textTransform: "capitalize", fontSize: "0.65rem", padding: "4px 10px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>{video.category}</span>
                        </div>
                      </div>
                      <div style={{ padding: "var(--space-4)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.01)" }}>
                        <div style={{ fontWeight: 600, fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-primary)" }}>
                          {video.title}
                        </div>
                        <button 
                          onClick={() => handleDelete(video.id)}
                          style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4, transition: "all 0.2s ease" }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--error)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .manager-layout { grid-template-columns: 1fr !important; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
