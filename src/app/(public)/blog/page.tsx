import type { Metadata } from "next";

import { adminDb } from "@/lib/firebase-admin";
import { CinemaBackground } from "@/components/layout/CinemaBackground";
import type { BlogPost } from "@/types";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Journal & Blog",
  description: "Photography tips, wedding planning advice, and stories from 4K Movie Kesri Surat.",
};

export const revalidate = 60;

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    const snap = await adminDb.collection("blogPosts")
      .where("status", "==", "published")
      .orderBy("createdAt", "desc")
      .get();
    
    posts = snap.docs.map(d => ({ id: d.id, ...d.data() })) as BlogPost[];
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }

  return (
    <>
      <CinemaBackground theme={{ primary: "sepia", secondary: "amber" }} />
      <section className="section" style={{ background: "transparent", paddingTop: "clamp(8rem, 15vh, 12rem)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 800 }}>
          <ScrollReveal>
            <span style={{ fontSize: "0.8rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
              Journal
            </span>
            <h1 style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-5)" }}>
              News & Stories
            </h1>
            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Read the latest updates from our studio, tips for preparing for your photoshoot, and deep dives into our favorite lighting techniques.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <ScrollReveal delay={0.2}>
            {posts.length === 0 ? (
               <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-muted)" }}>
                 <p>More articles coming soon.</p>
               </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-6)" }}>
                {posts.map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`}
                    style={{ 
                      background: "var(--bg-card)",
                      borderRadius: "var(--radius-xl)",
                      border: "1px solid var(--border)",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                      display: "block"
                    }}
                    className="blog-card"
                  >
                    <div style={{ aspectRatio: "16/10", background: "var(--bg-elevated)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                       <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
                       <span style={{ fontSize: "2rem", opacity: 0.2 }}>📰</span>
                    </div>
                    <div style={{ padding: "var(--space-5)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "capitalize" }}>
                        <span className="badge badge-accent">{post.category}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-3)", lineHeight: 1.4, color: "var(--text-primary)" }}>
                        {post.title}
                      </h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
                        {post.excerpt}
                      </p>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        Read Post →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      <style>{`
        .blog-card:hover { transform: translateY(-4px); border-color: var(--accent); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
      `}</style>
    </>
  );
}
