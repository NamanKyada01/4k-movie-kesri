"use client";

import { useEffect, useRef, useState } from "react";

export function MagneticCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("data-cursor") === "hover"
      ) {
        setIsHovering(true);
      }
    };

    const onLeave = () => setIsHovering(false);
    const onHide  = () => setIsVisible(false);
    const onShow  = () => setIsVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onEnter, { passive: true });
    window.addEventListener("mouseout",  onLeave, { passive: true });
    document.addEventListener("mouseleave", onHide);
    document.addEventListener("mouseenter", onShow);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onEnter);
      window.removeEventListener("mouseout",  onLeave);
      document.removeEventListener("mouseleave", onHide);
      document.removeEventListener("mouseenter", onShow);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  return (
    <>
      {/* Solid dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width:  10,
          height: 10,
          borderRadius: "50%",
          background: isHovering ? "var(--gold)" : "var(--accent)",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: isVisible ? 1 : 0,
          transition: "background 0.2s ease, opacity 0.3s ease",
          willChange: "transform",
          mixBlendMode: "normal",
        }}
      />
      {/* Lagging ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width:  isHovering ? 52 : 40,
          height: isHovering ? 52 : 40,
          borderRadius: "50%",
          border: `1.5px solid ${isHovering ? "var(--gold)" : "var(--accent)"}`,
          pointerEvents: "none",
          zIndex: 99998,
          opacity: isVisible ? (isHovering ? 0.7 : 0.4) : 0,
          transition: "width 0.3s cubic-bezier(0.34,1.56,0.64,1), height 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s ease, opacity 0.3s ease",
          willChange: "transform",
          marginLeft: isHovering ? -6 : 0,
          marginTop:  isHovering ? -6 : 0,
        }}
      />
    </>
  );
}
