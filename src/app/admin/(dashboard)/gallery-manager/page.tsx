"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Loader2, Camera, Image as ImageIcon, LayoutGrid, Star } from "lucide-react";
import { useLiveCollection } from "@/hooks/useLiveCollection";
import { orderBy } from "firebase/firestore";
import { GalleryPhoto } from "@/types";
import { deleteGalleryPhoto } from "@/actions/admin";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import GalleryCard from "@/components/invoice/GalleryCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import CreationModal from "@/components/ui/CreationModal";

export default function GalleryManagerPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<GalleryPhoto | null>(null);

  // Real-time synchronization
  const { data: photos, loading } = useLiveCollection<GalleryPhoto>("gallery", [
    orderBy("uploadedAt", "desc")
  ]);

  const stats = useMemo(() => {
    return {
      total: photos.length,
      featured: photos.filter(p => p.isFeatured).length,
      wedding: photos.filter(p => p.category === "wedding").length,
      portrait: photos.filter(p => p.category === "portrait").length,
    };
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    return photos.filter(p => {
        const title = p.title || "";
        const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) || 
                             p.category.toLowerCase().includes(search.toLowerCase());
        const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
        return matchesSearch && matchesCat;
    });
  }, [photos, search, categoryFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this photo from the gallery?")) return;
    const res = await deleteGalleryPhoto(id);
    if (res.success) toast.success("Photo removed successfully");
    else toast.error("Failed to delete photo");
  };

  const handleEdit = (photo: GalleryPhoto) => {
    setEditData(photo);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  if (loading) return (
      <div style={{ height: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
          <Loader2 size={40} className="animate-spin" color="var(--accent)" />
          <p style={{ color: "var(--text-muted)", letterSpacing: "0.1em", fontSize: "0.8rem", textTransform: "uppercase" }}>Loading Gallery...</p>
      </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.5s ease", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.75rem", color: "white", marginBottom: "0.5rem" }}>Gallery Manager</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", letterSpacing: "0.05em" }}>Manage your professional photography portfolio and showcases</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 28px", borderRadius: "12px", fontWeight: 800 }}
        >
          <Plus size={20} /> Add Photos
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "3rem" }}>
        {/* Sidebar: Overview Stats */}
        <div style={{ position: "sticky", top: "2rem", alignSelf: "start" }}>
            <SpotlightCard 
                className="card" 
                style={{ padding: "30px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                spotlightColor="rgba(232, 85, 10, 0.05)"
            >
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "24px", color: "white" }}>Overview</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <StatItem icon={<ImageIcon size={16} />} label="Total Photos" value={stats.total} />
                    <StatItem icon={<Star size={16} />} label="Featured" value={stats.featured} color="var(--accent)" />
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "8px 0" }} />
                    <StatItem label="Weddings" value={stats.wedding} />
                    <StatItem label="Portraits" value={stats.portrait} />
                </div>

                <div style={{ marginTop: "32px", padding: "20px", background: "rgba(232, 85, 10, 0.05)", borderRadius: "12px", border: "1px solid rgba(232, 85, 10, 0.1)" }}>
                    <p style={{ fontSize: "0.75rem", color: "var(--accent)", lineHeight: 1.5, margin: 0 }}>
                        High-quality images uploaded here will appear in the public showcase sections of the website.
                    </p>
                </div>
            </SpotlightCard>
        </div>

        {/* Main: Gallery Grid */}
        <div>
            <div style={{ 
                display: "flex", gap: "1.25rem", marginBottom: "2.5rem",
                padding: "1rem", background: "rgba(255,255,255,0.015)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)"
            }}>
                <div style={{ flex: 1, position: "relative" }}>
                    <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)" }} />
                    <input 
                        placeholder="Search by title or category..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: "100%", background: "transparent", border: "none", padding: "12px 12px 12px 44px", color: "white", outline: "none" }}
                    />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    {["all", "wedding", "portrait", "corporate"].map(cat => (
                        <button 
                            key={cat} onClick={() => setCategoryFilter(cat)}
                            style={{ 
                                background: categoryFilter === cat ? "rgba(255,255,255,0.1)" : "transparent",
                                border: "none", color: categoryFilter === cat ? "white" : "var(--text-muted)",
                                padding: "6px 16px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700,
                                textTransform: "capitalize", letterSpacing: "0.02em", cursor: "pointer"
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {filteredPhotos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "100px 0", color: "var(--text-muted)" }}>
                    <Camera size={48} opacity={0.1} style={{ margin: "0 auto 20px" }} />
                    <p>No photos found in this category.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
                    {filteredPhotos.map(photo => (
                        <GalleryCard 
                            key={photo.id} photo={photo} 
                            onEdit={() => handleEdit(photo)}
                            onDelete={() => handleDelete(photo.id)}
                        />
                    ))}
                </div>
            )}
        </div>
      </div>

      <CreationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type="gallery" 
        editData={editData}
      />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function StatItem({ icon, label, value, color }: { icon?: React.ReactNode, label: string, value: number, color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {icon}
            {label}
        </div>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: color || "white" }}>{value}</div>
    </div>
  );
}
