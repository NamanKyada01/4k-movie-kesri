"use client";

import React from "react";

export default function DashboardSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          style={{
            height: 180,
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: 12,
            position: "relative",
            overflow: "hidden",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Shimmer Effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "200%",
              height: "100%",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
              animation: "shimmer 2s infinite linear",
            }}
          />
          
          <div style={{ width: "40%", height: 16, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
          <div style={{ width: "80%", height: 24, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
          <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "30%", height: 12, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
            <div style={{ width: "20%", height: 12, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
          </div>

          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(50%); }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}
