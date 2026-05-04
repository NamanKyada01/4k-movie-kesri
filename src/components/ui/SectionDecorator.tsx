"use client";

import { motion } from "framer-motion";
import React from "react";

interface SectionDecoratorProps {
  watermark?: string;
  showGrain?: boolean;
  showCorners?: boolean;
}

export const SectionDecorator: React.FC<SectionDecoratorProps> = ({
  watermark,
  showGrain = true,
  showCorners = true,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* ── Grain Texture ── */}
      {showGrain && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* ── Section Watermark ── */}
      {watermark && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-5deg)",
            fontSize: "25vw",
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            color: "rgba(255,255,255,0.02)",
            whiteSpace: "nowrap",
            userSelect: "none",
            letterSpacing: "-0.05em",
          }}
        >
          {watermark}
        </div>
      )}

      {/* ── Corner Brackets ── */}
      {showCorners && (
        <div className="container" style={{ position: "relative", height: "100%" }}>
          {/* Top Left */}
          <div
            style={{
              position: "absolute",
              top: "var(--space-8)",
              left: "clamp(1rem, 4vw, 3rem)",
              width: 40,
              height: 40,
              borderTop: "1px solid rgba(212,160,23,0.1)",
              borderLeft: "1px solid rgba(212,160,23,0.1)",
            }}
          />
          {/* Bottom Right */}
          <div
            style={{
              position: "absolute",
              bottom: "var(--space-8)",
              right: "clamp(1rem, 4vw, 3rem)",
              width: 40,
              height: 40,
              borderBottom: "1px solid rgba(212,160,23,0.1)",
              borderRight: "1px solid rgba(212,160,23,0.1)",
            }}
          />
        </div>
      )}
    </div>
  );
};
