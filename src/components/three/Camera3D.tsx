"use client";

import { useRef, useState, useCallback, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { CameraScene } from "./CameraScene";

// ── Loading placeholder ───────────────────────────────────────────────────
function CameraFallback() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div className="camera3d-loader">
        <div className="camera3d-loader-ring" />
        <span className="camera3d-loader-txt">Loading 3D…</span>
      </div>
    </div>
  );
}

// ── Main 3D Camera Component ──────────────────────────────────────────────
export function Camera3D() {
  // Scroll tracking
  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const [scrollVal, setScrollVal] = useState(0);

  useMotionValueEvent(smoothScroll, "change", (v) => {
    setScrollVal(v);
  });

  // Mouse parallax
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setMouse({
      x: ((e.clientX - cx) / (rect.width / 2)),
      y: ((e.clientY - cy) / (rect.height / 2)),
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Drag state
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    setDragging(true);
    dragStart.current = { x: e.clientX - dragDelta.x, y: e.clientY - dragDelta.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [dragDelta]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    setDragDelta({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    setDragging(false);
    // Slowly return drag delta to 0
    setDragDelta(prev => ({ x: prev.x * 0.5, y: prev.y * 0.5 }));
  }, []);

  return (
    <div
      ref={containerRef}
      className="camera3d-wrapper"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      {/* Hint badge */}
      <div className="camera3d-hint">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4M12 16h.01"/>
        </svg>
        Drag to rotate
      </div>

      {/* Gold glow behind canvas */}
      <div className="camera3d-glow" />

      <Canvas
        camera={{ position: [0, 0, 6], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <CameraScene
            scrollY={scrollVal}
            mouseX={mouse.x}
            mouseY={mouse.y}
            isDragging={isDragging.current}
            dragDelta={dragDelta}
          />
        </Suspense>
      </Canvas>

      <style>{`
        .camera3d-wrapper {
          position: relative;
          width: 420px;
          height: 420px;
          flex-shrink: 0;
          user-select: none;
          touch-action: none;
        }

        .camera3d-glow {
          position: absolute;
          inset: 10%;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(212,160,23,0.18) 0%, transparent 70%);
          filter: blur(30px);
          pointer-events: none;
          z-index: 0;
          animation: camera3d-glow-pulse 4s ease-in-out infinite;
        }
        @keyframes camera3d-glow-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1.0; transform: scale(1.08); }
        }

        .camera3d-hint {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(10,10,10,0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(212,160,23,0.2);
          border-radius: 100px;
          padding: 5px 12px;
          font-size: 0.6rem;
          font-weight: 600;
          color: rgba(212,160,23,0.8);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          pointer-events: none;
          white-space: nowrap;
        }

        .camera3d-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .camera3d-loader-ring {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(212,160,23,0.15);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .camera3d-loader-txt {
          font-size: 0.65rem;
          color: rgba(212,160,23,0.5);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
        }

        /* Mobile: hide 3D (matches hero-stats-card breakpoint) */
        @media (max-width: 900px) {
          .camera3d-wrapper { display: none; }
        }
      `}</style>
    </div>
  );
}
