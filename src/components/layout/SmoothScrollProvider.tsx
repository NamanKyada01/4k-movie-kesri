"use client";

import { useEffect, useRef, ReactNode } from "react";
import Lenis from "lenis";
import { useScrollPhysics } from "@/components/three/ScrollPhysicsStore";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const lastScrollY = useRef(0);
  const lastTime = useRef(performance.now());
  const rafRef = useRef<number>(0);

  const { setScroll, setMouse, setNearBottom } = useScrollPhysics();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);

      const y = lenis.scroll;
      const now = performance.now();
      const dt = Math.max(now - lastTime.current, 1);
      const velocity = Math.abs((y - lastScrollY.current) / dt) * 1000; // px/s

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? y / docHeight : 0;
      const isNearBottom = docHeight - y < 300;

      setScroll(y, Math.min(velocity, 3000), progress);
      setNearBottom(isNearBottom);

      lastScrollY.current = y;
      lastTime.current = now;
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    const handleMouse = (e: MouseEvent) => {
      setMouse(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [setScroll, setMouse, setNearBottom]);

  return <>{children}</>;
}
