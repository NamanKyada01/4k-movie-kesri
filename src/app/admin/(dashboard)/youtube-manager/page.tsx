"use client";

import { useState, useEffect } from "react";
import { Youtube, Plus, Loader2, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import type { YouTubeVideo } from "@/types";
import { toast } from "sonner";

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

  // Extract Youtube ID from any youtube url
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
    <div>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>YouTube Manager</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Embed and arrange cinematic videos from YouTube.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "var(--space-6)" }} className="manager-layout">
        
        {/* Add Form */}
        <div className="card" style={{ alignSelf: "start", position: "sticky", top: "calc(var(--nav-height) + 20px)" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-5)", display: "flex", alignItems: "center", gap: 8 }}>
            <Plus size={18} color="var(--accent)" />
            Add New Video
          </h3>
          
          <form onSubmit={handleAddVideo} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>YouTube URL</label>
              <input 
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                required
                style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Title / Couples Name</label>
              <input 
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Rahul & Priya Wedding Film"
                required
                style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}
              >
                 <option value="wedding">Wedding Film</option>
                 <option value="pre-wedding">Pre-Wedding</option>
                 <option value="corporate">Corporate Coverage</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "var(--space-2)" }} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 size={16} className="animate-spin-slow" /> Adding...</> : "Add Video"}
            </button>
          </form>
        </div>

        {/* Videos Grid */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
             <h3 style={{ fontSize: "1rem" }}>Current Videos ({videos.length})</h3>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-10)" }}>
              <Loader2 size={32} className="animate-spin-slow" color="var(--text-muted)" />
            </div>
          ) : videos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-muted)", background: "var(--bg-elevated)", borderRadius: "var(--radius-lg)" }}>
              <Youtube size={32} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
              <p>No videos added yet.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--space-5)" }}>
              {videos.map(video => (
                <div key={video.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ position: "relative", aspectRatio: "16/9" }}>
                    <img 
                      src={video.thumbnail!} 
                      alt={video.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", top: 8, right: 8 }}>
                       <span className="badge badge-accent" style={{ textTransform: "capitalize" }}>{video.category}</span>
                    </div>
                  </div>
                  <div style={{ padding: "var(--space-3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {video.title}
                    </div>
                    <button 
                      onClick={() => handleDelete(video.id)}
                      style={{ background: "transparent", border: "none", color: "var(--error)", cursor: "pointer" }}
                    >
                      <Trash2 size={16} />
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
