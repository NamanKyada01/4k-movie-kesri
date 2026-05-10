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
      className="cinema-bg-container"
      style={{ 
        position: "fixed", 
        inset: 0, 
        zIndex: -1, 
        overflow: "hidden", 
        pointerEvents: "none",
        background: "#050505"
      }}
    >
      {/* ── Technical Grid Base ── */}
      <div className="bg-grid-pattern" />

      {/* ── Epic Aurora Ribbons ── */}
      <div className="aurora-system">
        <div className={`aurora aurora-1 leak-${theme.primary}`} />
        <div className={`aurora aurora-2 leak-${theme.secondary}`} />
        <div className={`aurora aurora-3 leak-${theme.accent || 'sepia'}`} />
      </div>

      {/* ── Depth Vignette ── */}
      <div className="aurora-vignette" />

      {/* ── Minimalist Drifting Particles ── */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.05, zIndex: 0 }}>
        <Particles 
          particleCount={15}
          particleColors={["#D4A017", "#ffffff"]}
          speed={0.01}
          particleBaseSize={25}
        />
      </div>

      <style>{`
        .cinema-bg-container {
          background: #050505;
        }

        /* ── Grid Pattern ── */
        .bg-grid-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(circle at 50% 50%, black, transparent 90%);
          -webkit-mask-image: radial-gradient(circle at 50% 50%, black, transparent 90%);
        }

        /* ── Aurora Ribbons ── */
        .aurora-system {
          position: absolute;
          inset: -20%;
          filter: blur(140px);
          opacity: 0.22;
        }

        .aurora {
          position: absolute;
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          will-change: transform, opacity;
        }

        .aurora-1 {
          width: 120vw; height: 60vh;
          top: -10%; left: -10%;
          animation: aurora-drift-1 50s ease-in-out infinite alternate;
        }
        .aurora-2 {
          width: 100vw; height: 80vh;
          bottom: -10%; right: -10%;
          animation: aurora-drift-2 65s ease-in-out infinite alternate;
        }
        .aurora-3 {
          width: 80vw; height: 50vh;
          top: 30%; left: 20%;
          animation: aurora-drift-3 45s ease-in-out infinite alternate;
          opacity: 0.4;
        }

        @keyframes aurora-drift-1 {
          0% { transform: rotate(0deg) translate(0, 0) scale(1); opacity: 0.6; }
          100% { transform: rotate(15deg) translate(10%, 15%) scale(1.2); opacity: 0.9; }
        }
        @keyframes aurora-drift-2 {
          0% { transform: rotate(0deg) translate(0, 0) scale(1.2); opacity: 0.5; }
          100% { transform: rotate(-20deg) translate(-15%, -10%) scale(1.0); opacity: 0.8; }
        }
        @keyframes aurora-drift-3 {
          0% { transform: translate(0, 0) scale(0.8); }
          100% { transform: translate(20%, -20%) scale(1.3); }
        }

        .aurora-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, transparent 20%, #050505 100%);
          z-index: 2;
        }

        /* ── Colors ── */
        .leak-amber   { background: #d4a017; }
        .leak-gold    { background: #f5d76e; }
        .leak-indigo  { background: #4b0082; }
        .leak-violet  { background: #8f00ff; }
        .leak-cyan    { background: #00ffff; }
        .leak-emerald { background: #50c878; }
        .leak-teal    { background: #008080; }
        .leak-rose    { background: #ff007f; }
        .leak-sepia   { background: #704214; }
        .leak-blue    { background: #0000ff; }
      `}</style>
    </div>
  );
}
