"use client";
import { useState, useEffect, useMemo } from "react";
import { 
  FileText, Plus, Loader2, Trash2, Edit, Search, 
  ExternalLink, Eye, Clock, LayoutGrid, List, MessageSquare, Sparkles 
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import type { BlogPost } from "@/types";
import { deleteBlogPost, updateBlogPost } from "@/actions/admin";
import { toast } from "sonner";
import CreationModal from "@/components/ui/CreationModal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import CustomAlert from "@/components/ui/CustomAlert";
import { format } from "date-fns";

export default function BlogManagerPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
      setPosts(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter(p => p.status === "published").length;
    const views = posts.reduce((acc, p) => acc + (p.views || 0), 0);
    return { total, published, drafts: total - published, views };
  }, [posts]);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    
    try {
        const res = await deleteBlogPost(id);
        if (res.success) {
            toast.success("Article deleted successfully");
        } else {
            toast.error(res.error || "Failed to delete article");
        }
    } catch (err: any) {
        toast.error("Network or authorization error");
    }
  };

  const toggleStatus = async (post: BlogPost) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    const res = await updateBlogPost(post.id, { 
      status: newStatus,
      ...(newStatus === "published" ? { publishedAt: Date.now() } : {})
    });
    if (res.success) toast.success(`Article set to ${newStatus}`);
    else toast.error(res.error);
  };

  return (
    <div style={pageContainerStyle}>
      {/* Header Section */}
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Blog Manager</h1>
          <p style={subtitleStyle}>Command your studio's organic growth and cinematic storytelling</p>
        </div>
        <button 
          onClick={() => { setEditingPost(null); setIsModalOpen(true); }}
          style={addBtnStyle}
        >
          <Plus size={20} />
          <span style={{ fontWeight: 700 }}>Compose Article</span>
        </button>
      </header>

      {/* Main Layout */}
      <div style={layoutGridStyle}>
        {/* Sidebar: Pulse & Stats */}
        <aside style={sidebarStyle}>
          <SpotlightCard>
            <div style={{ padding: "24px" }}>
              <h2 style={sidebarTitleStyle}>Performance Pulse</h2>
              <div style={statsGridStyle}>
                <div style={statItemStyle}>
                    <p style={statLabelStyle}>Total Stories</p>
                    <p style={statValueStyle}>{stats.total}</p>
                </div>
                <div style={statItemStyle}>
                    <p style={statLabelStyle}>Global Views</p>
                    <p style={statValueStyle}>{stats.views.toLocaleString()}</p>
                </div>
                <div style={statItemStyle}>
                    <p style={statLabelStyle}>Published</p>
                    <p style={{ ...statValueStyle, color: "#10b981" }}>{stats.published}</p>
                </div>
                <div style={statItemStyle}>
                    <p style={statLabelStyle}>Drafts</p>
                    <p style={{ ...statValueStyle, color: "#f59e0b" }}>{stats.drafts}</p>
                </div>
              </div>

              <div style={aiPromoStyle}>
                <div style={{ background: "rgba(232, 85, 10, 0.1)", padding: "12px", borderRadius: "12px", marginBottom: "12px" }}>
                    <Sparkles size={20} color="var(--accent)" />
                </div>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "white" }}>Groq-Powered Authoring</h4>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    Generate SEO-optimized cinematic drafts in seconds using your new AI integration.
                </p>
              </div>
            </div>
          </SpotlightCard>
        </aside>

        {/* Content Area */}
        <main style={mainContentStyle}>
          {/* Search & Filters */}
          <div style={filterBarStyle}>
            <div style={searchWrapperStyle}>
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search articles by title or category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={searchInputStyle}
              />
            </div>
          </div>

          {/* Posts Feed */}
          {isLoading ? (
            <div style={emptyStateStyle}><Loader2 size={32} className="animate-spin" color="var(--accent)" /></div>
          ) : filteredPosts.length === 0 ? (
            <div style={emptyStateStyle}>
              <FileText size={48} color="var(--text-muted)" style={{ opacity: 0.2, marginBottom: "16px" }} />
              <p style={{ color: "var(--text-muted)" }}>No articles matching your criteria.</p>
            </div>
          ) : (
            <div style={listStyle}>
              {filteredPosts.map(post => (
                <div key={post.id} style={postCardStyle}>
                  <div style={postMainInfoStyle}>
                    <div style={postHeaderStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={categoryTagStyle(post.category)}>{post.category}</span>
                            <span style={statusTagStyle(post.status)}>{post.status}</span>
                        </div>
                        <div style={postMetaStyle}>
                            <Clock size={12} /> {format(post.createdAt, 'MMM d, yyyy')}
                        </div>
                    </div>
                    <h3 style={postTitleStyle}>{post.title}</h3>
                    <p style={postExcerptStyle}>{post.excerpt || "No summary provided for this article."}</p>
                    <div style={postFooterInfoStyle}>
                        <div style={postMetricStyle}>
                            <Eye size={14} /> {post.views || 0} Views
                        </div>
                        <div style={postMetricStyle}>
                            <FileText size={14} /> {post.content?.length || 0} chars
                        </div>
                    </div>
                  </div>

                  <div style={postActionsStyle}>
                    <button 
                        onClick={() => toggleStatus(post)} 
                        style={postActionBtnStyle} 
                        title={post.status === 'published' ? 'Set to Draft' : 'Publish Locally'}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button 
                        onClick={() => { setEditingPost(post); setIsModalOpen(true); }} 
                        style={postActionBtnStyle}
                        title="Edit Article"
                    >
                        <Edit size={18} />
                    </button>
                    <button 
                        onClick={() => handleDelete(post.id)} 
                        style={{ ...postActionBtnStyle, color: "#ef4444" }}
                        title="Delete Article"
                    >
                        <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <CreationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="blog"
        editData={editingPost}
      />

      {confirmDeleteId && (
        <CustomAlert
            type="confirm"
            title="Delete Article?"
            message="This action is permanent and will remove the article from the registry."
            primaryActionLabel="Delete"
            secondaryActionLabel="Keep"
            onConfirm={executeDelete}
            onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}

// Styles
const pageContainerStyle: React.CSSProperties = {
  maxWidth: "1400px",
  margin: "0 auto",
  paddingBottom: "100px"
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginBottom: "40px"
};

const titleStyle: React.CSSProperties = {
  fontSize: "2.5rem",
  fontFamily: "var(--font-heading)",
  background: "linear-gradient(to bottom, #fff, #999)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  margin: "0 0 8px 0"
};

const subtitleStyle: React.CSSProperties = {
  color: "var(--text-muted)",
  fontSize: "0.9rem",
  margin: 0
};

const addBtnStyle: React.CSSProperties = {
  background: "var(--accent)",
  color: "white",
  padding: "14px 28px",
  borderRadius: "14px",
  border: "none",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 8px 25px var(--accent-glow)"
};

const layoutGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "320px 1fr",
  gap: "40px",
  alignItems: "start"
};

const sidebarStyle: React.CSSProperties = {
  position: "sticky",
  top: "100px"
};

const sidebarTitleStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "2px",
  marginBottom: "24px",
  fontWeight: 700
};

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px"
};

const statItemStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.05)"
};

const statLabelStyle: React.CSSProperties = {
  fontSize: "0.6rem",
  color: "var(--text-muted)",
  textTransform: "uppercase",
  margin: "0 0 6px 0",
  letterSpacing: "0.5px"
};

const statValueStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  fontWeight: 700,
  color: "white",
  margin: 0
};

const aiPromoStyle: React.CSSProperties = {
    marginTop: "32px",
    padding: "20px",
    background: "rgba(232, 85, 10, 0.05)",
    borderRadius: "20px",
    border: "1px dashed rgba(232, 85, 10, 0.2)"
};

const mainContentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px"
};

const filterBarStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  background: "rgba(255,255,255,0.02)",
  padding: "16px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.05)"
};

const searchWrapperStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: "rgba(0,0,0,0.2)",
  padding: "0 16px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.05)"
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  background: "none",
  border: "none",
  padding: "12px 0",
  color: "white",
  fontSize: "0.9rem",
  outline: "none"
};

const listStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px"
};

const postCardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.02)",
  borderRadius: "24px",
  padding: "24px",
  border: "1px solid rgba(255,255,255,0.05)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "all 0.3s ease"
};

const postMainInfoStyle: React.CSSProperties = {
  flex: 1,
  maxWidth: "80%"
};

const postHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "12px"
};

const postTitleStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  color: "white",
  fontWeight: 600,
  margin: "0 0 8px 0"
};

const postExcerptStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "var(--text-muted)",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden"
};

const postFooterInfoStyle: React.CSSProperties = {
    display: "flex",
    gap: "24px"
};

const postMetricStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.75rem",
    color: "var(--text-muted)"
};

const postMetaStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "var(--text-muted)",
  display: "flex",
  alignItems: "center",
  gap: "6px"
};

const categoryTagStyle = (cat: string): React.CSSProperties => ({
  fontSize: "0.6rem",
  textTransform: "uppercase",
  padding: "4px 10px",
  borderRadius: "100px",
  fontWeight: 800,
  letterSpacing: "1px",
  background: cat === 'news' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
  color: cat === 'news' ? '#60a5fa' : '#a78bfa',
  border: `1px solid ${cat === 'news' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)'}`
});

const statusTagStyle = (status: string): React.CSSProperties => ({
    fontSize: "0.6rem",
    textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: "100px",
    fontWeight: 800,
    letterSpacing: "1px",
    background: status === 'published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
    color: status === 'published' ? '#34d399' : '#fbbf24',
    border: `1px solid ${status === 'published' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
});

const postActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px"
};

const postActionBtnStyle: React.CSSProperties = {
  padding: "10px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: "12px",
  color: "var(--text-muted)",
  cursor: "pointer",
  transition: "all 0.2s ease"
};

const emptyStateStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "100px 0",
  background: "rgba(255,255,255,0.02)",
  borderRadius: "24px",
  border: "1px dashed rgba(255,255,255,0.1)"
};
