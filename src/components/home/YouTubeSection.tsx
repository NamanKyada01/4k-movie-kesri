"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { YouTubeVideo } from "@/types";

interface YouTubeSectionProps {
  videos: YouTubeVideo[];
}

// Empty state — shown when no videos added yet
function EmptyVideoGrid() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "var(--space-16) var(--space-6)",
        border: "1px dashed var(--border)",
        borderRadius: "var(--radius-2xl)",
        color: "var(--text-muted)",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>🎬</div>
      <h3 style={{ fontSize: "1.1rem", color: "var(--text-secondary)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-2)" }}>
        Coming Soon
      </h3>
      <p style={{ fontSize: "0.85rem" }}>
        Cinematic highlights from our events will appear here soon.
      </p>
    </div>
  );
}

// Single video card
function VideoCard({ video, index }: { video: YouTubeVideo; index: number }) {
  const handlePlay = () => {
    window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, "_blank");
  };

  const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={handlePlay}
      style={{
        position: "relative",
        aspectRatio: "16/9",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        cursor: "pointer",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
      className="group video-card"
    >
      {/* Thumbnail */}
      <img
        src={thumbnailUrl}
        alt={video.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.4s ease, filter 0.4s ease",
        }}
        onMouseEnter={(e) => {
          const img = e.currentTarget;
          img.style.transform = "scale(1.05)";
          img.style.filter = "brightness(0.7)";
        }}
        onMouseLeave={(e) => {
          const img = e.currentTarget;
          img.style.transform = "scale(1)";
          img.style.filter = "brightness(0.5)";
        }}
        onLoad={(e) => {
          (e.currentTarget as HTMLImageElement).style.filter = "brightness(0.5)";
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Play button */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-accent)",
          transition: "transform var(--transition-base)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translate(-50%, -50%) scale(1.15)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translate(-50%, -50%) scale(1)";
        }}
      >
        <Play size={20} fill="white" color="white" style={{ marginLeft: 2 }} />
      </div>

      {/* Duration badge */}
      {video.duration && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.75)",
            borderRadius: "var(--radius-md)",
            padding: "2px 8px",
            fontSize: "0.72rem",
            fontFamily: "var(--font-mono)",
            color: "white",
          }}
        >
          {video.duration}
        </div>
      )}

      {/* Category badge */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
        }}
      >
        <span className="badge badge-accent" style={{ fontSize: "0.62rem", textTransform: "capitalize" }}>
          {video.category}
        </span>
      </div>

      {/* Bottom: title */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "var(--space-4)" }}>
        <h4 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff", lineHeight: 1.3, margin: 0 }}>
          {video.title}
        </h4>
      </div>
    </motion.div>
  );
}

export function YouTubeSection({ videos }: YouTubeSectionProps) {
  return (
    <section className="section" style={{ background: "var(--bg-primary)" }}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: "var(--space-10)" }}
        >
          <span style={{ fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
            In Motion
          </span>
          <h2 style={{ marginTop: "var(--space-2)" }}>
            Cinematic Highlights
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "var(--space-2)", maxWidth: 420 }}>
            Watch full 4K highlight reels from our most memorable events.
          </p>
        </motion.div>

        {/* Video Grid / Empty State */}
        {videos.length === 0 ? (
          <EmptyVideoGrid />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "var(--space-5)",
            }}
          >
            {videos.slice(0, 4).map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
