"use client";

import { useState, useEffect } from "react";
import { Camera, ImagePlus, Loader2, Trash2, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import type { GalleryPhoto } from "@/types";
import { toast } from "sonner";
import Image from "next/image";

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
      // 1. Upload to Cloudinary via our secure API
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

      // 2. Save metadata to Firestore for each uploaded image
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
      // Reset file input visually
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
    
    // In a full production app, you would also trigger a server-side route
    // to call cloudinary.uploader.destroy(publicId) to save storage space.
    try {
      await deleteDoc(doc(db, "gallery", id));
      setPhotos(p => p.filter(photo => photo.id !== id));
      toast.success("Photo removed from database");
    } catch (error) {
      toast.error("Failed to delete photo");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>Gallery Manager</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Upload and manage public portfolio images.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "var(--space-6)" }} className="manager-layout">
        
        {/* Upload Form */}
        <div className="card" style={{ alignSelf: "start", position: "sticky", top: "calc(var(--nav-height) + 20px)" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-5)", display: "flex", alignItems: "center", gap: 8 }}>
            <ImagePlus size={18} color="var(--accent)" />
            Bulk Upload
          </h3>
          
          <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Files (Multiple Allowed)</label>
              <input 
                id="file-upload"
                type="file" 
                multiple 
                accept="image/*"
                onChange={e => setSelectedFiles(e.target.files)}
                style={{ width: "100%", padding: 10, background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border)", cursor: "pointer" }}
                disabled={isUploading}
              />
              {selectedFiles && selectedFiles.length > 0 && (
                <div style={{ fontSize: "0.75rem", color: "var(--success)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle2 size={12} /> {selectedFiles.length} file(s) selected
                </div>
              )}
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}
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

            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
              <input 
                type="checkbox" 
                id="featured" 
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                disabled={isUploading}
              />
              <label htmlFor="featured" style={{ fontSize: "0.85rem", cursor: "pointer" }}>Feature on Homepage?</label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "var(--space-2)" }} disabled={isUploading || !selectedFiles}>
              {isUploading ? <><Loader2 size={16} className="animate-spin-slow" /> Uploading...</> : "Upload to Server"}
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
            <h3 style={{ fontSize: "1rem" }}>Current Gallery ({photos.length})</h3>
            <div style={{ display: "flex", gap: 8 }}>
               <span className="badge badge-accent">Filter: All</span>
            </div>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-10)" }}>
              <Loader2 size={32} className="animate-spin-slow" color="var(--text-muted)" />
            </div>
          ) : photos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-muted)", background: "var(--bg-elevated)", borderRadius: "var(--radius-lg)" }}>
              <Camera size={32} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
              <p>No photos uploaded yet.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
              {photos.map(photo => (
                <div key={photo.id} className="card" style={{ position: "relative", aspectRatio: "1/1", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border)", padding: 0 }}>
                  <img 
                    src={photo.cloudinaryUrl} 
                    alt={photo.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                  <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>
                    {photo.featured && <span className="badge badge-gold" style={{ fontSize: "0.6rem", padding: "2px 6px" }}>★</span>}
                  </div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 8, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.7rem", color: "white", textTransform: "capitalize", fontWeight: 600 }}>{photo.category}</span>
                    <button 
                      onClick={() => handleDelete(photo.id, photo.cloudinaryPublicId)}
                      style={{ background: "rgba(239, 68, 68, 0.2)", border: "none", color: "var(--error)", padding: 6, borderRadius: "var(--radius-md)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      title="Delete Photo"
                    >
                      <Trash2 size={14} />
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
