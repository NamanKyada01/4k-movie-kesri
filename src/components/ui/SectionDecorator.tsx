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
