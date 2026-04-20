"use client";

import React, { useState, useMemo } from "react";
import { Video, Plus, Loader2, Trash2, Search, Film } from "lucide-react";
import { useLiveCollection } from "@/hooks/useLiveCollection";
import { orderBy } from "firebase/firestore";
import { YouTubeVideo } from "@/types";
import { createYouTubeVideo, deleteYouTubeVideo } from "@/actions/admin";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import TiltedCard from "@/components/ui/TiltedCard";

export default function YouTubeManagerPage() {
  const [search, setSearch] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("wedding");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time synchronization
  const { data: videos, loading } = useLiveCollection<YouTubeVideo>("youtubeVideos", [
    orderBy("order", "asc")
  ]);

  const filteredVideos = useMemo(() => {
    return videos.filter(v => 
        v.title.toLowerCase().includes(search.toLowerCase()) || 
        v.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [videos, search]);

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
      const res = await createYouTubeVideo({
        youtubeId: videoId,
        title,
        url,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        category: category as any,
        featured: true,
        order: videos.length + 1,
      });

      if (res.success) {
          toast.success("Cinematic production published!");
          setUrl("");
          setTitle("");
      } else {
          throw new Error(res.error);
      }
    } catch (error: any) {
      toast.error("Deployment failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently remove this production from the cinematic vault?")) return;
    const res = await deleteYouTubeVideo(id);
    if (res.success) toast.success("Production archived");
    else toast.error("Purge failed");
  };

  if (loading) return (
      <div style={{ height: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
          <Loader2 size={40} className="animate-spin" color="var(--accent)" />
          <p style={{ color: "var(--text-muted)", letterSpacing: "0.1em", fontSize: "0.8rem", textTransform: "uppercase" }}>Synchronizing Reels...</p>
      </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.5s ease", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.75rem", color: "white", marginBottom: "0.5rem" }}>The Cinema</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", letterSpacing: "0.05em" }}>Curate and sequence your high-fidelity cinematic productions</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "3rem" }}>
        {/* Sidebar: New Entry */}
        <div style={{ position: "sticky", top: "2rem", alignSelf: "start" }}>
            <SpotlightCard 
                className="card" 
                style={{ padding: "30px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                spotlightColor="rgba(232, 85, 10, 0.05)"
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                    <Plus size={20} color="var(--accent)" />
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>Deploy Reel</h3>
                </div>

                <form onSubmit={handleAddVideo} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>YouTube URL</label>
                        <input 
                            type="url" value={url} onChange={e => setUrl(e.target.value)}
                            placeholder="https://youtube.com/..."
                            style={{ 
                                width: "100%", padding: "14px", 
                                background: "rgba(255,255,255,0.03)", 
                                borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)",
                                fontSize: "0.85rem", color: "white"
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Production Title</label>
                        <input 
                            type="text" value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Rahul & Priya"
                            style={{ 
                                width: "100%", padding: "14px", 
                                background: "rgba(255,255,255,0.03)", 
                                borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)",
                                fontSize: "0.85rem", color: "white"
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Category Sector</label>
                        <select 
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px", color: "white" }}
                        >
                            <option value="wedding">Wedding Film</option>
                            <option value="pre-wedding">Pre-Wedding</option>
                            <option value="corporate">Corporate</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting || !url}
                        className="btn btn-primary"
                        style={{ padding: "16px", borderRadius: "12px", fontWeight: 800 }}
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Publish to Cinema"}
                    </button>
                </form>
            </SpotlightCard>
        </div>

        {/* Main: Video Grid */}
        <div>
            <div style={{ 
                display: "flex", gap: "1.25rem", marginBottom: "2.5rem",
                padding: "1rem", background: "rgba(255,255,255,0.015)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)"
            }}>
                <div style={{ flex: 1, position: "relative" }}>
                    <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)" }} />
                    <input 
                        placeholder="Search cinema archives..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: "100%", background: "transparent", border: "none", padding: "12px 12px 12px 44px", color: "white", outline: "none" }}
                    />
                </div>
            </div>

            {filteredVideos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "100px 0", color: "var(--text-muted)" }}>
                    <Film size={48} opacity={0.1} style={{ margin: "0 auto 20px" }} />
                    <p>No cinematic reels discovered in this segment.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
                    <AnimatePresence>
                        {filteredVideos.map((video, idx) => (
                            <motion.div
                                key={video.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                            >
                                <TiltedCard>
                                    <div style={{
                                        width: "100%",
                                        borderRadius: "20px",
                                        overflow: "hidden",
                                        background: "rgba(255,255,255,0.02)",
                                        border: "1px solid rgba(255,255,255,0.05)"
                                    }}>
                                        <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                                            <img 
                                                src={video.thumbnail!} 
                                                alt={video.title}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                            <div style={{ position: "absolute", bottom: 12, right: 12 }}>
                                                <div style={{ background: "var(--accent)", color: "black", padding: "4px 10px", borderRadius: "6px", fontSize: "0.6rem", fontWeight: 800 }}>
                                                    {video.category.toUpperCase()}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "180px" }}>
                                                {video.title}
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(video.id)}
                                                style={{ background: "rgba(255,0,0,0.05)", border: "1px solid rgba(255,0,0,0.1)", color: "#ff4444", padding: "8px", borderRadius: "8px", cursor: "pointer" }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </TiltedCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
