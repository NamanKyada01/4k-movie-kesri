"use client";

import React from "react";

interface BorderGlowProps {
  children: React.ReactNode;
  color?: string;
  duration?: string;
  padding?: string;
  active?: boolean;
}

export default function BorderGlow({ 
  children, 
  color = "var(--accent)", 
  duration = "6s",
  padding = "1.5px",
  active = true
}: BorderGlowProps) {
  return (
    <div style={{
      position: "relative",
      padding: padding,
      borderRadius: "inherit",
      overflow: "visible",
      display: "flex"
    }}>
      {/* Animated Background */}
      {active && (
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: `conic-gradient(from 0deg, transparent, ${color}, transparent 50%, ${color}, transparent)`,
          borderRadius: "inherit",
          animation: `rotateGlow ${duration} linear infinite`,
          zIndex: 0,
          opacity: 0.6
        }} />
      )}
      
      {/* Glow Blur Layer */}
      {active && (
        <div style={{
          position: "absolute",
          top: "-2px", left: "-2px", right: "-2px", bottom: "-2px",
          background: `conic-gradient(from 0deg, transparent, ${color}, transparent 50%, ${color}, transparent)`,
          borderRadius: "inherit",
          animation: `rotateGlow ${duration} linear infinite`,
          zIndex: 0,
          filter: "blur(12px)",
          opacity: 0.3
        }} />
      )}

      {/* Content Wrapper */}
      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        borderRadius: "inherit",
        background: "rgba(10,10,11,1)", // Matches site dark bg
        display: "flex"
      }}>
        {children}
      </div>

      <style jsx global>{`
        @keyframes rotateGlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
