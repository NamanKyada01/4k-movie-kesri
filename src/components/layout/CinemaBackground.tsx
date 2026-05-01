"use client";

import React from "react";
import { Particles } from "@/components/ui/Particles";

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
      {/* Dynamic Particles Background */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.18, zIndex: 0 }}>
        <Particles 
          particleCount={40}
          particleColors={["#D4A017", "#F5D76E", "#C8102E"]}
          speed={0.03}
          particleBaseSize={55}
        />
      </div>

    </div>
  );
}
