import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase-admin";
import { CinemaBackground } from "@/components/layout/CinemaBackground";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { BlogPost } from "@/types";
import Link from "next/link";
import { ArrowLeft, Clock, User, Share2 } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const snap = await adminDb.collection("blogPosts").where("slug", "==", slug).limit(1).get();
  if (snap.empty) return { title: "Article Not Found" };
  const post = snap.docs[0].data() as BlogPost;
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const snap = await adminDb.collection("blogPosts").where("slug", "==", slug).limit(1).get();
  
  if (snap.empty) {
    notFound();
  }

  const post = { id: snap.docs[0].id, ...snap.docs[0].data() } as BlogPost;

  return (
    <>
      <CinemaBackground theme={{ primary: "sepia", secondary: "amber" }} />
      
      {/* Header / Hero */}
      <section style={{ position: "relative", minHeight: "70vh", display: "flex", alignItems: "flex-end", paddingBottom: "var(--space-12)" }}>
        {post.coverImage && (
          <div style={{ position: "absolute", inset: 0, zIndex: -1 }}>
             <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
             <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 0%, var(--bg) 100%)" }} />
          </div>
        )}
        
        <div className="container">
          <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--accent)", textDecoration: "none", marginBottom: "var(--space-6)", fontSize: "0.9rem", fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Journal
          </Link>
          
          <ScrollReveal>
            <span style={{ fontSize: "0.8rem", color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 800, display: "block", marginBottom: "var(--space-2)" }}>
              {post.category}
            </span>
            <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", lineHeight: 1.1, maxWidth: 900, marginBottom: "var(--space-6)" }}>
              {post.title}
            </h1>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                 <User size={16} /> {post.authorName || "Principal Photographer"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                 <Clock size={16} /> {new Date(post.createdAt || Date.now()).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Content */}
      <section style={{ paddingBottom: "var(--space-20)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <ScrollReveal delay={0.2}>
             <div 
               className="blog-content"
               dangerouslySetInnerHTML={{ __html: post.content }} 
               style={{ 
                 fontSize: "1.15rem", 
                 lineHeight: 1.8, 
                 color: "var(--text-secondary)",
                 fontFamily: "var(--font-body)"
               }}
             />
             
             {/* Footer Actions */}
             <footer style={{ marginTop: "var(--space-12)", paddingTop: "var(--space-8)", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  {post.tags?.map(tag => (
                    <span key={tag} style={{ fontSize: "0.75rem", background: "var(--bg-elevated)", padding: "4px 12px", borderRadius: "100px", color: "var(--text-muted)" }}>
                      #{tag}
                    </span>
                  ))}
                </div>
                <button style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                  <Share2 size={16} /> Share Story
                </button>
             </footer>
          </ScrollReveal>
        </div>
      </section>

      <style>{`
        .blog-content h2 { color: white; margin-top: 2.5rem; margin-bottom: 1.25rem; font-size: 1.8rem; }
        .blog-content h3 { color: white; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.4rem; }
        .blog-content p { margin-bottom: 1.5rem; }
        .blog-content ul, .blog-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
        .blog-content li { margin-bottom: 0.5rem; }
        .blog-content strong { color: white; font-weight: 700; }
        .blog-content blockquote { border-left: 4px solid var(--accent); padding-left: 1.5rem; margin: 2rem 0; font-style: italic; color: white; }
      `}</style>
    </>
  );
}
