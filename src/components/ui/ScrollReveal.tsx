"use client";

import React from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
}

/**
 * ScrollReveal Passthrough
 * Standardized as part of the de-scrolling initiative to reduce animation overhead
 * while maintaining layout structure.
 */
export function ScrollReveal({ children }: ScrollRevealProps) {
  return <>{children}</>;
}

export default ScrollReveal;
