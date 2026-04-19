"use client";

import React, { useRef, useState, useCallback } from "react";

interface BorderGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  glowColor?: string;
  glowSize?: number;
}

export const BorderGlow = ({
  children,
  className = "",
  containerClassName = "",
  borderRadius = "12px",
  glowColor = "rgba(232, 85, 10, 0.4)", // Amber/Orange glow by default
  glowSize = 120,
  ...props
}: BorderGlowProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block overflow-hidden ${containerClassName}`}
      style={{ borderRadius }}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(${glowSize}px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 50%)`,
          borderRadius,
        }}
      />
      <div className={`relative z-10 ${className}`}>{children}</div>
    </div>
  );
};

export default BorderGlow;
