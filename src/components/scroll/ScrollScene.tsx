"use client";

import { createContext, useContext, useRef } from "react";
import { useScroll, MotionValue } from "framer-motion";

interface ScrollSceneContext {
  scrollYProgress: MotionValue<number>;
}

const ScrollSceneCtx = createContext<ScrollSceneContext | null>(null);

export function useScrollScene() {
  const ctx = useContext(ScrollSceneCtx);
  if (!ctx) throw new Error("useScrollScene must be used inside <ScrollScene>");
  return ctx;
}

export function ScrollScene({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <ScrollSceneCtx.Provider value={{ scrollYProgress }}>
      <div ref={ref}>{children}</div>
    </ScrollSceneCtx.Provider>
  );
}
