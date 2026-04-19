"use client";

import React from "react";

type OrbColor = 
  | "amber" 
  | "gold" 
  | "indigo" 
  | "violet" 
  | "cyan" 
  | "emerald" 
  | "teal" 
  | "rose" 
  | "sepia" 
  | "blue";

interface CinemaBackgroundProps {
  theme: {
    primary: OrbColor;
    secondary: OrbColor;
    accent?: OrbColor;
  };
}

export function CinemaBackground({ theme }: CinemaBackgroundProps) {
  return (
    <div 
      style={{ 
        position: "fixed", 
        inset: 0, 
        zIndex: -1, 
        overflow: "hidden", 
        pointerEvents: "none",
        background: "var(--bg-primary)"
      }}
    >
      {/* Primary Orb - Top Right */}
      <div 
        className={`cinema-orb orb-${theme.primary} orb-pulse`}
        style={{ 
          top: "-10%", 
          right: "-10%", 
          width: "70vw", 
          height: "70vw",
          maxWidth: "800px",
          maxHeight: "800px"
        }} 
      />

      {/* Secondary Orb - Bottom Left */}
      <div 
        className={`cinema-orb orb-${theme.secondary} orb-pulse-delayed`}
        style={{ 
          bottom: "-10%", 
          left: "-10%", 
          width: "60vw", 
          height: "60vw",
          maxWidth: "700px",
          maxHeight: "700px" 
        }} 
      />

      {/* Optional Accent Orb - Middle Right/Left */}
      {theme.accent && (
        <div 
          className={`cinema-orb orb-${theme.accent} orb-pulse`}
          style={{ 
            top: "40%", 
            left: "70%", 
            width: "40vw", 
            height: "40vw",
            maxWidth: "500px",
            maxHeight: "500px",
            opacity: 0.1
          }} 
        />
      )}

      {/* Overlay Grain/Noise (reusing global if needed, but here's a local one for extra depth) */}
      <div 
        style={{ 
          position: "absolute", 
          inset: 0, 
          opacity: 0.02, 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />
    </div>
  );
}
