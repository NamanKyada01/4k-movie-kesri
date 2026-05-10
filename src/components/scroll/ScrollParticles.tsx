"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  baseVy: number; 
}

/**
 * Atmospheric drifting particles.
 * Removed mouse attraction/gravity logic as per user request.
 */
export function ScrollParticles({ count = 40 }: { count?: number; gravityFlipped?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const spawn = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      particles.current = Array.from({ length: count }, () => {
        const baseVy = -(0.2 + Math.random() * 0.5); // Slower, more elegant rise
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: baseVy,
          baseVy,
          size: 1 + Math.random() * 2,
          alpha: 0.1 + Math.random() * 0.4,
          decay: 0.001 + Math.random() * 0.002,
        };
      });
    };

    spawn();

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles.current) {
        // Natural drift
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        // Reset if alpha gone or out of bounds
        if (p.alpha <= 0 || p.y < -20 || p.x < -20 || p.x > w + 20) {
          p.x = Math.random() * w;
          p.y = h + 10;
          p.alpha = 0.2 + Math.random() * 0.5;
          p.vy = -(0.2 + Math.random() * 0.5);
          p.vx = (Math.random() - 0.5) * 0.4;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,160,23,${Math.max(0, p.alpha).toFixed(3)})`;
        ctx.fill();
        
        // Add a tiny glow to each particle
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(212,160,23,0.3)";
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const ro = new ResizeObserver(spawn);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
