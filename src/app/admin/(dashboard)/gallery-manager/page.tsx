"use client";

import { useState, useEffect } from "react";
import { Camera, ImagePlus, Loader2, Trash2, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import type { GalleryPhoto } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export default function GalleryManagerPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [category, setCategory] = useState("wedding");
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as GalleryPhoto[];
      setPhotos(data);
    } catch (err) {
      toast.error("Failed to fetch gallery photos.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      return toast.error("Please select at least one file.");
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      Array.from(selectedFiles).forEach(file => {
        formData.append("file", file);
      });
      formData.append("folder", "4kmoviekesri-gallery");

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Failed to upload to Cloudinary");
      }

      const newPhotos: GalleryPhoto[] = [];
      const timestamp = Date.now();

      for (const result of uploadData.results) {
        const photoData: Omit<GalleryPhoto, "id"> = {
          cloudinaryUrl: result.secure_url,
          cloudinaryPublicId: result.public_id,
          title: `Upload_${timestamp}`,
          category: category as any,
          featured: isFeatured,
          tags: [category],
          width: result.width,
          height: result.height,
          uploadedAt: timestamp,
        };

        const docRef = await addDoc(collection(db, "gallery"), photoData);
        newPhotos.push({ id: docRef.id, ...photoData });
      }

      toast.success(`Successfully uploaded ${newPhotos.length} images!`);
      setPhotos(prev => [...newPhotos, ...prev]);
      setSelectedFiles(null);
      (document.getElementById("file-upload") as HTMLInputElement).value = "";

    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, publicId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    try {
      await deleteDoc(doc(db, "gallery", id));
      setPhotos(p => p.filter(photo => photo.id !== id));
      toast.success("Photo removed from database");
    } catch (error) {
      toast.error("Failed to delete photo");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 4, fontWeight: 800 }}>Gallery Manager</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Upload and manage public portfolio images.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "var(--space-6)" }} className="manager-layout">
        
        {/* Upload Form */}
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
              <ImagePlus size={18} color="var(--accent)" />
              Bulk Upload
            </h3>
            
            <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Files (Multiple Allowed)</label>
                <input 
                  id="file-upload"
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={e => setSelectedFiles(e.target.files)}
                  style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border)", cursor: "pointer", fontSize: "0.8rem" }}
                  disabled={isUploading}
                />
                {selectedFiles && selectedFiles.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ fontSize: "0.75rem", color: "var(--success)", marginTop: 8, display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}
                  >
                    <CheckCircle2 size={14} /> {selectedFiles.length} file(s) ready for upload
                  </motion.div>
                )}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", color: "var(--text-primary)", fontSize: "0.85rem", cursor: "pointer" }}
                  disabled={isUploading}
                >
                  <option value="wedding">Wedding</option>
                  <option value="engagement">Engagement</option>
                  <option value="portrait">Portrait</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="product">Product & Commercial</option>
                  <option value="event">Other Event</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }}>
                <input 
                  type="checkbox" 
                  id="featured" 
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  disabled={isUploading}
                  style={{ width: 16, height: 16, accentColor: "var(--accent)" }}
                />
                <label htmlFor="featured" style={{ fontSize: "0.88rem", cursor: "pointer", color: "var(--text-secondary)" }}>Feature on Homepage?</label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: "100%", marginTop: "var(--space-2)", height: 48, fontWeight: 700 }} 
                disabled={isUploading || !selectedFiles}
              >
                {isUploading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <Loader2 size={18} className="animate-spin" /> Uploading...
                  </div>
                ) : "Start Upload"}
              </button>
            </form>
          </SpotlightCard>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{ minHeight: 600, padding: "var(--space-6)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-8)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Current Gallery ({photos.length})</h3>
            <div style={{ display: "flex", gap: 8 }}>
               <span className="badge badge-accent" style={{ padding: "4px 12px" }}>Filter: All</span>
            </div>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 16 }}>
              <Loader2 size={40} className="animate-spin" color="var(--accent)" style={{ opacity: 0.8 }} />
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Synchronizing portfolio...</p>
            </div>
          ) : photos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)", background: "rgba(255,255,255,0.01)", borderRadius: "var(--radius-xl)", border: "1px dashed var(--border)" }}>
              <Camera size={48} style={{ margin: "0 auto 16px", opacity: 0.2 }} />
              <p style={{ fontSize: "1rem" }}>No photos discovered in the vault.</p>
              <p style={{ fontSize: "0.8rem", marginTop: 8 }}>Use the bulk upload portal to start building your gallery.</p>
            </div>
          ) : (
            <motion.div 
              layout
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--space-4)" }}
            >
              <AnimatePresence mode="popLayout">
                {photos.map((photo, idx) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: Math.min(idx * 0.05, 1) }}
                  >
                    <SpotlightCard
                      className="card"
                      style={{ position: "relative", aspectRatio: "1/1", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border)", padding: 0 }}
                      spotlightColor="rgba(255, 255, 255, 0.1)"
                    >
                      <img 
                        src={photo.cloudinaryUrl} 
                        alt={photo.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                        loading="lazy"
                      />
                      <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 4, zIndex: 2 }}>
                        {photo.featured && (
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="badge badge-gold" 
                            style={{ fontSize: "0.6rem", padding: "4px 8px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
                          >
                            FEATURED
                          </motion.span>
                        )}
                      </div>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 12, background: "linear-gradient(transparent, rgba(0,0,0,0.9))", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
                        <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>{photo.category}</span>
                        <button 
                          onClick={() => handleDelete(photo.id, photo.cloudinaryPublicId)}
                          style={{ background: "rgba(239, 68, 68, 0.2)", border: "none", color: "var(--error)", width: 28, height: 28, borderRadius: "var(--radius-md)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", transition: "all 0.2s ease" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--error)"; e.currentTarget.style.color = "white"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"; e.currentTarget.style.color = "var(--error)"; }}
                          title="Delete Photo"
                        >
                          <Trash2 size={14} />
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
