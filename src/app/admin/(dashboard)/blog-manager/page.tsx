"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Loader2, Trash2, Edit } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from "firebase/firestore";
import type { BlogPost } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function BlogManagerPage() {
  const { adminData, user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("news");
  const [status, setStatus] = useState("draft");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as BlogPost[];
      setPosts(data);
    } catch (err) {
      toast.error("Failed to fetch blog posts.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !slug) return toast.error("Please fill required fields.");

    setIsSubmitting(true);
    try {
      const isPublished = status === "published";
      const newPost: Omit<BlogPost, "id"> = {
        title,
        slug,
        excerpt,
        content,
        category,
        authorId: user?.uid || "admin",
        authorName: adminData?.name || "Admin",
        status: status as any,
        tags: [],
        views: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...(isPublished && { publishedAt: Date.now() })
      };

      const docRef = await addDoc(collection(db, "blogPosts"), newPost);
      setPosts(prev => [{ id: docRef.id, ...newPost }, ...prev]);
      
      toast.success("Blog post saved!");
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setStatus("draft");
      
    } catch (error) {
       toast.error("Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const updatePayload: any = { status: newStatus, updatedAt: Date.now() };
      if (newStatus === "published") {
        updatePayload.publishedAt = Date.now();
      }
      await updateDoc(doc(db, "blogPosts", id), updatePayload);
      setPosts(p => p.map(post => post.id === id ? { ...post, ...updatePayload } : post));
      toast.success("Status updated");
    } catch (error) {
       toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, "blogPosts", id));
      setPosts(p => p.filter(post => post.id !== id));
      toast.success("Post deleted");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>Blog Manager</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Publish articles and updates to drive organic SEO traffic.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-6)" }} className="manager-layout">
        
        {/* Editor Form */}
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-5)", display: "flex", alignItems: "center", gap: 8 }}>
            <Plus size={18} color="var(--accent)" />
            Create New Post
          </h3>
          
          <form onSubmit={handleAddPost} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-4)" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Post Title</label>
                <input type="text" value={title} onChange={handleTitleChange} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontSize: "1rem" }} placeholder="e.g. 10 Best Photo Locations in Surat" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>URL Slug (Auto-generated)</label>
                <input type="text" value={slug} onChange={e => setSlug(e.target.value)} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-muted)", fontSize: "0.85rem" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}>
                  <option value="news">Company News</option>
                  <option value="tips">Photography Tips</option>
                  <option value="weddings">Wedding Guides</option>
                  <option value="equipment">Gear / Equipment</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Initial Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}>
                  <option value="draft">Save as Draft</option>
                  <option value="published">Publish Immediately</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Excerpt (Short description for SEO & cards)</label>
              <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", resize: "vertical" }} placeholder="In this article, we explore..." />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Content (HTML / Text)</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={12} required style={{ width: "100%", padding: "14px", background: "var(--bg-elevated)", border: "1px dashed var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontFamily: "monospace", fontSize: "0.85rem", resize: "vertical", lineHeight: 1.5 }} placeholder="<h2>Section 1</h2><p>Write your blog post here...</p>" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "200px", alignSelf: "flex-end" }} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 size={16} className="animate-spin-slow" /> Saving...</> : "Save Post"}
            </button>
          </form>
        </div>

        {/* Posts Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <h3 style={{ fontSize: "1rem", margin: 0 }}>All Posts ({posts.length})</h3>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-10)" }}>
              <Loader2 size={32} className="animate-spin-slow" color="var(--text-muted)" />
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-muted)" }}>
               <FileText size={32} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
               <p>No blog posts created yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>Title</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>Category</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>Views</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>Status</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "var(--space-4)" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{post.title}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2 }}>/{post.slug}</div>
                      </td>
                      <td style={{ padding: "var(--space-4)", textTransform: "capitalize", color: "var(--text-secondary)" }}>{post.category}</td>
                      <td style={{ padding: "var(--space-4)", color: "var(--text-secondary)" }}>{post.views || 0}</td>
                      <td style={{ padding: "var(--space-4)" }}>
                        <select 
                          value={post.status}
                          onChange={(e) => handleUpdateStatus(post.id, e.target.value)}
                          style={{ padding: "4px 8px", background: post.status === "published" ? "rgba(16, 185, 129, 0.1)" : "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: post.status === "published" ? "rgb(16, 185, 129)" : "var(--text-secondary)", fontSize: "0.75rem", fontWeight: post.status === "published" ? 600 : 400 }}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </td>
                      <td style={{ padding: "var(--space-4)", textAlign: "right" }}>
                        <button onClick={() => handleDelete(post.id)} style={{ background: "transparent", border: "none", color: "var(--error)", cursor: "pointer", padding: "4px" }} title="Delete Post">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
